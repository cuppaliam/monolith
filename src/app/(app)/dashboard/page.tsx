import StatCard from '@/components/dashboard/stat-card';
import TasksOverview from '@/components/dashboard/tasks-overview';
import HabitsOverview from '@/components/dashboard/habits-overview';
import TimeTrackingOverview from '@/components/dashboard/time-tracking-overview';
import TimePerProjectChart from '@/components/reports/time-per-project-chart';
import { tasks, timeEntries } from '@/lib/data';
import { Clock, ListTodo, CheckCircle } from 'lucide-react';
import { isToday } from 'date-fns';

export default function DashboardPage() {
  const totalHoursToday = timeEntries
    .filter(entry => isToday(new Date(entry.startTime)))
    .reduce((acc, entry) => acc + entry.duration, 0) / 3600;

  const tasksCompletedToday = tasks.filter(task => task.status === 'done' && isToday(new Date(task.createdAt))).length;
  
  const tasksDueToday = tasks.filter(task => isToday(new Date(task.dueDate)) && task.status !== 'done').length;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-heading font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, here's your productivity snapshot.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          title="Time Tracked Today" 
          value={`${totalHoursToday.toFixed(1)}h`}
          icon={Clock} 
        />
        <StatCard 
          title="Tasks Completed Today" 
          value={tasksCompletedToday.toString()} 
          icon={CheckCircle}
        />
        <StatCard 
          title="Tasks Due Today" 
          value={tasksDueToday.toString()} 
          icon={ListTodo} 
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <TasksOverview />
          <TimeTrackingOverview />
        </div>
        <div className="space-y-8">
          <HabitsOverview />
        </div>
      </div>
      
       <div>
          <h2 className="text-2xl font-heading font-bold mb-4">Project Time Distribution</h2>
          <div className="h-[400px]">
            <TimePerProjectChart />
          </div>
        </div>
    </div>
  );
}
