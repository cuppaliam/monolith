import { tasks } from '@/lib/data';
import type { Task, TaskStatus } from '@/lib/types';
import KanbanColumn from './kanban-column';

const columns: { id: TaskStatus; title: string }[] = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'todo', title: 'To Do' },
  { id: 'inprogress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

export default function KanbanBoard() {
  const tasksByColumn = columns.reduce((acc, column) => {
    acc[column.id] = tasks.filter((task) => task.status === column.id);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  return (
    <div className="flex gap-6 overflow-x-auto pb-4 -mx-8 px-8">
      {columns.map((column) => (
        <KanbanColumn
          key={column.id}
          status={column.id}
          title={column.title}
          tasks={tasksByColumn[column.id]}
        />
      ))}
    </div>
  );
}
