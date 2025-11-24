'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { habits, habitLogs as initialHabitLogs } from '@/lib/data';
import { startOfWeek, addDays, format, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HabitTracker() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [habitLogs, setHabitLogs] = useState(initialHabitLogs);

  const weekStartsOn = 1; // Monday
  const weekStart = startOfWeek(currentDate, { weekStartsOn });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const handleCheck = (habitId: string, date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const logIndex = habitLogs.findIndex(
      (log) => log.habitId === habitId && log.date === dateStr
    );

    if (logIndex > -1) {
      setHabitLogs(habitLogs.filter((_, index) => index !== logIndex));
    } else {
      setHabitLogs([...habitLogs, { habitId, date: dateStr }]);
    }
  };

  const changeWeek = (amount: number) => {
    setCurrentDate(addDays(currentDate, amount * 7));
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {format(weekStart, 'MMMM yyyy')}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => changeWeek(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => changeWeek(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-8 gap-2">
          {/* Header row */}
          <div className="font-semibold text-muted-foreground">Habit</div>
          {weekDays.map(day => (
            <div key={day.toString()} className="text-center font-semibold text-muted-foreground">
              <div className={isSameDay(day, new Date()) ? 'text-primary' : ''}>
                {format(day, 'E')}
              </div>
              <div className={`text-xs ${isSameDay(day, new Date()) ? 'text-primary' : ''}`}>
                {format(day, 'd')}
              </div>
            </div>
          ))}

          {/* Habit rows */}
          {habits.map(habit => (
            <div key={habit.id} className="contents">
              <div className="flex items-center font-medium">
                <span className="h-2 w-2 rounded-full mr-2" style={{ backgroundColor: habit.color }} />
                {habit.name}
              </div>
              {weekDays.map(day => {
                const isChecked = habitLogs.some(log => log.habitId === habit.id && log.date === format(day, 'yyyy-MM-dd'));
                return (
                  <div key={`${habit.id}-${day}`} className="flex items-center justify-center">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => handleCheck(habit.id, day)}
                      className="h-6 w-6"
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
