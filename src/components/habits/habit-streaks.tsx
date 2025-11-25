
'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { habits, habitLogs } from '@/lib/data';
import { Flame } from 'lucide-react';
import { calculateStreaks } from '@/lib/streaks';

export default function HabitStreaks() {
  const streaks = useMemo(() => calculateStreaks(habits, habitLogs), [habits, habitLogs]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Habit Streaks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {habits.map((habit) => (
          <div key={habit.id} className="flex items-center justify-between">
            <span className="font-medium">{habit.name}</span>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Flame className="h-5 w-5 text-primary" />
              <span className="font-semibold text-lg text-foreground">
                {streaks[habit.id] || 0}
              </span>
              <span>days</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
