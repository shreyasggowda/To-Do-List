import { ArrowUpRight, CalendarClock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Task } from "@/types/task";
import { formatTaskDate } from "@/utils/date";

interface FocusListProps {
  tasks: Task[];
}

const priorityVariantMap = {
  low: "secondary",
  medium: "default",
  high: "warning",
  urgent: "destructive",
} as const;

export const FocusList = ({ tasks }: FocusListProps) => (
  <Card className="h-full">
    <CardHeader>
      <CardTitle>Today's Focus</CardTitle>
      <CardDescription>Prioritized tasks that deserve protected attention today.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-3">
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <div
            key={task.id}
            className="rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/[0.08]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{task.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
              </div>
              <ArrowUpRight className="mt-1 h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge variant={priorityVariantMap[task.priority]}>{task.priority}</Badge>
              <Badge variant="secondary" className="gap-1">
                <CalendarClock className="h-3.5 w-3.5" />
                {formatTaskDate(task.dueDate)}
              </Badge>
            </div>
          </div>
        ))
      ) : (
        <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-6 text-sm text-muted-foreground">
          Nothing urgent right now. Use the extra space for strategic deep work.
        </div>
      )}
    </CardContent>
  </Card>
);
