import Timer from '@/components/time-tracking/timer';
import TimeLogTable from '@/components/time-tracking/time-log-table';
import { timeEntries } from '@/lib/data';

export default function TimeTrackingPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-heading font-bold">Time Tracking</h1>
        <p className="text-muted-foreground">Track your time and stay productive.</p>
      </header>
      <Timer />
      <TimeLogTable entries={timeEntries} />
    </div>
  );
}
