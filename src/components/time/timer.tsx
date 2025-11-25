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
import { Play, Pause, RotateCcw, Timer, Gauge, Clock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useCollection, useFirebase, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { Project } from '@/lib/types';

type TimerMode = 'stopwatch' | 'pomodoro' | 'timer';

interface ModeConfig {
  icon: LucideIcon;
  label: string;
}

const modeConfig: Record<TimerMode, ModeConfig> = {
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

const pomodoroDurations = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export default function TimerComponent() {
  const { firestore } = useFirebase();
  const { user } = useUser();
  const [mode, setMode] = useState<TimerMode>('stopwatch');
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const [pomodoroState, setPomodoroState] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [pomodoroCycles, setPomodoroCycles] = useState(0);

  const projectsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'projects'), where('ownerId', '==', user.uid));
  }, [firestore, user]);
  const { data: projects } = useCollection<Project>(projectsQuery);

  const getInitialTime = useCallback(() => {
    switch (mode) {
      case 'pomodoro':
        setPomodoroState('work');
        setPomodoroCycles(0);
        return pomodoroDurations.work;
      case 'timer':
        return 15 * 60;
      case 'stopwatch':
      default:
        return 0;
    }
  }, [mode]);

  useEffect(() => {
    setIsRunning(false);
    setTime(getInitialTime());
  }, [mode, getInitialTime]);

  const saveTimeEntry = useCallback(() => {
    if (!firestore || !user || !selectedProject || !startTime) return;
    if (time <= 0 && mode === 'stopwatch') return;

    const endTime = new Date();
    const duration = mode === 'stopwatch' 
        ? Math.round((endTime.getTime() - startTime.getTime()) / 1000) 
        : pomodoroDurations.work;

    if (duration > 0) {
        const timeEntriesCollection = collection(firestore, 'time_entries');
        addDocumentNonBlocking(timeEntriesCollection, {
            projectId: selectedProject,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            duration: duration,
            ownerId: user.uid,
        });
    }
  }, [firestore, user, selectedProject, time, startTime, mode]);
  
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (mode === 'stopwatch') {
            return prevTime + 1;
          }
          if (prevTime > 0) {
            return prevTime - 1;
          }
          
          if (mode === 'pomodoro') {
            if (pomodoroState === 'work') {
              saveTimeEntry();
              const newCycles = pomodoroCycles + 1;
              setPomodoroCycles(newCycles);
              if (newCycles % 4 === 0) {
                setPomodoroState('longBreak');
                setTime(pomodoroDurations.longBreak);
              } else {
                setPomodoroState('shortBreak');
                setTime(pomodoroDurations.shortBreak);
              }
            } else { 
                setPomodoroState('work');
                setTime(pomodoroDurations.work);
            }
            setIsRunning(true);
            setStartTime(new Date());
          } else {
            setIsRunning(false);
          }
          
          return 0;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, mode, pomodoroState, pomodoroCycles, selectedProject, saveTimeEntry]);


  const handlePrimaryClick = () => {
    if (selectedProject || mode !== 'stopwatch') {
        if (!isRunning) {
            setStartTime(new Date());
        }
      setIsRunning((prev) => !prev);
    }
  };
  
  const handleStop = () => {
    setIsRunning(false);
    if ((mode === 'stopwatch' || (mode === 'pomodoro' && pomodoroState === 'work')) && time > 0) {
      saveTimeEntry();
    }
    setTime(getInitialTime());
    setStartTime(null);
  };
  
  const handleReset = () => {
    setIsRunning(false);
    setTime(getInitialTime());
    setStartTime(null);
  };

  const cycleMode = () => {
    const modes: TimerMode[] = ['stopwatch', 'pomodoro', 'timer'];
    const currentIndex = modes.indexOf(mode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setMode(modes[nextIndex]);
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
  
  const CurrentModeIcon = modeConfig[mode].icon;

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-8">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">Working on</span>
        <Select onValueChange={setSelectedProject} disabled={isRunning}>
          <SelectTrigger className="w-auto h-12 text-base border-none focus:ring-0 bg-transparent shadow-none pr-4">
            <SelectValue placeholder="project" />
          </SelectTrigger>
          <SelectContent>
            {(projects ?? []).map((project) => (
              <SelectItem key={project.id} value={project.id}>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: project.color }} />
                  {project.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>


      <div className="font-mono" style={{ fontSize: 'clamp(4rem, 15vw, 8rem)' }}>
        {largeFormatTime(time)}
      </div>

      <div className="flex items-center gap-4">
        <Button size="icon" variant="ghost" className="w-24 h-24 rounded-full" onClick={cycleMode}>
            <CurrentModeIcon className="h-8 w-8" />
            <span className="sr-only">Change Mode</span>
        </Button>
        <Button
          size="icon"
          className="w-24 h-24 rounded-full"
          onClick={isRunning ? handleStop : handlePrimaryClick}
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
