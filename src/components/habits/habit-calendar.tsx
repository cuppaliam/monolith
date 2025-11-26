
'use client';

import { useMemo } from 'react';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  getDay,
} from 'date-fns';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { HabitLog } from '@/lib/types';

interface HabitCalendarProps {
  habitId: string;
}

export default function HabitCalendar({ habitId }: HabitCalendarProps) {
  const { firestore } = useFirebase();
  const today = new Date();
  const firstDayOfMonth = startOfMonth(today);
  const lastDayOfMonth = endOfMonth(today);

  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  const startingDayIndex = getDay(firstDayOfMonth);

  const habitLogsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, `habit_logs`);
  }, [firestore]);
  const { data: habitLogs } = useCollection<HabitLog>(habitLogsQuery);

  const habitLogsForHabit = useMemo(() => {
    return new Set(
      (habitLogs ?? [])
        .filter((log) => log.habitId === habitId)
        .map((log) => log.date)
    );
  }, [habitId, habitLogs]);

  return (
    <div className="grid grid-cols-7 gap-1.5" style={{ gridAutoRows: '1fr' }}>
      {Array.from({ length: startingDayIndex }).map((_, index) => (
        <div key={`empty-${index}`} />
      ))}
      {daysInMonth.map((day) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const isCompleted = habitLogsForHabit.has(dateStr);
        return (
          <Tooltip key={dateStr} delayDuration={100}>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  'aspect-square rounded-sm',
                  isCompleted ? 'bg-primary' : 'bg-muted/50',
                  'hover:ring-2 hover:ring-primary/50'
                )}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>{format(day, 'MMM d, yyyy')} - {isCompleted ? 'Completed' : 'Not Completed'}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
