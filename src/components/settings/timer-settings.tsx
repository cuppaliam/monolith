'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function TimerSettings() {
  const [timerDuration, setTimerDuration] = useState(15);
  const [pomodoroWork, setPomodoroWork] = useState(25);
  const [pomodoroShortBreak, setPomodoroShortBreak] = useState(5);
  const [pomodoroLongBreak, setPomodoroLongBreak] = useState(15);

  return (
    <div>
      <div>
         <h2 className="text-2xl font-semibold leading-none tracking-tight">Timer Settings</h2>
        <p className="text-sm text-muted-foreground">
          Customize the default durations for the different timer modes (in
          minutes).
        </p>
      </div>
      <div className="space-y-6 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="timer-duration">Timer Duration</Label>
            <Input
              id="timer-duration"
              type="number"
              value={timerDuration}
              onChange={(e) => setTimerDuration(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pomodoro-work">Pomodoro Work Session</Label>
            <Input
              id="pomodoro-work"
              type="number"
              value={pomodoroWork}
              onChange={(e) => setPomodoroWork(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pomodoro-short-break">Short Break</Label>
            <Input
              id="pomodoro-short-break"
              type="number"
              value={pomodoroShortBreak}
              onChange={(e) => setPomodoroShortBreak(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pomodoro-long-break">Long Break</Label>
            <Input
              id="pomodoro-long-break"
              type="number"
              value={pomodoroLongBreak}
              onChange={(e) => setPomodoroLongBreak(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}