
import KanbanBoard from '@/components/tasks/kanban-board';
import { TaskActions } from '@/components/tasks/task-actions';

export const dynamic = 'force-dynamic';

export default function TasksPage() {
  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Tasks</h1>
          <p className="text-muted-foreground">Organize your work with the Kanban board.</p>
        </div>
        <TaskActions />
      </header>
      <KanbanBoard />
    </div>
  );
}
