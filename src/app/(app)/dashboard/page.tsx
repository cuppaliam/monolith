import StatCard from '@/components/dashboard/stat-card';
import UpcomingTasks from '@/components/dashboard/upcoming-tasks';
import HabitsOverview from '@/components/dashboard/habits-overview';
import WeeklyOverviewChart from '@/components/dashboard/weekly-overview-chart';
import ProjectGoals from '@/components/dashboard/project-goals';
import { tasks, timeEntries, habits, habitLogs } from '@/lib/data';
import { Clock, ListTodo, CheckCircle, Repeat } from 'lucide-react';
import { isToday, format } from 'date-fns';

export default function DashboardPage() {
  const totalHoursToday = timeEntries
    .filter(entry => isToday(new Date(entry.startTime)))
    .reduce((acc, entry) => acc + entry.duration, 0) / 3600;

  const tasksCompletedToday = tasks.filter(task => task.status === 'done' && isToday(new Date(task.createdAt))).length;
  
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todaysLogs = habitLogs.filter(log => log.date === todayStr);
  const habitsCompletedToday = todaysLogs.length;
  const totalActiveHabits = habits.filter(h => h.active).length;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-heading font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, here's your productivity snapshot.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          title="Time Logged Today" 
          value={`${totalHoursToday.toFixed(1)}h`}
          icon={Clock} 
        />
        <StatCard 
          title="Tasks Completed Today" 
          value={tasksCompletedToday.toString()} 
          icon={CheckCircle}
        />
        <StatCard 
          title="Habits Completed" 
          value={`${habitsCompletedToday} / ${totalActiveHabits}`}
          icon={Repeat} 
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <UpcomingTasks />
          <ProjectGoals />
        </div>
        <div className="space-y-8">
          <HabitsOverview />
        </div>
      </div>
      
       <div>
          <h2 className="text-2xl font-heading font-bold mb-4">Weekly Overview</h2>
          <div className="h-[400px]">
            <WeeklyOverviewChart />
          </div>
        </div>
    </div>
  );
}
