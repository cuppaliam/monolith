
'use client';

import { useState } from 'react';
import { HabitActions } from '@/components/habits/habit-actions';
import DailyHabitView from '@/components/habits/daily-habit-view';
import HabitCalendar from '@/components/habits/habit-calendar';
import HabitStreaks from '@/components/habits/habit-streaks';
import { habits } from '@/lib/data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';

export default function HabitsPage() {
  const [selectedHabitId, setSelectedHabitId] = useState(habits[0]?.id || '');

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
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
        <Card className="lg:col-span-2 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-heading font-bold">Monthly Progress</h2>
            <Select value={selectedHabitId} onValueChange={setSelectedHabitId}>
              <SelectTrigger className="w-[180px]">
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
