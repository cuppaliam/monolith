
'use client';

import { useState } from 'react';
import { HabitActions } from '@/components/habits/habit-actions';
import DailyHabitView from '@/components/habits/daily-habit-view';
import HabitCalendar from '@/components/habits/habit-calendar';
import HabitStreaks from '@/components/habits/habit-streaks';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { useCollection, useFirebase, useUser, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Habit } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default function HabitsPage() {
  const { firestore } = useFirebase();
  const { user } = useUser();

  const habitsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/habits`);
  }, [firestore, user]);
  const { data: habits } = useCollection<Habit>(habitsQuery);
  const [selectedHabitId, setSelectedHabitId] = useState('');

  if (!habits) {
    return null; // Or a loading indicator
  }
  
  if(habits.length > 0 && !selectedHabitId) {
    setSelectedHabitId(habits[0].id)
  }

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Habits</h1>
          <p className="text-muted-foreground">
            Track your habits day by day and visualize your progress.
          </p>
        </div>
        <HabitActions />
      </header>
      
      <DailyHabitView />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <h2 className="text-2xl font-heading font-bold">Monthly Progress</h2>
            <Select value={selectedHabitId} onValueChange={setSelectedHabitId}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select a habit" />
              </SelectTrigger>
              <SelectContent>
                {habits.map((habit) => (
                  <SelectItem key={habit.id} value={habit.id}>
                    {habit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedHabitId && <HabitCalendar habitId={selectedHabitId} />}
        </Card>
        <HabitStreaks />
      </div>
    </div>
  );
}
