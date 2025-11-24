
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { projects } from '@/lib/data';
import { Play, Square, Pause, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';

type TimerMode = 'stopwatch' | 'pomodoro' | 'timer';

interface TimerComponentProps {
  mode: TimerMode;
}

const pomodoroDurations = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export default function TimerComponent({ mode }: TimerComponentProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  // Pomodoro specific state
  const [pomodoroState, setPomodoroState] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [pomodoroCycles, setPomodoroCycles] = useState(0);

  const getInitialTime = useCallback(() => {
    switch (mode) {
      case 'pomodoro':
        return pomodoroDurations[pomodoroState];
      case 'timer':
        return 15 * 60; // Default 15 minutes for timer
      case 'stopwatch':
      default:
        return 0;
    }
  }, [mode, pomodoroState]);

  useEffect(() => {
    setIsRunning(false);
    setTime(getInitialTime());
  }, [mode, getInitialTime]);
  
  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (mode === 'stopwatch') {
            return prevTime + 1;
          }
          // For timer and pomodoro
          if (prevTime > 0) {
            return prevTime - 1;
          }
          
          // Timer finished
          setIsRunning(false);
          if (mode === 'pomodoro') {
            // Handle Pomodoro state transition
            if (pomodoroState === 'work') {
              const newCycles = pomodoroCycles + 1;
              setPomodoroCycles(newCycles);
              if (newCycles % 4 === 0) {
                setPomodoroState('longBreak');
                setTime(pomodoroDurations.longBreak);
              } else {
                setPomodoroState('shortBreak');
                setTime(pomodoroDurations.shortBreak);
              }
            } else { // break finished
                setPomodoroState('work');
                setTime(pomodoroDurations.work);
            }
          }
          
          return 0;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, mode, pomodoroState, pomodoroCycles]);


  const handlePrimaryClick = () => {
    if (selectedProject || mode !== 'stopwatch') {
      setIsRunning((prev) => !prev);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(getInitialTime());
    // Here you would typically save the time entry
    if (mode === 'stopwatch' && time > 0) {
        console.log(`Time entry for project ${selectedProject}: ${time} seconds`);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const largeFormatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    if (hours > 0) {
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-8">
      <Select onValueChange={setSelectedProject} disabled={isRunning}>
        <SelectTrigger className="w-full md:w-[280px] h-12 text-base border-none focus:ring-0 bg-transparent shadow-none">
          <SelectValue placeholder="Select a project to track..." />
        </SelectTrigger>
        <SelectContent>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: project.color }} />
                {project.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="font-mono" style={{ fontSize: 'clamp(4rem, 15vw, 8rem)' }}>
        {largeFormatTime(time)}
      </div>

      <div className="flex items-center gap-4">
        <Button
          size="icon"
          className="w-24 h-24 rounded-full"
          onClick={handlePrimaryClick}
          disabled={!selectedProject && mode === 'stopwatch'}
          variant={isRunning ? 'destructive' : 'default'}
        >
          {isRunning ? <Pause className="h-10 w-10" /> : <Play className="h-10 w-10 ml-2" />}
          <span className="sr-only">{isRunning ? 'Pause Timer' : 'Start Timer'}</span>
        </Button>
         <Button size="icon" variant="ghost" className="w-24 h-24 rounded-full" onClick={handleReset}>
            <RotateCcw className="h-8 w-8" />
            <span className="sr-only">Reset Timer</span>
        </Button>
      </div>
    </div>
  );
}
