import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { projects } from '@/lib/data';
import type { Task } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { Calendar, MoreHorizontal } from 'lucide-react';

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const project = projects.find((p) => p.id === task.projectId);
  const priorityVariantMap = {
    low: 'secondary',
    medium: 'default',
    high: 'outline',
    urgent: 'destructive',
  } as const;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
            <CardTitle className="text-base font-medium pr-2">{task.title}</CardTitle>
            <button className="text-muted-foreground hover:text-foreground">
                <MoreHorizontal size={18} />
            </button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            <span>{format(parseISO(task.dueDate), 'MMM d')}</span>
          </div>
          {project && (
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: project.color }}
              />
              <span>{project.name}</span>
            </div>
          )}
        </div>
        <div>
          <Badge variant={priorityVariantMap[task.priority]}>{task.priority}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
