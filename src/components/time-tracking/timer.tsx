'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { projects } from '@/lib/data';
import { Play, Square } from 'lucide-react';

export default function Timer() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStart = () => {
    if (selectedProject) {
      setIsRunning(true);
    }
  };

  const handleStop = () => {
    setIsRunning(false);
    // Here you would typically save the time entry
    console.log(`Time entry for project ${selectedProject}: ${elapsedTime} seconds`);
    setElapsedTime(0);
  };

  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0'
    )}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-grow w-full md:w-auto">
            <Select onValueChange={setSelectedProject} disabled={isRunning}>
                <SelectTrigger className="w-full md:w-[280px]">
                    <SelectValue placeholder="Select a project to track..." />
                </SelectTrigger>
                <SelectContent>
                    {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                        <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{backgroundColor: project.color}} />
                        {project.name}
                        </div>
                    </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
        <div className="flex items-center gap-4">
            <div className="text-3xl font-mono font-bold w-[150px] text-center">
                {formatTime(elapsedTime)}
            </div>
            {isRunning ? (
            <Button size="icon" className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600" onClick={handleStop}>
                <Square className="h-8 w-8" />
                <span className="sr-only">Stop Timer</span>
            </Button>
            ) : (
            <Button size="icon" className="w-16 h-16 rounded-full" onClick={handleStart} disabled={!selectedProject}>
                <Play className="h-8 w-8 ml-1" />
                <span className="sr-only">Start Timer</span>
            </Button>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
