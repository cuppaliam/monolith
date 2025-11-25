
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
import { Trash2 } from 'lucide-react';

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
  const [newHabit, setNewHabit] = useState<Habit | null>(null);

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
    if (!newHabit) {
        setNewHabit({ ...getNewHabitTemplate(), [field]: value });
    } else {
        setNewHabit((prev) => ({ ...prev!, [field]: value }));
    }
  };

  const commitNewHabit = () => {
    if (newHabit && newHabit.name.trim() !== '') {
      const habitToCommit = { 
        ...newHabit, 
        id: `habit-${Date.now()}`, // Ensure a more unique ID
        color: assignColor(habits.length) 
      };
      setHabits([...habits, habitToCommit]);
      setNewHabit(null);
    }
  };

  const handleDeleteHabit = (habitId: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
  };

  const renderHabitRow = (habit: Habit | null, isNew: boolean) => {
    const currentHabit = habit || getNewHabitTemplate();
    
    const changeHandler = isNew 
      ? (field: keyof Habit, value: any) => handleNewHabitChange(field, value)
      : (field: keyof Habit, value: any) => handleHabitChange(currentHabit.id, field, value);

    const onBlurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
        if (isNew && newHabit && newHabit.name.trim() !== '') {
            commitNewHabit();
        }
    }

    return (
        <TableRow key={currentHabit.id} className="hover:bg-transparent group">
            <TableCell className="p-2">
                <Input
                    value={currentHabit.name}
                    placeholder={isNew ? 'Add a new habit...' : ''}
                    onChange={(e) => changeHandler('name', e.target.value)}
                    onBlur={onBlurHandler}
                    onKeyDown={(e) => {
                        if (isNew && e.key === 'Enter') {
                            commitNewHabit();
                        }
                    }}
                    className="w-full bg-transparent border-none focus-visible:ring-1 h-8"
                />
            </TableCell>
            <TableCell className="p-2">
            <Checkbox
                checked={currentHabit.active}
                onCheckedChange={(checked) =>
                changeHandler('active', !!checked)
                }
                disabled={isNew && !habit}
            />
            </TableCell>
            <TableCell className="p-2">
            <Select
                value={currentHabit.period}
                onValueChange={(value) =>
                changeHandler('period', value)
                }
                disabled={isNew && !habit}
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
                value={currentHabit.frequency}
                onChange={(e) =>
                changeHandler(
                    'frequency',
                    parseInt(e.target.value, 10) || 1
                )
                }
                className="w-20 bg-transparent border-none focus-visible:ring-1 h-8"
                min="1"
                disabled={isNew && !habit}
            />
            </TableCell>
            <TableCell className="p-2">
            <Select
                value={currentHabit.goal}
                onValueChange={(value: 'build' | 'stop') =>
                changeHandler('goal', value)
                }
                disabled={isNew && !habit}
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
             <TableCell className="p-2 w-12">
              {!isNew && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground opacity-20 group-hover:opacity-100 hover:text-destructive"
                  onClick={() => handleDeleteHabit(currentHabit.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
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
              <TableHead className="w-12"></TableHead>
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
