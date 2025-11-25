import type { Habit, HabitLog } from './types';
import { subDays, format, isSameDay } from 'date-fns';

export const calculateStreaks = (habits: Habit[], habitLogs: HabitLog[]) => {
  const streaks: { [habitId: string]: number } = {};

  habits.forEach((habit) => {
    const logsForHabit = habitLogs
      .filter((log) => log.habitId === habit.id)
      .map((log) => log.date)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    const uniqueDates = new Set(logsForHabit.map(log => format(new Date(log), 'yyyy-MM-dd')));

    if (logsForHabit.length === 0) {
      streaks[habit.id] = 0;
      return;
    }
    
    let currentStreak = 0;
    let checkDate = new Date();

    // The streak is current only if today or yesterday is completed
    const todayCompleted = uniqueDates.has(format(checkDate, 'yyyy-MM-dd'));
    const yesterdayCompleted = uniqueDates.has(format(subDays(checkDate, 1), 'yyyy-MM-dd'));

    if (!todayCompleted && !yesterdayCompleted) {
      streaks[habit.id] = 0;
      return;
    }
    
    // If today is not completed, start checking from yesterday
    if (!todayCompleted) {
        checkDate = subDays(checkDate, 1);
    }

    while(uniqueDates.has(format(checkDate, 'yyyy-MM-dd'))) {
        currentStreak++;
        checkDate = subDays(checkDate, 1);
    }
    
    streaks[habit.id] = currentStreak;
  });

  return streaks;
};
