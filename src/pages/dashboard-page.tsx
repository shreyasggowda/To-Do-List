import { CheckCheck, CircleDashed, Flame, Focus, ListTodo } from "lucide-react";
import { FocusList } from "@/components/dashboard/focus-list";
import { PriorityChart } from "@/components/dashboard/priority-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { WeeklyActivityChart } from "@/components/dashboard/weekly-activity-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { DashboardStats } from "@/types/task";

interface DashboardPageProps {
  stats: DashboardStats;
  weeklyCompletionData: Array<{ day: string; completed: number }>;
  priorityChartData: Array<{ priority: string; total: number }>;
  onCreateTask: () => void;
  onGoToTasks: () => void;
}

export const DashboardPage = ({
  stats,
  weeklyCompletionData,
  priorityChartData,
  onCreateTask,
  onGoToTasks,
}: DashboardPageProps) => (
  <div className="space-y-4">
    <Card className="glass-panel-strong overflow-hidden">
      <CardContent className="relative p-6 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-400/15 via-cyan-300/5 to-emerald-300/10" />
        <div className="relative flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <Badge variant="secondary" className="border border-white/10 bg-white/10">
              Premium focus system
            </Badge>
            <h3 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              A calm workspace for high-signal planning and daily execution.
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              FocusFlow blends a clean dashboard, fast task capture, and lightweight organization into a
              productivity app that feels intentional rather than mechanical.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={onCreateTask} className="rounded-2xl">
                Capture next task
              </Button>
              <Button variant="outline" onClick={onGoToTasks} className="rounded-2xl">
                Open task board
              </Button>
            </div>
          </div>

          <div className="glass-panel w-full max-w-md p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Completion progress</p>
              <p className="text-2xl font-semibold">{stats.completionPercentage}%</p>
            </div>
            <Progress value={stats.completionPercentage} className="mt-4" />
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-white/5 p-3">
                <p className="text-muted-foreground">Completed</p>
                <p className="mt-1 text-lg font-semibold">{stats.completedTasks}</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-3">
                <p className="text-muted-foreground">Pending</p>
                <p className="mt-1 text-lg font-semibold">{stats.pendingTasks}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total tasks"
        value={String(stats.totalTasks)}
        hint="Everything currently tracked in your workspace."
        icon={ListTodo}
        index={0}
      />
      <StatCard
        label="Completed"
        value={String(stats.completedTasks)}
        hint="Momentum compounds when tasks actually get closed."
        icon={CheckCheck}
        index={1}
      />
      <StatCard
        label="Pending"
        value={String(stats.pendingTasks)}
        hint="A concise backlog helps you make sharper decisions."
        icon={CircleDashed}
        index={2}
      />
      <StatCard
        label="Streak"
        value={`${stats.productivityStreak} days`}
        hint="Consecutive days with at least one completed task."
        icon={Flame}
        index={3}
      />
    </div>

    <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr] xl:[&>*]:min-w-0">
      <WeeklyActivityChart data={weeklyCompletionData} />
      <FocusList tasks={stats.todayFocus} />
    </div>

    <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr] xl:[&>*]:min-w-0">
      <PriorityChart data={priorityChartData} />
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-primary">
              <Focus className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-semibold">How this app is structured</p>
              <p className="text-sm text-muted-foreground">
                Educational comments and reusable primitives make the codebase easier to grow.
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="rounded-3xl bg-white/5 p-4">
              <p className="font-semibold">Zustand store</p>
              <p className="mt-2 text-sm text-muted-foreground">
                One typed state layer coordinates auth, cloud sync, filtering, dialogs, and shortcuts.
              </p>
            </div>
            <div className="rounded-3xl bg-white/5 p-4">
              <p className="font-semibold">Supabase backend</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Auth and Postgres provide real user accounts and per-user data isolation without a custom API.
              </p>
            </div>
            <div className="rounded-3xl bg-white/5 p-4">
              <p className="font-semibold">Tailwind utilities</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Utility-first styling scales well because spacing, radius, and color patterns stay consistent.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);
