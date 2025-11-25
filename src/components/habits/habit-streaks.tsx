
'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { habits, habitLogs } from '@/lib/data';
import { subDays, format, isSameDay } from 'date-fns';
import { Flame } from 'lucide-react';

const calculateStreaks = () => {
  const streaks: { [habitId: string]: number } = {};

  habits.forEach((habit) => {
    const logsForHabit = habitLogs
      .filter((log) => log.habitId === habit.id)
      .map((log) => log.date)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    if (logsForHabit.length === 0) {
      streaks[habit.id] = 0;
      return;
    }

    let currentStreak = 0;
    let currentDate = new Date();

    // Check if today is completed
    if (logsForHabit.some(logDate => isSameDay(new Date(logDate), currentDate))) {
      currentStreak++;
      currentDate = subDays(currentDate, 1);
    }
    // Check if yesterday is completed to continue streak
    else if (!logsForHabit.some(logDate => isSameDay(new Date(logDate), subDays(currentDate, 1)))) {
       streaks[habit.id] = 0;
       return;
    }


    for (const logDateStr of logsForHabit) {
      const logDate = new Date(logDateStr);
      if (isSameDay(logDate, currentDate) || isSameDay(logDate, subDays(new Date(),1))) {
        if(!isSameDay(logDate, new Date())) {
            currentStreak++;
        }
        currentDate = subDays(logDate, 1);
      } else {
        break; // Streak is broken
      }
    }
    
    // Quick fix to prevent counting today and yesterday if both are logged
    if (logsForHabit.some(logDate => isSameDay(new Date(logDate), new Date())) && logsForHabit.some(logDate => isSameDay(new Date(logDate), subDays(new Date(),1)))) {
        const uniqueDates = new Set(logsForHabit.map(log => format(new Date(log), 'yyyy-MM-dd')));
        let streak = 0;
        let checkDate = new Date();
        while(uniqueDates.has(format(checkDate, 'yyyy-MM-dd'))) {
            streak++;
            checkDate = subDays(checkDate, 1);
        }
        streaks[habit.id] = streak;
    } else {
       streaks[habit.id] = currentStreak;
    }
    
  });

  return streaks;
};

export default function HabitStreaks() {
  const streaks = useMemo(() => calculateStreaks(), []);

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
