import { habits, habitLogs } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { format, isToday } from 'date-fns';

export default function HabitsOverview() {
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todaysLogs = habitLogs.filter(log => log.date === todayStr);
  const completedToday = todaysLogs.length;
  const totalHabits = habits.length;
  const progress = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Habits</CardTitle>
        <CardDescription>
          {completedToday} of {totalHabits} habits completed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={progress} className="mb-4" />
        <div className="space-y-4">
          {habits.slice(0, 4).map(habit => {
            const isCompleted = todaysLogs.some(log => log.habitId === habit.id);
            return (
              <div key={habit.id} className="flex items-center space-x-2">
                <Checkbox id={`habit-overview-${habit.id}`} checked={isCompleted} />
                <label
                  htmlFor={`habit-overview-${habit.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {habit.name}
                </label>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
