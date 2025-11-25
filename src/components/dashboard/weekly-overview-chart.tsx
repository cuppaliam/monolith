'use client';

import { Bar, BarChart, Line, ComposedChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { timeEntries, projects, habits, habitLogs } from '@/lib/data';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { startOfWeek, addDays, format, isSameDay } from 'date-fns';

const chartConfig = {
  'Completion Rate': {
    label: 'Habit Completion',
    color: 'hsl(var(--accent))',
  },
  ...projects.reduce((acc, p) => ({ ...acc, [p.id]: { label: p.name, color: p.color } }), {})
} satisfies ChartConfig;

export default function WeeklyOverviewChart() {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
  
  const data = Array.from({ length: 7 }).map((_, i) => {
    const date = addDays(weekStart, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayInitial = format(date, 'E');

    // Habit completion
    const completedCount = habitLogs.filter(log => log.date === dateStr).length;
    const totalHabits = habits.filter(h => h.active).length;
    const completionRate = totalHabits > 0 ? (completedCount / totalHabits) * 100 : 0;
    
    // Time per project
    const dailyEntries = timeEntries.filter(entry => isSameDay(new Date(entry.startTime), date));
    const timeByProject = projects.reduce((acc, project) => {
        const projectTime = dailyEntries
            .filter(entry => entry.projectId === project.id)
            .reduce((sum, entry) => sum + entry.duration, 0);
        acc[project.id] = projectTime / 3600; // convert to hours
        return acc;
    }, {} as {[key: string]: number});
    
    return {
      date: dayInitial,
      'Completion Rate': parseFloat(completionRate.toFixed(0)),
      ...timeByProject,
    };
  });

  return (
    <ChartContainer config={chartConfig} className="w-full h-full">
      <ComposedChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <XAxis
          dataKey="date"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          yAxisId="left"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}h`}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip
          content={<ChartTooltipContent
            indicator="dot"
            formatter={(value, name) => {
                if (name === 'Completion Rate') {
                    return `${value}%`;
                }
                if (typeof value === 'number') {
                    return `${value.toFixed(1)} hours`;
                }
                return value;
            }}
           />}
        />
        <Legend />
        
        {projects.filter(p => p.status === 'active').map(project => (
           <Bar key={project.id} yAxisId="left" dataKey={project.id} stackId="a" fill={`var(--color-${project.id})`} name={project.name} radius={[4, 4, 0, 0]} />
        ))}
        
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="Completion Rate"
          stroke="var(--color-Completion Rate)"
          strokeWidth={2}
          dot={{ r: 4, fill: 'var(--color-Completion Rate)' }}
          activeDot={{ r: 6, stroke: 'hsl(var(--background))' }}
        />
      </ComposedChart>
    </ChartContainer>
  );
}
