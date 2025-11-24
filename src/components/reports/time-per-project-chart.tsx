'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { timeEntries, projects } from '@/lib/data';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';

const chartConfig = {
  hours: {
    label: 'Hours',
  },
} satisfies ChartConfig;

export default function TimePerProjectChart() {
  const data = projects.map(project => {
    const totalDuration = timeEntries
      .filter(entry => entry.projectId === project.id)
      .reduce((acc, entry) => acc + entry.duration, 0);

    return {
      name: project.name,
      hours: totalDuration / 3600,
      fill: project.color,
    };
  });

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
