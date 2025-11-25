'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { useCollection, useFirebase, useUser, useMemoFirebase } from '@/firebase';
import { collection, doc, query, where } from 'firebase/firestore';
import { setDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { Column, Task } from '@/lib/types';
import KanbanColumn from './kanban-column';
import { Button } from '../ui/button';

function generateId() {
  return `task-${Date.now()}`;
}

export default function KanbanBoard() {
  const { firestore } = useFirebase();
  const { user } = useUser();

  const columns: Column[] = [
    { id: 'backlog', title: 'Backlog' },
    { id: 'todo', title: 'To Do' },
    { id: 'inprogress', title: 'In Progress' },
    { id: 'done', title: 'Done' },
  ];
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const tasksQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'tasks'), where('ownerId', '==', user.uid));
  }, [firestore, user]);
  const { data: initialTasks } = useCollection<Task>(tasksQuery);

  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (initialTasks) {
      setTasks(initialTasks);
    }
  }, [initialTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );
  
  function updateTask(updatedTask: Task) {
    if (!firestore || !user) return;
    const taskRef = doc(firestore, 'tasks', updatedTask.id.toString());
    setDocumentNonBlocking(taskRef, updatedTask, { merge: true });
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  }

  function onDragStart(event: DragStartEvent) {
    // Handling of active elements is not needed without DragOverlay
  }
  
  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === 'Task';
    const isOverATask = over.data.current?.type === 'Task';

    if (!isActiveATask) return;

    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);
        
        if (tasks[activeIndex].status !== tasks[overIndex].status) {
          const updatedTask = { ...tasks[activeIndex], status: tasks[overIndex].status };
          updateTask(updatedTask);
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }
        
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }
    
    const isOverAColumn = over.data.current?.type === 'Column';

    if (isActiveATask && isOverAColumn) {
        setTasks((tasks) => {
            const activeIndex = tasks.findIndex((t) => t.id === activeId);
            if (tasks[activeIndex].status !== overId) {
                const updatedTask = { ...tasks[activeIndex], status: overId };
                updateTask(updatedTask);
                return arrayMove(tasks, activeIndex, activeIndex);
            }
            return tasks;
        });
    }
  }

  function onDragEnd(event: DragEndEvent) {
    // No specific onDragEnd logic needed for columns as they are static.
  }

  return (
    <div className="flex gap-4 items-start overflow-x-auto pb-4 -mx-8 px-8">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="flex gap-4">
          <SortableContext items={columnsId}>
            {columns.map((col) => (
              <KanbanColumn
                key={col.id}
                column={col}
                tasks={tasks.filter((task) => task.status === col.id)}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
}
