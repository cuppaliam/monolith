
'use client';

import { useMemo } from 'react';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { isAfter, startOfToday, addDays, parseISO } from 'date-fns';
import type { Task, Project, TaskPriority } from '@/lib/types';

export default function UpcomingTasks() {
  const { firestore } = useFirebase();

  const tasksQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'tasks'));
  }, [firestore]);
  const { data: tasks } = useCollection<Task>(tasksQuery);
  
  const projectsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'projects'));
  }, [firestore]);
  const { data: projects } = useCollection<Project>(projectsQuery);


  const today = startOfToday();
  const nextWeek = addDays(today, 7);
  
  const priorityOrder: Record<TaskPriority, number> = {
    urgent: 1,
    high: 2,
    medium: 3,
    low: 4,
  };

  const upcoming = useMemo(() => (tasks ?? [])
    .filter(task => {
        if (!task.dueDate) return false;
        const dueDate = parseISO(task.dueDate);
        return task.status !== 'done' && isAfter(dueDate, today) && isAfter(nextWeek, dueDate);
    })
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]), [tasks, today, nextWeek]);

  const getProject = (projectId: string) => (projects ?? []).find(p => p.id === projectId);
  
  const priorityVariantMap: Record<TaskPriority, "destructive" | "default" | "secondary" | "outline"> = {
    low: 'outline',
    medium: 'secondary',
    high: 'default',
    urgent: 'destructive',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Tasks</CardTitle>
        <CardDescription>
        You have {upcoming.length} task{upcoming.length !== 1 && 's'} due in the next 7 days.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {upcoming.length > 0 ? (
          upcoming.slice(0, 5).map(task => (
            <div key={task.id} className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: getProject(task.projectId)?.color }} />
                <p className="font-medium truncate">{task.title}</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Badge variant={priorityVariantMap[task.priority]}>{task.priority}</Badge>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No upcoming tasks for the next week.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
