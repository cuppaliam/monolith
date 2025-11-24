'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Task, Project } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { Calendar, MoreHorizontal } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  project?: Project;
}

export default function TaskCard({ task, project }: TaskCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  
  const priorityVariantMap = {
    low: 'secondary',
    medium: 'default',
    high: 'outline',
    urgent: 'destructive',
  } as const;

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-50"
      >
        <Card className="border-primary border-2">
            <CardHeader className="p-3">
                <div className="flex justify-between items-start">
                    <p className="text-sm font-medium pr-2">{task.title}</p>
                </div>
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-2">
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card 
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="hover:shadow-md transition-shadow cursor-grab"
    >
      <CardHeader className="p-3">
        <div className="flex justify-between items-start">
            <p className="text-sm font-medium pr-2">{task.title}</p>
            <button className="text-muted-foreground hover:text-foreground">
                <MoreHorizontal size={16} />
            </button>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-2">
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar size={12} />
            <span>{format(parseISO(task.dueDate), 'MMM d')}</span>
          </div>
          {project && (
            <div className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: project.color }}
              />
              <span>{project.name}</span>
            </div>
          )}
        </div>
        <div>
          <Badge variant={priorityVariantMap[task.priority]} className="text-xs px-2 py-0">{task.priority}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}