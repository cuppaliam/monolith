
'use client';

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { subDays, format } from 'date-fns';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import type { Habit, HabitLog } from '@/lib/types';
import { useMemo } from 'react';

const chartConfig = {
  'Completion Rate': {
    label: 'Completion Rate',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;


export default function HabitCompletionChart() {
  const { firestore } = useFirebase();

  const habitsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, `habits`);
  }, [firestore]);
  const { data: habits } = useCollection<Habit>(habitsQuery);
  
  const habitLogsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, `habit_logs`);
  }, [firestore]);
  const { data: habitLogs } = useCollection<HabitLog>(habitLogsQuery);

  const data = useMemo(() => {
    if (!habits || !habitLogs) return [];
    return Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const completedCount = habitLogs.filter(log => log.date === dateStr).length;
      const totalHabits = habits.filter(h => h.active).length;
      const completionRate = totalHabits > 0 ? (completedCount / totalHabits) * 100 : 0;
      
      return {
        date: format(date, 'MMM d'),
        'Completion Rate': parseFloat(completionRate.toFixed(0)),
      };
    });
  }, [habits, habitLogs]);

  return (
    <ChartContainer config={chartConfig} className="w-full h-full">
      <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <XAxis
          dataKey="date"
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
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip
          cursor={{ stroke: 'hsl(var(--primary))', strokeDasharray: '4 4' }}
          content={<ChartTooltipContent 
            formatter={(value) => `${value}%`}
            indicator="dot"
          />}
        />
        <Line
          type="monotone"
          dataKey="Completion Rate"
          stroke="var(--color-Completion Rate)"
          strokeWidth={2}
          dot={{ r: 4, fill: 'var(--color-Completion Rate)' }}
          activeDot={{ r: 6, stroke: 'hsl(var(--background))' }}
        />
      </LineChart>
    </ChartContainer>
  );
}
