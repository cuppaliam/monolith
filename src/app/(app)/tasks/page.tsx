
import KanbanBoard from '@/components/tasks/kanban-board';
import { TaskActions } from '@/components/tasks/task-actions';

export const dynamic = 'force-dynamic';

export default function TasksPage() {
  return (
    <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold">Tasks</h1>
          <p className="text-muted-foreground">Organize your work with the Kanban board.</p>
        </div>
        <TaskActions />
      </header>
      <div className="flex-grow overflow-x-auto">
        <KanbanBoard />
      </div>
    </div>
  );
}
