import WeeklyOverviewChart from "@/components/dashboard/weekly-overview-chart";
import HabitCompletionChart from "@/components/reports/habit-completion-chart";
import TimeLogTable from "@/components/time/time-log-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { timeEntries } from "@/lib/data";

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-heading font-bold">Reports</h1>
        <p className="text-muted-foreground">Visualize your productivity and track your progress over time.</p>
      </header>
      
      <div className="grid gap-8 md:grid-cols-1">
         <Card>
          <CardHeader>
            <CardTitle>Weekly Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <WeeklyOverviewChart />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Time per Project</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Chart disabled, view on dashboard.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Habit Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <HabitCompletionChart />
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <TimeLogTable entries={timeEntries} />
      </div>
    </div>
  );
}
