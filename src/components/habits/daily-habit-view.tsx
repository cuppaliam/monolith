
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { habits, habitLogs as initialHabitLogs } from '@/lib/data';
import type { HabitLog } from '@/lib/types';
import { format, addDays, subDays, isToday, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DailyHabitCard = ({
  date,
  habitLogs,
  onCheckChange,
  isCenter,
}: {
  date: Date;
  habitLogs: HabitLog[];
  onCheckChange: (habitId: string, date: Date, completed: boolean) => void;
  isCenter: boolean;
}) => {
  const dateStr = format(date, 'yyyy-MM-dd');
  const dayHabits = habits.filter(h => h.active);

  return (
    <Card
      className={cn(
        'w-full transition-all duration-300',
        isCenter ? 'z-10 shadow-lg' : 'z-0 shadow-none scale-90 opacity-60'
      )}
    >
      <CardHeader>
        <CardTitle className={cn("text-center", isToday(date) && "text-primary")}>
          {format(date, 'eeee, MMM d')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {dayHabits.map((habit) => {
          const isChecked = habitLogs.some(
            (log) => log.habitId === habit.id && log.date === dateStr
          );
          return (
            <div key={habit.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted">
              <Checkbox
                id={`${habit.id}-${dateStr}`}
                checked={isChecked}
                onCheckedChange={(checked) =>
                  onCheckChange(habit.id, date, !!checked)
                }
                className="h-5 w-5"
              />
              <label
                htmlFor={`${habit.id}-${dateStr}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {habit.name}
              </label>
            </div>
          );
        })}
        {dayHabits.length === 0 && (
            <p className="text-center text-muted-foreground">No active habits.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default function DailyHabitView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>(initialHabitLogs);
  const [direction, setDirection] = useState(0);

  const dates = useMemo(() => {
    return {
      prev: subDays(currentDate, 1),
      current: currentDate,
      next: addDays(currentDate, 1),
    };
  }, [currentDate]);

  const changeDate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentDate(d => addDays(d, newDirection));
  };
  
  const handleCheckChange = (habitId: string, date: Date, completed: boolean) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    setHabitLogs(prevLogs => {
      if (completed) {
        return [...prevLogs, { id: `log-${Date.now()}`, habitId, date: dateStr, completed: true }];
      } else {
        return prevLogs.filter(log => !(log.habitId === habitId && log.date === dateStr));
      }
    });
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0.6,
      scale: 0.9,
    }),
  };

  return (
    <div className="relative flex items-center justify-center h-[450px] overflow-hidden">
        {/* Prev and Next Buttons */}
        <Button variant="ghost" size="icon" className="absolute left-0 z-20 h-16 w-16" onClick={() => changeDate(-1)}>
            <ChevronLeft className="h-8 w-8" />
        </Button>
        <Button variant="ghost" size="icon" className="absolute right-0 z-20 h-16 w-16" onClick={() => changeDate(1)}>
            <ChevronRight className="h-8 w-8" />
        </Button>
      
        {/* Side Cards */}
        <div className="absolute left-0 w-full h-full flex justify-center items-center" onClick={() => changeDate(-1)}>
             <DailyHabitCard date={dates.prev} habitLogs={habitLogs} onCheckChange={handleCheckChange} isCenter={false} />
        </div>
        <div className="absolute right-0 w-full h-full flex justify-center items-center" onClick={() => changeDate(1)}>
             <DailyHabitCard date={dates.next} habitLogs={habitLogs} onCheckChange={handleCheckChange} isCenter={false} />
        </div>

        {/* Center Card */}
        <AnimatePresence initial={false} custom={direction}>
            <motion.div
            key={currentDate.toString()}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full max-w-sm absolute"
            >
                <DailyHabitCard
                    date={dates.current}
                    habitLogs={habitLogs}
                    onCheckChange={handleCheckChange}
                    isCenter={true}
                />
            </motion.div>
        </AnimatePresence>
    </div>
  );
}
