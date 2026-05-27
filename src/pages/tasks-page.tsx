import { useDeferredValue } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { TaskFiltersPanel } from "@/components/tasks/task-filters";
import { TaskList } from "@/components/tasks/task-list";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Task, TaskFilters } from "@/types/task";

interface TasksPageProps {
  tasks: Task[];
  filters: TaskFilters;
  availableTags: string[];
  totalTasks: number;
  isLoading?: boolean;
  onFiltersChange: (patch: Partial<TaskFilters>) => void;
  onResetFilters: () => void;
  onToggleTask: (taskId: string) => void;
  onEditTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onReorder: (activeId: string, overId: string, visibleTaskIds: string[]) => void;
}

export const TasksPage = ({
  tasks,
  filters,
  availableTags,
  totalTasks,
  isLoading = false,
  onFiltersChange,
  onResetFilters,
  onToggleTask,
  onEditTask,
  onDeleteTask,
  onReorder,
}: TasksPageProps) => {
  const deferredQuery = useDeferredValue(filters.query);

  return (
    <div className="space-y-4">
      <TaskFiltersPanel
        filters={filters}
        availableTags={availableTags}
        onFiltersChange={onFiltersChange}
        onReset={onResetFilters}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="glass-panel surface-outline h-40 animate-pulse rounded-[32px] bg-white/[0.04]"
                  />
                ))}
              </div>
            ) : (
              <TaskList
                tasks={tasks}
                onToggle={onToggleTask}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onReorder={onReorder}
              />
            )}
          </motion.div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Task Insights</CardTitle>
              <CardDescription>Live feedback based on the current filter state.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-3xl bg-white/5 p-4">
                <p className="text-sm text-muted-foreground">Visible tasks</p>
                <p className="mt-2 text-3xl font-semibold">{tasks.length}</p>
                <p className="mt-2 text-sm text-muted-foreground">Out of {totalTasks} total tracked tasks.</p>
              </div>

              <div className="rounded-3xl bg-white/5 p-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <p className="font-semibold">Current focus</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="secondary">{filters.status}</Badge>
                  <Badge variant="secondary">{filters.view}</Badge>
                  <Badge variant="secondary">{filters.priority}</Badge>
                  <Badge variant="secondary">{filters.tag}</Badge>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  Search query: {deferredQuery.trim() ? `"${deferredQuery}"` : "none"}
                </p>
              </div>

              <div className="rounded-3xl bg-white/5 p-4 text-sm text-muted-foreground">
                Drag tasks using the handle to reorder them. The order is saved back to Supabase so each
                signed-in user sees the same workspace across refreshes and devices.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
