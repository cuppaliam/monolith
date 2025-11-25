
import HabitSettings from '@/components/settings/habit-settings';
import TimerSettings from '@/components/settings/timer-settings';
import ProjectSettings from '@/components/settings/project-settings';
import { Separator } from '@/components/ui/separator';

export const dynamic = 'force-dynamic';

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <header>
        <h1 className="text-3xl font-heading font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Customize your Monolith experience.
        </p>
      </header>

      <ProjectSettings />
      <Separator />
      <TimerSettings />
      <Separator />
      <HabitSettings />
    </div>
  );
}
