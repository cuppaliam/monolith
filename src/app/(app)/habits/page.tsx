import HabitTracker from '@/components/habits/habit-tracker';
import { HabitActions } from '@/components/habits/habit-actions';

export default function HabitsPage() {
  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Habits</h1>
          <p className="text-muted-foreground">Track your weekly habits and build consistency.</p>
        </div>
        <HabitActions />
      </header>
      <HabitTracker />
    </div>
  );
}
