'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle } from 'lucide-react';
import { Slider } from '../ui/slider';
import { useState } from 'react';

export function HabitActions() {
    const [frequency, setFrequency] = useState(3);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Habit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Habit</DialogTitle>
          <DialogDescription>
            Add a new habit to track. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" defaultValue="Read a book" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="frequency" className="text-right">
              Frequency
            </Label>
            <div className="col-span-3 flex items-center gap-4">
              <Slider
                id="frequency"
                min={1}
                max={7}
                step={1}
                value={[frequency]}
                onValueChange={(value) => setFrequency(value[0])}
              />
              <span className="font-semibold">{frequency} / week</span>
            </div>
          </div>
        </div>
        <Button type="submit">Save Habit</Button>
      </DialogContent>
    </Dialog>
  );
}
