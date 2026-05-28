import { CheckCheck, CircleDashed, Flame, ListTodo } from "lucide-react";
import { FocusList } from "@/components/dashboard/focus-list";
import { PriorityChart } from "@/components/dashboard/priority-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { WeeklyActivityChart } from "@/components/dashboard/weekly-activity-chart";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { DashboardStats } from "@/types/task";

interface DashboardPageProps {
  stats: DashboardStats;
  weeklyCompletionData: Array<{ day: string; completed: number }>;
  priorityChartData: Array<{ priority: string; total: number }>;
}

export const DashboardPage = ({
  stats,
  weeklyCompletionData,
  priorityChartData,
}: DashboardPageProps) => (
  <div className="space-y-4">
    <Card className="overflow-hidden">
      <CardContent className="p-4 sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Overview</p>
            <h3 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              {stats.completionPercentage}% complete
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {stats.completedTasks} completed and {stats.pendingTasks} remaining.
            </p>
          </div>

          <div className="w-full max-w-xl">
            <Progress value={stats.completionPercentage} className="mt-1" />
          </div>
        </div>
      </CardContent>
    </Card>

    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      <StatCard label="Total tasks" value={String(stats.totalTasks)} icon={ListTodo} index={0} />
      <StatCard label="Completed" value={String(stats.completedTasks)} icon={CheckCheck} index={1} />
      <StatCard label="Pending" value={String(stats.pendingTasks)} icon={CircleDashed} index={2} />
      <StatCard label="Streak" value={`${stats.productivityStreak} days`} icon={Flame} index={3} />
    </div>

    <div className="grid gap-4 xl:grid-cols-2 xl:[&>*]:min-w-0">
      <WeeklyActivityChart data={weeklyCompletionData} />
      <PriorityChart data={priorityChartData} />
    </div>

    <FocusList tasks={stats.todayFocus} />
  </div>
);
