'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
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
    value: string | number | boolean
  ) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === habitId ? { ...habit, [field]: value } : habit
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Habit Settings</CardTitle>
        <CardDescription>
          Customize the habits you want to track.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Name</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Goal (Build/Stop)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {habits.map((habit) => (
              <TableRow key={habit.id}>
                <TableCell>
                  <Input
                    value={habit.name}
                    onChange={(e) =>
                      handleHabitChange(habit.id, 'name', e.target.value)
                    }
                    className="w-full"
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={habit.active}
                    onCheckedChange={(checked) =>
                      handleHabitChange(habit.id, 'active', !!checked)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={habit.period}
                    onValueChange={(value) =>
                      handleHabitChange(habit.id, 'period', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Day</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
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
                    className="w-20"
                    min="1"
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={habit.goal === 'stop'}
                      onCheckedChange={(checked) =>
                        handleHabitChange(
                          habit.id,
                          'goal',
                          checked ? 'stop' : 'build'
                        )
                      }
                      id={`goal-${habit.id}`}
                    />
                    <label htmlFor={`goal-${habit.id}`} className="text-sm">
                      {habit.goal === 'build' ? 'Build' : 'Stop'}
                    </label>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-end mt-6">
          <Button>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}
