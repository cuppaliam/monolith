'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer, Gauge, Clock } from 'lucide-react';
import TimerComponent from '@/components/time-tracking/timer';

type TimerMode = 'stopwatch' | 'pomodoro' | 'timer';

const modeConfig = {
  stopwatch: {
    icon: Gauge,
    label: 'Stopwatch',
  },
  pomodoro: {
    icon: Clock,
    label: 'Pomodoro',
  },
  timer: {
    icon: Timer,
    label: 'Timer',
  },
};

export default function TimeTrackingPage() {
  const [mode, setMode] = useState<TimerMode>('stopwatch');

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] w-full text-center">
      <div className="flex w-full max-w-4xl mx-auto gap-8">
        {/* Vertical Mode Selector */}
        <div className="flex flex-col gap-2">
          {(['stopwatch', 'pomodoro', 'timer'] as TimerMode[]).map((m) => {
            const Icon = modeConfig[m].icon;
            return (
              <Button
                key={m}
                variant={mode === m ? 'secondary' : 'ghost'}
                size="lg"
                className="flex items-center justify-start gap-3 w-48"
                onClick={() => setMode(m)}
              >
                <Icon className="h-5 w-5 text-muted-foreground" />
                <span>{modeConfig[m].label}</span>
              </Button>
            );
          })}
        </div>

        {/* Timer Component */}
        <div className="flex-grow flex items-center justify-center">
          <TimerComponent mode={mode} />
        </div>
      </div>
    </div>
  );
}
