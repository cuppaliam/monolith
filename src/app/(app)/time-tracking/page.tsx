'use client';

import TimerComponent from '@/components/time-tracking/timer';

export default function TimeTrackingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] w-full">
      <TimerComponent />
    </div>
  );
}
