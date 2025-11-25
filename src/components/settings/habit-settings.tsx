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
import { Plus } from 'lucide-react';

const newHabitTemplate: Habit = {
  id: `new-${Date.now()}`,
  name: '',
  active: true,
  period: 'week',
  frequency: 1,
  goal: 'build',
  color: `hsl(var(--chart-${(initialHabits.length % 5) + 1}))`,
};

export default function HabitSettings() {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);

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
  
  const handleAddNewHabit = (
    field: keyof Habit,
    value: string | number | boolean | 'build' | 'stop'
  ) => {
      const newHabit = { 
          ...newHabitTemplate, 
          id: `new-${Date.now()}`, 
          [field]: value,
          color: `hsl(var(--chart-${(habits.length % 5) + 1}))`
        };
      setHabits([...habits, newHabit]);
  }

  const renderHabitRow = (habit: Habit, isNew: boolean) => {
    const changeHandler = isNew ? handleAddNewHabit : (field: keyof Habit, value: any) => handleHabitChange(habit.id, field, value);
    
    return (
        <TableRow key={habit.id} className="hover:bg-transparent">
        <TableCell className="p-2">
          <Input
            value={habit.name}
            placeholder={isNew ? 'Add a new habit...' : ''}
            onChange={(e) =>
              changeHandler('name', e.target.value)
            }
            className="w-full bg-transparent border-none focus-visible:ring-1 h-8"
          />
        </TableCell>
        <TableCell className="p-2">
          <Checkbox
            checked={habit.active}
            onCheckedChange={(checked) =>
              changeHandler('active', !!checked)
            }
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
            {renderHabitRow(newHabitTemplate, true)}
          </TableBody>
        </Table>
      </div>
        <div className="flex justify-end mt-6">
          <Button>Save Changes</Button>
        </div>
    </div>
  );
}
