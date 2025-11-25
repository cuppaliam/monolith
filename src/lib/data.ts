
import type { Project, Task, TimeEntry, Habit, HabitLog, Column } from './types';
import { subDays, formatISO, startOfWeek, addDays, format, eachDayOfInterval } from 'date-fns';

export const projects: Project[] = [
  { id: 'proj-1', name: 'Monolith App', color: 'hsl(var(--chart-1))', status: 'active', hoursPerWeek: 20, ownerId: '1' },
  { id: 'proj-2', name: 'Client Website', color: 'hsl(var(--chart-2))', status: 'active', hoursPerWeek: 15, ownerId: '1' },
  { id: 'proj-3', name: 'Internal Tools', color: 'hsl(var(--chart-3))', status: 'archived', hoursPerWeek: 5, ownerId: '1' },
  { id: 'proj-4', name: 'Marketing Campaign', color: 'hsl(var(--chart-4))', status: 'completed', hoursPerWeek: 8, ownerId: '1' },
];

export const columns: Column[] = [
    { id: 'backlog', title: 'Backlog' },
    { id: 'todo', title: 'To Do' },
    { id: 'inprogress', title: 'In Progress' },
    { id: 'done', title: 'Done' },
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
  { id: 'habit-1', name: 'Morning workout', active: true, period: 'week', frequency: 5, goal: 'build', color: 'hsl(var(--chart-1))' },
  { id: 'habit-2', name: 'Read 20 pages', active: true, period: 'week', frequency: 7, goal: 'build', color: 'hsl(var(--chart-2))' },
  { id: 'habit-3', name: 'Meditate', active: true, period: 'day', frequency: 1, goal: 'build', color: 'hsl(var(--chart-3))' },
  { id: 'habit-4', name: 'Practice coding', active: true, period: 'week', frequency: 4, goal: 'build', color: 'hsl(var(--chart-4))' },
];

// Generate more realistic mock habit logs for the last 90 days
const generateMockLogs = (): HabitLog[] => {
  const logs: HabitLog[] = [];
  const today = new Date();
  const ninetyDaysAgo = subDays(today, 90);
  const dateInterval = eachDayOfInterval({ start: ninetyDaysAgo, end: today });

  habits.forEach(habit => {
    dateInterval.forEach(date => {
      // Simulate completion based on frequency and some randomness
      const dayOfWeek = date.getDay(); // Sunday is 0
      let shouldComplete = false;
      
      switch(habit.id) {
        case 'habit-1': // Morning workout (5 times a week)
          if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Mon-Fri
            shouldComplete = Math.random() > 0.3; // 70% chance
          }
          break;
        case 'habit-2': // Read 20 pages (7 times a week)
          shouldComplete = Math.random() > 0.2; // 80% chance
          break;
        case 'habit-3': // Meditate (daily)
          shouldComplete = Math.random() > 0.4; // 60% chance
          break;
        case 'habit-4': // Practice coding (4 times a week)
           if ([1, 2, 4, 5].includes(dayOfWeek)) { // Mon, Tue, Thu, Fri
             shouldComplete = Math.random() > 0.25; // 75% chance
           }
          break;
      }

      if (shouldComplete) {
        logs.push({
          id: `log-${habit.id}-${format(date, 'yyyy-MM-dd')}`,
          habitId: habit.id,
          date: format(date, 'yyyy-MM-dd'),
          completed: true,
        });
      }
    });
  });

  return logs;
};

export const habitLogs: HabitLog[] = generateMockLogs();
