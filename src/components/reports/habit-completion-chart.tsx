'use client';

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { habits, habitLogs } from '@/lib/data';
import { subDays, format } from 'date-fns';
import { ChartTooltipContent } from '@/components/ui/chart';

export default function HabitCompletionChart() {
  const data = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const completedCount = habitLogs.filter(log => log.date === dateStr).length;
    const completionRate = (completedCount / habits.length) * 100;
    
    return {
      date: format(date, 'MMM d'),
      'Completion Rate': completionRate.toFixed(0),
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
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
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={{ r: 4, fill: 'hsl(var(--primary))' }}
          activeDot={{ r: 6, stroke: 'hsl(var(--background))' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
