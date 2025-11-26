
'use client';
import WeeklyOverviewChart from "@/components/dashboard/weekly-overview-chart";
import HabitCompletionChart from "@/components/reports/habit-completion-chart";
import TimeLogTable from "@/components/time/time-log-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCollection, useFirebase, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { TimeEntry } from '@/lib/types';
import TimePerProjectChart from "@/components/reports/time-per-project-chart";

export const dynamic = 'force-dynamic';

export default function ReportsPage() {
  const { firestore } = useFirebase();
  const { user } = useUser();
  const timeEntriesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'time_entries'), where('ownerId', '==', user.uid));
  }, [firestore, user]);
  const { data: timeEntries } = useCollection<TimeEntry>(timeEntriesQuery);

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      <header>
        <h1 className="text-3xl font-heading font-bold">Reports</h1>
        <p className="text-muted-foreground">Visualize your productivity and track your progress over time.</p>
      </header>
      
      <div className="grid gap-8 md:grid-cols-1">
         <Card>
          <CardHeader>
            <CardTitle>Weekly Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] md:h-[400px]">
              <WeeklyOverviewChart />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Time per Project</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <TimePerProjectChart />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Habit Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <HabitCompletionChart />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="overflow-x-auto">
        <TimeLogTable entries={timeEntries ?? []} />
      </div>
    </div>
  );
}
