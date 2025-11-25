'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCollection, useFirebase, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { TimeEntry, Project } from '@/lib/types';
import { format } from 'date-fns';
import { useMemo } from 'react';

interface TimeLogTableProps {
  entries: TimeEntry[];
}

function formatDuration(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours > 0 ? `${hours}h ` : ''}${minutes}m`;
}

export default function TimeLogTable({ entries }: TimeLogTableProps) {
  const { firestore } = useFirebase();
  const { user } = useUser();
  
  const projectsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'projects'), where('ownerId', '==', user.uid));
  }, [firestore, user]);
  const { data: projects } = useCollection<Project>(projectsQuery);

  const getProject = (projectId: string) => (projects ?? []).find(p => p.id === projectId);
  
  const sortedEntries = useMemo(() => 
    [...(entries ?? [])].sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()),
    [entries]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Log</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead className="text-right">Duration</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEntries.map((entry) => {
              const project = getProject(entry.projectId);
              return (
                <TableRow key={entry.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{backgroundColor: project?.color}} />
                      {project?.name || 'Unknown Project'}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">{formatDuration(entry.duration)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{format(new Date(entry.startTime), 'MMM d, yyyy')}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
