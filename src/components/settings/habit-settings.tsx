
'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { habits as initialHabits } from '@/lib/data';
import type { Habit } from '@/lib/types';

const getNewHabitTemplate = (): Habit => ({
  id: `new-${Date.now()}`,
  name: '',
  active: true,
  period: 'week',
  frequency: 1,
  goal: 'build',
  color: '', // Color will be assigned on commit
});

export default function HabitSettings() {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [newHabit, setNewHabit] = useState<Habit>(getNewHabitTemplate());

  const assignColor = (index: number) => `hsl(var(--chart-${(index % 5) + 1}))`;

  const handleHabitChange = (
    habitId: string,
    field: keyof Habit,
    value: string | number | boolean | 'build' | 'stop'
  ) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === habitId ? { ...habit, [field]: value } : habit
      )
    );
  };
  
  const handleNewHabitChange = (
    field: keyof Habit,
    value: string | number | boolean | 'build' | 'stop'
  ) => {
    setNewHabit((prev) => ({ ...prev, [field]: value }));
  };

  const commitNewHabit = () => {
    if (newHabit.name.trim() !== '') {
      const habitToCommit = { 
        ...newHabit, 
        color: assignColor(habits.length) 
      };
      setHabits([...habits, habitToCommit]);
      setNewHabit(getNewHabitTemplate());
    }
  };

  const renderHabitRow = (habit: Habit, isNew: boolean) => {
    const changeHandler = isNew 
      ? (field: keyof Habit, value: any) => handleNewHabitChange(field, value)
      : (field: keyof Habit, value: any) => handleHabitChange(habit.id, field, value);

    return (
        <TableRow key={habit.id} className="hover:bg-transparent">
        <TableCell className="p-2">
          <Input
            value={habit.name}
            placeholder={isNew ? 'Add a new habit...' : ''}
            onChange={(e) => changeHandler('name', e.target.value)
            }
            onBlur={isNew ? commitNewHabit : undefined}
            onKeyDown={(e) => {
              if (isNew && e.key === 'Enter') {
                commitNewHabit();
                // Optionally, focus the next new input, though this can be complex
              }
            }}
            className="w-full bg-transparent border-none focus-visible:ring-1 h-8"
          />
        </TableCell>
        <TableCell className="p-2">
          <Checkbox
            checked={habit.active}
            onCheckedChange={(checked) =>
              changeHandler('active', !!checked)
            }
            disabled={isNew && !habit.name}
          />
        </TableCell>
        <TableCell className="p-2">
          <Select
            value={habit.period}
            onValueChange={(value) =>
              changeHandler('period', value)
            }
            disabled={isNew && !habit.name}
          >
            <SelectTrigger className="bg-transparent border-none focus:ring-1 w-auto h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell className="p-2">
          <Input
            type="number"
            value={habit.frequency}
            onChange={(e) =>
              changeHandler(
                'frequency',
                parseInt(e.target.value, 10) || 1
              )
            }
            className="w-20 bg-transparent border-none focus-visible:ring-1 h-8"
            min="1"
            disabled={isNew && !habit.name}
          />
        </TableCell>
        <TableCell className="p-2">
           <Select
            value={habit.goal}
            onValueChange={(value: 'build' | 'stop') =>
              changeHandler('goal', value)
            }
            disabled={isNew && !habit.name}
          >
            <SelectTrigger className="bg-transparent border-none focus:ring-1 w-auto h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="build">Build</SelectItem>
              <SelectItem value="stop">Stop</SelectItem>
            </SelectContent>
          </Select>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold leading-none tracking-tight">Habit Settings</h2>
        <p className="text-sm text-muted-foreground">
          Customize the habits you want to track.
        </p>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[250px]">Name</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Goal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {habits.map(habit => renderHabitRow(habit, false))}
            {renderHabitRow(newHabit, true)}
          </TableBody>
        </Table>
      </div>
        <div className="flex justify-end mt-6">
          <Button>Save Changes</Button>
        </div>
    </div>
  );
}
