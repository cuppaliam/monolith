
'use client';

import { habitLogs } from '@/lib/data';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  getDay,
  startOfWeek,
  addDays,
} from 'date-fns';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface HabitCalendarProps {
  habitId: string;
}

export default function HabitCalendar({ habitId }: HabitCalendarProps) {
  const today = new Date();
  const firstDayOfMonth = startOfMonth(today);
  const lastDayOfMonth = endOfMonth(today);

  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  const startingDayIndex = getDay(firstDayOfMonth); // 0 for Sunday, 1 for Monday etc.

  const habitLogsForHabit = useMemo(() => {
    return new Set(
      habitLogs
        .filter((log) => log.habitId === habitId)
        .map((log) => log.date)
    );
  }, [habitId]);
  
  const getIntensity = (count: number) => {
    if (count === 0) return 'bg-muted/50';
    if (count <= 1) return 'bg-primary/20';
    if (count <= 2) return 'bg-primary/40';
    if (count <= 3) return 'bg-primary/70';
    return 'bg-primary';
  };

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
