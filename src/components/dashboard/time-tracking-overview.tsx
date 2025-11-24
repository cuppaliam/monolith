import Link from 'next/link';
import { timeEntries, projects } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';

function formatDuration(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
}

export default function TimeTrackingOverview() {
    const recentEntries = [...timeEntries].sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()).slice(0, 3);
    const getProject = (projectId: string) => projects.find(p => p.id === projectId);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
                A log of your most recent time entries.
            </CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
            <Link href="/time-tracking">
            View All
            <ArrowRight className="h-4 w-4" />
            </Link>
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4">
        {recentEntries.length > 0 ? (
          recentEntries.map(entry => {
            const project = getProject(entry.projectId);
            return (
                <div key={entry.id} className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: project?.color }} />
                        <p className="font-medium truncate">{project?.name}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{formatDuration(entry.duration)}</span>
                        <span>{formatDistanceToNow(parseISO(entry.startTime), { addSuffix: true })}</span>
                    </div>
                </div>
            )
          })
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No time tracking entries yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
