
'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useCollection, useFirebase, useUser, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { Habit } from '@/lib/types';
import { Trash2 } from 'lucide-react';

const getNewHabitTemplate = (ownerId: string): Omit<Habit, 'id' | 'color'> => ({
  name: '',
  active: true,
  period: 'week',
  frequency: 1,
  goal: 'build',
  ownerId,
});

export default function HabitSettings() {
  const { firestore } = useFirebase();
  const { user } = useUser();

  const habitsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/habits`);
  }, [firestore, user]);
  const { data: initialHabits } = useCollection<Habit>(habitsQuery);

  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState<Partial<Habit> | null>(null);

  useEffect(() => {
    if (initialHabits) {
      setHabits(initialHabits);
    }
  }, [initialHabits]);

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
    field: keyof Omit<Habit, 'id'>,
    value: string | number | boolean | 'build' | 'stop'
  ) => {
    if (!user) return;
    setNewHabit((prev) => ({
      ...getNewHabitTemplate(user.uid),
      ...prev,
      [field]: value
    }));
  };

  const commitNewHabit = () => {
    if (newHabit && newHabit.name && newHabit.name.trim() !== '' && user && firestore) {
      const newId = `habit-${Date.now()}`;
      const habitToCommit: Habit = { 
        ...getNewHabitTemplate(user.uid),
        ...newHabit,
        id: newId,
        color: assignColor(habits.length) 
      } as Habit;
      
      const docRef = doc(firestore, `users/${user.uid}/habits`, newId);
      setDocumentNonBlocking(docRef, habitToCommit, { merge: false });
      
      setHabits(prev => [...prev, habitToCommit]);
      setNewHabit(null);
    }
  };

  const handleDeleteHabit = (habitId: string) => {
    if (!user || !firestore) return;
    const docRef = doc(firestore, `users/${user.uid}/habits`, habitId);
    deleteDocumentNonBlocking(docRef);
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
  };
  
  const handleSaveChanges = () => {
    if (!user || !firestore) return;
    habits.forEach(habit => {
      // only update if it's an existing habit
      if (initialHabits?.some(h => h.id === habit.id)) {
        const docRef = doc(firestore, `users/${user.uid}/habits`, habit.id);
        setDocumentNonBlocking(docRef, habit, { merge: true });
      }
    });
  }

  const renderHabitRow = (habit: Partial<Habit> | null, isNew: boolean) => {
    const currentHabit = habit || (user ? getNewHabitTemplate(user.uid) : {});
    
    const changeHandler = isNew 
      ? (field: keyof Habit, value: any) => handleNewHabitChange(field, value)
      : (field: keyof Habit, value: any) => handleHabitChange(currentHabit.id!, field, value);

    const onBlurHandler = () => {
        if (isNew && newHabit && newHabit.name && newHabit.name.trim() !== '') {
            commitNewHabit();
        }
    }

    return (
        <TableRow key={currentHabit.id || 'new'} className="hover:bg-transparent group">
            <TableCell className="p-2">
                <Input
                    value={currentHabit.name || ''}
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
            <Select
                value={currentHabit.period || 'week'}
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
                value={currentHabit.frequency || 1}
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
                value={currentHabit.goal || 'build'}
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
                  onClick={() => handleDeleteHabit(currentHabit.id!)}
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
          <Button onClick={handleSaveChanges}>Save Changes</Button>
        </div>
    </div>
  );
}
