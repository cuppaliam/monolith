
'use client';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { startOfWeek, isWithinInterval } from 'date-fns';
import { Project, TimeEntry } from '@/lib/types';

export default function ProjectGoals() {
  const { firestore } = useFirebase();

  const projectsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'projects'));
  }, [firestore]);
  const { data: projects } = useCollection<Project>(projectsQuery);

  const timeEntriesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'time_entries'));
  }, [firestore]);
  const { data: timeEntries } = useCollection<TimeEntry>(timeEntriesQuery);

  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday

  const activeProjects = (projects ?? []).filter(p => p.status === 'active' && p.hoursPerWeek > 0);

  const weeklyEntries = (timeEntries ?? []).filter(entry => 
    entry.startTime && isWithinInterval(new Date(entry.startTime), { start: weekStart, end: today })
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Project Goals</CardTitle>
        <CardDescription>Your progress towards weekly hour targets.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeProjects.map(project => {
          const projectTime = weeklyEntries
            .filter(entry => entry.projectId === project.id)
            .reduce((acc, entry) => acc + entry.duration, 0) / 3600;
          
          const progress = project.hoursPerWeek > 0 ? (projectTime / project.hoursPerWeek) * 100 : 0;
          const remainingHours = project.hoursPerWeek - projectTime;

          return (
            <div key={project.id}>
              <div className="flex justify-between items-center mb-1 text-sm">
                <div className="flex items-center gap-2 font-medium">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: project.color }} />
                  {project.name}
                </div>
                <span className="text-muted-foreground">
                  {remainingHours > 0 ? `${remainingHours.toFixed(1)}h left` : 'Goal reached!'}
                </span>
              </div>
              <Progress value={progress} />
            </div>
          );
        })}
        {activeProjects.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No active projects with weekly goals.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
