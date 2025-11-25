
export type Project = {
  id: string;
  name: string;
  color: string;
  status: 'active' | 'archived' | 'completed';
  hoursPerWeek: number;
  ownerId: string;
};

export type TaskStatus = 'todo' | 'inprogress' | 'done' | 'backlog';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type Id = string | number;

export type Column = {
  id: Id;
  title: string;
  order: number;
  ownerId: string;
};

export type Task = {
  id: Id;
  status: Id;
  title: string;
  priority: TaskPriority;
  dueDate: string;
  projectId: string;
  createdAt?: string; // made optional
  ownerId: string;
};

export type TimeEntry = {
  id: string;
  projectId: string;
  startTime: string;
  endTime: string;
  duration: number; // in seconds
  ownerId: string;
};

export type Habit = {
  id: string;
  name: string;
  active: boolean;
  period: 'day' | 'week';
  frequency: number;
  goal: 'build' | 'stop';
  color: string;
  ownerId: string;
};

export type HabitLog = {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
};
