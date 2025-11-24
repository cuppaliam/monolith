export type Project = {
  id: string;
  name: string;
  color: string;
};

export type TaskStatus = 'todo' | 'inprogress' | 'done' | 'backlog';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
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
  frequency: number; // times per week
  color: string;
};

export type HabitLog = {
  habitId: string;
  date: string; // YYYY-MM-DD
};
