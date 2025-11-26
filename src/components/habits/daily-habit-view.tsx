
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { format, addDays, subDays, isToday } from 'date-fns';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCollection, useFirebase, useUser, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { Habit, HabitLog } from '@/lib/types';

const DailyHabitCard = ({
  date,
  habits,
  habitLogs,
  onCheckChange,
  isCenter,
}: {
  date: Date;
  habits: Habit[];
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
        <CardTitle className={cn("text-center text-lg sm:text-xl", isToday(date) && "text-primary")}>
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
            <p className="text-center text-sm text-muted-foreground">No active habits.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default function DailyHabitView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [direction, setDirection] = useState(0);

  const { firestore } = useFirebase();
  const { user } = useUser();

  const habitsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/habits`);
  }, [firestore, user]);
  const { data: habits } = useCollection<Habit>(habitsQuery);
  
  const habitLogsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/habit_logs`);
  }, [firestore, user]);
  const { data: habitLogs } = useCollection<HabitLog>(habitLogsQuery);

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
    if (!user || !firestore) return;
    
    const dateStr = format(date, 'yyyy-MM-dd');
    const logId = `log-${habitId}-${dateStr}`;
    const logRef = doc(firestore, `users/${user.uid}/habit_logs`, logId);

    if (completed) {
      setDocumentNonBlocking(logRef, {
        id: logId,
        habitId,
        date: dateStr,
        completed: true,
      }, { merge: true });
    } else {
      deleteDocumentNonBlocking(logRef);
    }
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
    <div className="relative flex items-center justify-center min-h-[400px] sm:min-h-[450px] overflow-hidden -mx-4 sm:mx-0">
        <Button variant="ghost" size="icon" className="absolute left-0 sm:left-4 z-20 h-12 w-12 sm:h-16 sm:w-16" onClick={() => changeDate(-1)}>
            <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
        </Button>
        <Button variant="ghost" size="icon" className="absolute right-0 sm:right-4 z-20 h-12 w-12 sm:h-16 sm:w-16" onClick={() => changeDate(1)}>
            <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
        </Button>
      
        <div className="absolute left-0 w-full h-full flex justify-center items-center hidden md:flex" onClick={() => changeDate(-1)}>
             <DailyHabitCard date={dates.prev} habits={habits ?? []} habitLogs={habitLogs ?? []} onCheckChange={handleCheckChange} isCenter={false} />
        </div>
        <div className="absolute right-0 w-full h-full flex justify-center items-center hidden md:flex" onClick={() => changeDate(1)}>
             <DailyHabitCard date={dates.next} habits={habits ?? []} habitLogs={habitLogs ?? []} onCheckChange={handleCheckChange} isCenter={false} />
        </div>

        <AnimatePresence initial={false} custom={direction}>
            <motion.div
            key={currentDate.toString()}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full max-w-xs sm:max-w-sm absolute"
            >
                <DailyHabitCard
                    date={dates.current}
                    habits={habits ?? []}
                    habitLogs={habitLogs ?? []}
                    onCheckChange={handleCheckChange}
                    isCenter={true}
                />
            </motion.div>
        </AnimatePresence>
    </div>
  );
}
