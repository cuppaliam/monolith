import type { Task, TaskStatus } from '@/lib/types';
import TaskCard from './task-card';

interface KanbanColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
}

export default function KanbanColumn({ status, title, tasks }: KanbanColumnProps) {
  return (
    <div className="w-80 flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold font-heading flex items-center gap-2">
          {title}
          <span className="text-sm font-normal bg-muted text-muted-foreground rounded-full px-2 py-0.5">
            {tasks.length}
          </span>
        </h2>
      </div>
      <div className="space-y-4 h-full">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
            <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30">
                <p className="text-sm text-muted-foreground">No tasks here</p>
            </div>
        )}
      </div>
    </div>
  );
}
