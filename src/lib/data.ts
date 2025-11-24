import type { Project, Task, TimeEntry, Habit, HabitLog } from './types';
import { subDays, formatISO, startOfWeek, addDays, format } from 'date-fns';

export const projects: Project[] = [
  { id: 'proj-1', name: 'Monolith App', color: 'hsl(var(--chart-1))' },
  { id: 'proj-2', name: 'Client Website', color: 'hsl(var(--chart-2))' },
  { id: 'proj-3', name: 'Internal Tools', color: 'hsl(var(--chart-3))' },
  { id: 'proj-4', name: 'Marketing Campaign', color: 'hsl(var(--chart-4))' },
];

export const tasks: Task[] = [
  { id: 'task-1', title: 'Design dashboard UI', status: 'done', priority: 'high', dueDate: formatISO(subDays(new Date(), 2)), projectId: 'proj-1', createdAt: formatISO(subDays(new Date(), 5)) },
  { id: 'task-2', title: 'Implement Kanban board', status: 'inprogress', priority: 'high', dueDate: formatISO(new Date()), projectId: 'proj-1', createdAt: formatISO(subDays(new Date(), 4)) },
  { id: 'task-3', title: 'Setup authentication', status: 'done', priority: 'urgent', dueDate: formatISO(subDays(new Date(), 3)), projectId: 'proj-1', createdAt: formatISO(subDays(new Date(), 6)) },
  { id: 'task-4', title: 'Develop time tracking feature', status: 'inprogress', priority: 'medium', dueDate: formatISO(addDays(new Date(), 3)), projectId: 'proj-1', createdAt: formatISO(subDays(new Date(), 2)) },
  { id: 'task-5', title: 'Create landing page mockups', status: 'todo', priority: 'medium', dueDate: formatISO(addDays(new Date(), 5)), projectId: 'proj-2', createdAt: formatISO(subDays(new Date(), 1)) },
  { id: 'task-6', title: 'Write copy for ad campaign', status: 'backlog', priority: 'low', dueDate: formatISO(addDays(new Date(), 10)), projectId: 'proj-4', createdAt: formatISO(new Date()) },
  { id: 'task-7', title: 'Fix reporting chart bug', status: 'todo', priority: 'urgent', dueDate: formatISO(addDays(new Date(), 1)), projectId: 'proj-3', createdAt: formatISO(subDays(new Date(), 1)) },
  { id: 'task-8', title: 'Deploy staging environment', status: 'todo', priority: 'high', dueDate: formatISO(addDays(new Date(), 2)), projectId: 'proj-3', createdAt: formatISO(new Date()) },
];

export const timeEntries: TimeEntry[] = [
    { id: 'te-1', projectId: 'proj-1', startTime: subDays(new Date(), 2).toISOString(), endTime: subDays(new Date(), 2).toISOString(), duration: 7200 },
    { id: 'te-2', projectId: 'proj-2', startTime: subDays(new Date(), 2).toISOString(), endTime: subDays(new Date(), 2).toISOString(), duration: 3600 },
    { id: 'te-3', projectId: 'proj-1', startTime: subDays(new Date(), 1).toISOString(), endTime: subDays(new Date(), 1).toISOString(), duration: 10800 },
    { id: 'te-4', projectId: 'proj-3', startTime: subDays(new Date(), 1).toISOString(), endTime: subDays(new Date(), 1).toISOString(), duration: 5400 },
    { id: 'te-5', projectId: 'proj-4', startTime: new Date().toISOString(), endTime: new Date().toISOString(), duration: 1800 },
];

export const habits: Habit[] = [
  { id: 'habit-1', name: 'Morning workout', frequency: 5, color: 'hsl(var(--chart-1))' },
  { id: 'habit-2', name: 'Read 20 pages', frequency: 7, color: 'hsl(var(--chart-2))' },
  { id: 'habit-3', name: 'Meditate', frequency: 7, color: 'hsl(var(--chart-3))' },
  { id: 'habit-4', name: 'Practice coding', frequency: 4, color: 'hsl(var(--chart-4))' },
];

const today = new Date();
const weekStart = startOfWeek(today, { weekStartsOn: 1 });
export const habitLogs: HabitLog[] = [
    // Week 1
    { habitId: 'habit-1', date: format(addDays(weekStart, 0), 'yyyy-MM-dd') },
    { habitId: 'habit-1', date: format(addDays(weekStart, 2), 'yyyy-MM-dd') },
    { habitId: 'habit-2', date: format(addDays(weekStart, 0), 'yyyy-MM-dd') },
    { habitId: 'habit-2', date: format(addDays(weekStart, 1), 'yyyy-MM-dd') },
    { habitId: 'habit-2', date: format(addDays(weekStart, 2), 'yyyy-MM-dd') },
    { habitId: 'habit-2', date: format(addDays(weekStart, 3), 'yyyy-MM-dd') },
    { habitId: 'habit-3', date: format(addDays(weekStart, 0), 'yyyy-MM-dd') },
    { habitId: 'habit-3', date: format(addDays(weekStart, 1), 'yyyy-MM-dd') },
    { habitId: 'habit-3', date: format(addDays(weekStart, 2), 'yyyy-MM-dd') },
    { habitId: 'habit-4', date: format(addDays(weekStart, 1), 'yyyy-MM-dd') },
];
