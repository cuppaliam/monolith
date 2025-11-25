export type Project = {
  id: string;
  name: string;
  color: string;
  status: 'active' | 'archived' | 'completed';
  hoursPerWeek: number;
};

export type TaskStatus = 'todo' | 'inprogress' | 'done' | 'backlog';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type Id = string | number;

export type Column = {
  id: Id;
  title: string;
};

export type Task = {
  id: Id;
  status: Id;
  title: string;
  priority: TaskPriority;
  dueDate: string;
  projectId: string;
  createdAt: string;
};

export type TimeEntry = {
  id: string;
  projectId: string;
  startTime: string;
  endTime: string;
  duration: number; // in seconds
};

export type Habit = {
  id: string;
  name: string;
  active: boolean;
  period: 'day' | 'week';
  frequency: number;
  goal: 'build' | 'stop';
  color: string;
};

export type HabitLog = {
  habitId: string;
  date: string; // YYYY-MM-DD
};
