
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
  DragOverlay,
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import { Plus } from 'lucide-react';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, doc, query } from 'firebase/firestore';
import { setDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { Column, Task } from '@/lib/types';
import KanbanColumn from './kanban-column';
import { Button } from '../ui/button';
import TaskCard from './task-card';

export default function KanbanBoard() {
  const { firestore } = useFirebase();

  const columnsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'columns'));
  }, [firestore]);
  const { data: initialColumns } = useCollection<Column>(columnsQuery);

  const [columns, setColumns] = useState<Column[]>([]);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  useEffect(() => {
    if (initialColumns) {
      // Sort by order
      const sorted = [...initialColumns].sort((a, b) => a.order - b.order);
      setColumns(sorted);
    }
  }, [initialColumns]);

  const tasksQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'tasks'));
  }, [firestore]);
  const { data: initialTasks } = useCollection<Task>(tasksQuery);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

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
  
  function createNewColumn() {
    if (!firestore) return;
    const newColumn: Omit<Column, 'id'> = {
      title: `Column ${columns.length + 1}`,
      order: columns.length + 1,
    };
    const columnsCollection = collection(firestore, 'columns');
    addDocumentNonBlocking(columnsCollection, newColumn);
  }

  function updateColumn(updatedColumn: Column) {
    if (!firestore) return;
    const colRef = doc(firestore, 'columns', updatedColumn.id.toString());
    setDocumentNonBlocking(colRef, updatedColumn, { merge: true });
    setColumns(prev => prev.map(c => c.id === updatedColumn.id ? updatedColumn : c));
  }
  
  function updateTask(updatedTask: Task) {
    if (!firestore) return;
    const taskRef = doc(firestore, 'tasks', updatedTask.id.toString());
    setDocumentNonBlocking(taskRef, updatedTask, { merge: true });
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === 'Task') {
      setActiveTask(event.active.data.current.task);
      return;
    }
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
                const updatedTask = { ...tasks[activeIndex], status: overId as string };
                updateTask(updatedTask);
                return arrayMove(tasks, activeIndex, activeIndex);
            }
            return tasks;
        });
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    
    if (activeId === overId) return;
    
    const isActiveAColumn = active.data.current?.type === "Column";
    if (isActiveAColumn) {
      setColumns(columns => {
        const activeColumnIndex = columns.findIndex(col => col.id === activeId);
        const overColumnIndex = columns.findIndex(col => col.id === overId);

        const newOrder = arrayMove(columns, activeColumnIndex, overColumnIndex);
        
        // Update order in firestore
        newOrder.forEach((col, index) => {
          if (col.order !== index) {
            updateColumn({ ...col, order: index });
          }
        });

        return newOrder;
      });
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <div className="flex gap-4 items-start pb-4">
        <SortableContext items={columnsId}>
          {columns.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              updateColumn={updateColumn}
              tasks={tasks.filter((task) => task.status === col.id)}
            />
          ))}
        </SortableContext>
          <Button variant="outline" className="h-12 w-80 flex-shrink-0" onClick={createNewColumn}>
          <Plus className="mr-2" /> Add Column
        </Button>
      </div>
      {typeof document !== 'undefined' && createPortal(
        <DragOverlay>
          {activeTask && (
            <TaskCard task={activeTask} />
          )}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}
