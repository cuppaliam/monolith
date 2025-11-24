'use client';

import { useState, useMemo } from 'react';
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

import { tasks as initialTasks, columns as initialColumns } from '@/lib/data';
import type { Column, Task } from '@/lib/types';

import KanbanColumn from './kanban-column';
import { Button } from '../ui/button';

function generateId() {
  return Math.floor(Math.random() * 10001);
}

export default function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  function createNewColumn(atIndex: number) {
    const newColumn: Column = {
      id: `col-${generateId()}`,
      title: `New Section`,
    };
    const newColumns = [...columns];
    newColumns.splice(atIndex, 0, newColumn);
    setColumns(newColumns);
  }

  function updateColumn(id: string, title: string) {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });
    setColumns(newColumns);
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

    // Dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);
        
        if (tasks[activeIndex].status !== tasks[overIndex].status) {
          tasks[activeIndex].status = tasks[overIndex].status;
          return arrayMove(tasks, activeIndex, overIndex);
        }
        
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }
    
    const isOverAColumn = over.data.current?.type === 'Column';

    // Dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
        setTasks((tasks) => {
            const activeIndex = tasks.findIndex((t) => t.id === activeId);
            if (tasks[activeIndex].status !== overId) {
                tasks[activeIndex].status = overId;
                return arrayMove(tasks, activeIndex, activeIndex);
            }
            return tasks;
        });
    }
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;
    
    const isActiveAColumn = active.data.current?.type === 'Column';
    if (isActiveAColumn) {
       setColumns((columns) => {
        const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
        const overColumnIndex = columns.findIndex((col) => col.id === overId);
        return arrayMove(columns, activeColumnIndex, overColumnIndex);
      });
      return;
    }
  }

  return (
    <div className="flex gap-1 items-start overflow-x-auto pb-4 -mx-8 px-8">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="flex gap-1">
          <SortableContext items={columnsId}>
            {columns.map((col, index) => (
              <div key={col.id} className="flex gap-1 items-start">
                <KanbanColumn
                  column={col}
                  tasks={tasks.filter((task) => task.status === col.id)}
                  updateColumn={updateColumn}
                />
                <div className="relative group h-full">
                  <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-muted-foreground/20 group-hover:bg-primary transition-colors duration-300"></div>
                  <button
                    onClick={() => createNewColumn(index + 1)}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full bg-background group-hover:bg-primary group-hover:text-primary-foreground text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <Plus size={16} />
                  </button>
                  <div className="w-4 h-full" />
                </div>
              </div>
            ))}
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
}
