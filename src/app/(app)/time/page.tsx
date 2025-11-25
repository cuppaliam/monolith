
'use client';

import TimerComponent from '@/components/time/timer';

export const dynamic = 'force-dynamic';

export default function TimePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] w-full">
      <TimerComponent />
    </div>
  );
}
