
'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import type { Project, TimeEntry } from '@/lib/types';
import { useMemo } from 'react';

const chartConfig = {
  hours: {
    label: 'Hours',
  },
} satisfies ChartConfig;

export default function TimePerProjectChart() {
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

  const data = useMemo(() => {
    if (!projects || !timeEntries) return [];
    return projects.map(project => {
      const totalDuration = timeEntries
        .filter(entry => entry.projectId === project.id)
        .reduce((acc, entry) => acc + entry.duration, 0);

      return {
        name: project.name,
        hours: totalDuration / 3600,
        fill: project.color,
      };
    });
  }, [projects, timeEntries]);

  return (
    <ChartContainer config={chartConfig} className="w-full h-full">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <XAxis
          dataKey="name"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}h`}
        />
        <Tooltip
          cursor={false}
          content={<ChartTooltipContent 
            formatter={(value) => `${Number(value).toFixed(1)} hours`}
            indicator="dot"
          />}
        />
        <Bar dataKey="hours" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}
