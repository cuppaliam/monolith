import TimePerProjectChart from "@/components/reports/time-per-project-chart";
import HabitCompletionChart from "@/components/reports/habit-completion-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-heading font-bold">Reports</h1>
        <p className="text-muted-foreground">Visualize your productivity and track your progress over time.</p>
      </header>
      
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Time per Project</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <TimePerProjectChart />
            </div>
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
    </div>
  );
}
