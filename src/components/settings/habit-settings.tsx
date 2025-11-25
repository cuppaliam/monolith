'use client';

import { useState } from 'react';
import {
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
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
            {habits.map((habit) => (
              <TableRow key={habit.id} className="hover:bg-transparent">
                <TableCell className="p-2">
                  <Input
                    value={habit.name}
                    onChange={(e) =>
                      handleHabitChange(habit.id, 'name', e.target.value)
                    }
                    className="w-full bg-transparent border-none focus-visible:ring-1"
                  />
                </TableCell>
                <TableCell className="p-2">
                  <Checkbox
                    checked={habit.active}
                    onCheckedChange={(checked) =>
                      handleHabitChange(habit.id, 'active', !!checked)
                    }
                  />
                </TableCell>
                <TableCell className="p-2">
                  <Select
                    value={habit.period}
                    onValueChange={(value) =>
                      handleHabitChange(habit.id, 'period', value)
                    }
                  >
                    <SelectTrigger className="bg-transparent border-none focus:ring-1 w-auto">
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
                      handleHabitChange(
                        habit.id,
                        'frequency',
                        parseInt(e.target.value, 10) || 1
                      )
                    }
                    className="w-20 bg-transparent border-none focus-visible:ring-1"
                    min="1"
                  />
                </TableCell>
                <TableCell className="p-2">
                   <Select
                    value={habit.goal}
                    onValueChange={(value: 'build' | 'stop') =>
                      handleHabitChange(habit.id, 'goal', value)
                    }
                  >
                    <SelectTrigger className="bg-transparent border-none focus:ring-1 w-auto">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="build">Build</SelectItem>
                      <SelectItem value="stop">Stop</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
        <div className="flex justify-end mt-6">
          <Button>Save Changes</Button>
        </div>
    </div>
  );
}