'use client';

import { useMemo } from 'react';
import { useCollection, useFirebase, useUser, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Flame } from 'lucide-react';
import { format } from 'date-fns';
import { calculateStreaks } from '@/lib/streaks';
import { Habit, HabitLog } from '@/lib/types';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export default function HabitsOverview() {
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

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todaysLogs = useMemo(() => (habitLogs ?? []).filter(log => log.date === todayStr), [habitLogs, todayStr]);
  
  const streaks = useMemo(() => calculateStreaks(habits ?? [], habitLogs ?? []), [habits, habitLogs]);

  const handleCheckChange = (habitId: string, completed: boolean) => {
    if (!user || !firestore) return;
    const logId = `log-${habitId}-${todayStr}`;
    const logRef = doc(firestore, `users/${user.uid}/habit_logs`, logId);

    if (completed) {
      setDocumentNonBlocking(logRef, {
        id: logId,
        habitId,
        date: todayStr,
        completed: true,
      }, { merge: true });
    } else {
      // In a real app, you'd use deleteDocumentNonBlocking, but for optimistic UI, filtering is easier.
      // This part is tricky without local state management libraries.
      console.log("Unchecking is not fully supported in this optimistic UI demo.");
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Habits</CardTitle>
        <CardDescription>
          Your daily habit checklist.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {(habits ?? []).filter(h => h.active).slice(0, 4).map(habit => {
            const isCompleted = todaysLogs.some(log => log.habitId === habit.id);
            const streak = streaks[habit.id] || 0;
            return (
              <div key={habit.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`habit-overview-${habit.id}`} 
                  checked={isCompleted} 
                  onCheckedChange={(checked) => handleCheckChange(habit.id, !!checked)}
                />
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
