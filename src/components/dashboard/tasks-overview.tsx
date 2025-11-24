import Link from 'next/link';
import { tasks, projects } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { isToday, parseISO } from 'date-fns';
import { ArrowRight } from 'lucide-react';

export default function TasksOverview() {
  const dueToday = tasks.filter(task => isToday(parseISO(task.dueDate)) && task.status !== 'done');
  const getProject = (projectId: string) => projects.find(p => p.id === projectId);
  
  const priorityVariantMap = {
    low: 'outline',
    medium: 'secondary',
    high: 'default',
    urgent: 'destructive',
  } as const;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
            <CardTitle>Tasks Due Today</CardTitle>
            <CardDescription>
            You have {dueToday.length} task{dueToday.length !== 1 && 's'} due today.
            </CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
            <Link href="/tasks">
            View All
            <ArrowRight className="h-4 w-4" />
            </Link>
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4">
        {dueToday.length > 0 ? (
          dueToday.slice(0, 3).map(task => (
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
            No tasks due today. Enjoy your day!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
