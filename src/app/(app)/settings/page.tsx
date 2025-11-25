import HabitSettings from '@/components/settings/habit-settings';
import TimerSettings from '@/components/settings/timer-settings';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-heading font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Customize your Monolith experience.
        </p>
      </header>

      <TimerSettings />
      <HabitSettings />
    </div>
  );
}
