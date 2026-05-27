import { ArrowUpRight, CalendarClock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Task } from "@/types/task";
import { formatTaskDate } from "@/utils/date";

interface FocusListProps {
  tasks: Task[];
}

const priorityVariantMap = {
  low: "low",
  medium: "medium",
  high: "high",
  urgent: "urgent",
} as const;

export const FocusList = ({ tasks }: FocusListProps) => (
  <Card className="h-full">
    <CardHeader>
      <CardTitle>Today's Focus</CardTitle>
      <CardDescription>Top tasks to complete today.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-3">
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <div
            key={task.id}
            className="rounded-3xl border border-black/10 bg-black/[0.03] p-4 transition hover:bg-black/[0.05] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/[0.08]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{task.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
              </div>
              <ArrowUpRight className="mt-1 h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge variant={priorityVariantMap[task.priority]} className="capitalize">
                {task.priority}
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <CalendarClock className="h-3.5 w-3.5" />
                {formatTaskDate(task.dueDate)}
              </Badge>
            </div>
          </div>
        ))
      ) : (
        <div className="rounded-3xl border border-dashed border-black/10 bg-black/[0.03] p-6 text-sm text-muted-foreground dark:border-white/10 dark:bg-white/[0.03]">
          No focus tasks for today.
        </div>
      )}
    </CardContent>
  </Card>
);
