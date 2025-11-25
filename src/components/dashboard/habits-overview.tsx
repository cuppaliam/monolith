'use client';

import { useMemo } from 'react';
import { habits, habitLogs } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Flame } from 'lucide-react';
import { format, isToday, subDays, isSameDay } from 'date-fns';
import { calculateStreaks } from '@/lib/streaks';

export default function HabitsOverview() {
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todaysLogs = habitLogs.filter(log => log.date === todayStr);
  const completedToday = todaysLogs.length;
  const totalHabits = habits.filter(h => h.active).length;
  const progress = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;
  
  const streaks = useMemo(() => calculateStreaks(habits, habitLogs), [habits, habitLogs]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Habits</CardTitle>
        <CardDescription>
          {completedToday} of {totalHabits} habits completed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={progress} className="mb-4" />
        <div className="space-y-4">
          {habits.filter(h => h.active).slice(0, 4).map(habit => {
            const isCompleted = todaysLogs.some(log => log.habitId === habit.id);
            const streak = streaks[habit.id] || 0;
            return (
              <div key={habit.id} className="flex items-center space-x-2">
                <Checkbox id={`habit-overview-${habit.id}`} checked={isCompleted} />
                <label
                  htmlFor={`habit-overview-${habit.id}`}
                  className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {habit.name}
                </label>
                {streak >= 3 && (
                   <div className="flex items-center gap-1 text-xs text-amber-500">
                    <Flame className="h-4 w-4" />
                    <span>{streak}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
