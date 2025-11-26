
'use client';

import StatCard from '@/components/dashboard/stat-card';
import UpcomingTasks from '@/components/dashboard/upcoming-tasks';
import HabitsOverview from '@/components/dashboard/habits-overview';
import WeeklyOverviewChart from '@/components/dashboard/weekly-overview-chart';
import ProjectGoals from '@/components/dashboard/project-goals';
import { Clock, CheckCircle, Repeat } from 'lucide-react';
import { useCollection, useFirebase, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { TimeEntry, Task, Habit, HabitLog } from '@/lib/types';
import { isToday, format } from 'date-fns';
import { useMemo } from 'react';


export default function DashboardPage() {
  const { firestore } = useFirebase();
  const { user } = useUser();

  const timeEntriesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, 'time_entries'),
      where('ownerId', '==', user.uid)
    );
  }, [firestore, user]);
  const { data: timeEntries } = useCollection<TimeEntry>(timeEntriesQuery);

  const tasksQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, 'tasks'),
      where('ownerId', '==', user.uid)
    );
  }, [firestore, user]);
  const { data: tasks } = useCollection<Task>(tasksQuery);

  const habitsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/habits`);
  }, [firestore, user]);
  const { data: habits } = useCollection<Habit>(habitsQuery);
  
  const habitLogsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/habit_logs`);
  }, [firestore, user]);
  const { data: habitLogs } = useCollection<HabitLog>(habitLogsQuery);

  const { totalHoursToday, tasksCompletedToday, habitsCompletedToday, totalActiveHabits } = useMemo(() => {
    const totalHoursToday = (timeEntries ?? [])
      .filter(entry => entry.startTime && isToday(new Date(entry.startTime)))
      .reduce((acc, entry) => acc + entry.duration, 0) / 3600;

    const tasksCompletedToday = (tasks ?? []).filter(task => 
      task.status === 'done' && task.createdAt && isToday(new Date(task.createdAt))
    ).length;
    
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const todaysLogs = (habitLogs ?? []).filter(log => log.date === todayStr);
    const habitsCompletedToday = todaysLogs.length;
    const totalActiveHabits = (habits ?? []).filter(h => h.active).length;

    return { totalHoursToday, tasksCompletedToday, habitsCompletedToday, totalActiveHabits };
  }, [timeEntries, tasks, habits, habitLogs]);


  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      <header>
        <h1 className="text-3xl font-heading font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, here's your productivity snapshot.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          title="Time Logged Today" 
          value={`${totalHoursToday.toFixed(1)}h`}
          icon={Clock}
          href="/time"
        />
        <StatCard 
          title="Tasks Completed Today" 
          value={tasksCompletedToday.toString()} 
          icon={CheckCircle}
          href="/tasks"
        />
        <StatCard 
          title="Habits Completed" 
          value={`${habitsCompletedToday} / ${totalActiveHabits}`}
          icon={Repeat} 
          href="/habits"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <UpcomingTasks />
          <ProjectGoals />
        </div>
        <div className="space-y-8">
          <HabitsOverview />
        </div>
         <div className="lg:col-span-3">
          <h2 className="text-2xl font-heading font-bold mb-4">Weekly Overview</h2>
          <div className="h-[350px] md:h-[400px]">
            <WeeklyOverviewChart />
          </div>
        </div>
      </div>
    </div>
  );
}
