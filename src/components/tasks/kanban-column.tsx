'use client';

import { useMemo } from 'react';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import type { Column, Task, Project } from '@/lib/types';
import TaskCard from './task-card';
import { projects } from '@/lib/data';

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
}

export default function KanbanColumn({ column, tasks }: KanbanColumnProps) {
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);
  
  const getProject = (projectId: string): Project | undefined => projects.find(p => p.id === projectId);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="w-80 flex-shrink-0 bg-muted/50 rounded-lg border-2 border-primary"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-80 flex-shrink-0"
    >
      <div
        {...attributes}
        {...listeners}
        className="flex items-center justify-between mb-4 cursor-grab"
      >
        <h2 className="text-lg font-semibold font-heading flex items-center gap-2">
          {column.title}
          <span className="text-sm font-normal bg-muted text-muted-foreground rounded-full px-2 py-0.5">
            {tasks.length}
          </span>
        </h2>
      </div>
      <div className="space-y-4 h-full">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} project={getProject(task.projectId)} />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
            <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30">
                <p className="text-sm text-muted-foreground">No tasks here</p>
            </div>
        )}
      </div>
    </div>
  );
}
