import { motion } from "framer-motion";
import { CheckCircle2, Circle, MoreHorizontal, PenSquare, Trash2 } from "lucide-react";
import { TaskFiltersPanel } from "@/components/tasks/task-filters";
import { TaskList } from "@/components/tasks/task-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/use-app-store";
import { cn } from "@/utils/cn";
import type { Task, TaskFilters } from "@/types/task";

interface TasksPageProps {
  tasks: Task[];
  filters: TaskFilters;
  availableTags: string[];
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
  isLoading = false,
  onFiltersChange,
  onResetFilters,
  onToggleTask,
  onEditTask,
  onDeleteTask,
  onReorder,
}: TasksPageProps) => {
  const { hasSeenDailyTasksIntro, setHasSeenDailyTasksIntro } = useAppStore();
  const todayStr = new Date().toISOString().split("T")[0];

  const dailyTasks = tasks
    .filter((t) => t.isDaily)
    .map((t) => ({
      ...t,
      completed: t.completedDates.includes(todayStr),
    }));
    
  const regularTasks = tasks.filter((t) => !t.isDaily);

  return (
    <div className="space-y-6">
      <Dialog 
        open={!hasSeenDailyTasksIntro} 
        onOpenChange={(open) => {
          if (!open) setHasSeenDailyTasksIntro(true);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Introducing Daily Tasks! 🌅</DialogTitle>
            <DialogDescription>
              You can now mark tasks as "Daily Tasks" when creating them. They will appear pinned to the top of your list.
              <br /><br />
              <strong>The best part:</strong> They automatically reset every single day, while keeping a permanent historical record of your habits behind the scenes.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setHasSeenDailyTasksIntro(true)}>
              Got it, thanks!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <TaskFiltersPanel
        filters={filters}
        availableTags={availableTags}
        onFiltersChange={onFiltersChange}
        onReset={onResetFilters}
      />

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
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
          <>
            {dailyTasks.length > 0 && (
              <div className="space-y-4">
                <Card className="overflow-hidden border-2 border-border/80 bg-white/40 dark:bg-black/40">
                  <CardHeader className="bg-muted/30 pb-4 pt-5">
                    <CardTitle className="font-handwriting text-3xl font-bold tracking-tight text-foreground/90">
                      Daily tasks
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {dailyTasks.map((task, index) => (
                      <div
                        key={task.id}
                        className={cn(
                          "flex items-center gap-3 p-4 transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]",
                          index !== dailyTasks.length - 1 && "border-b border-border/50",
                          task.completed && "opacity-75"
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => onToggleTask(task.id)}
                          className="mt-0.5 text-muted-foreground transition hover:text-primary"
                        >
                          {task.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-foreground" />
                          ) : (
                            <Circle className="h-5 w-5" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "font-handwriting text-2xl font-semibold tracking-wide",
                            task.completed ? "text-muted-foreground line-through opacity-70" : "text-foreground/90"
                          )}>
                            {task.title}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEditTask(task.id)}>
                              <PenSquare className="mr-2 h-4 w-4" />
                              Edit task
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-foreground focus:text-foreground"
                              onClick={() => onDeleteTask(task.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete task
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}
            
            <div className="space-y-4">
              {dailyTasks.length > 0 && <h3 className="text-lg font-semibold tracking-tight">All Tasks</h3>}
              <TaskList
                tasks={regularTasks}
                onToggle={onToggleTask}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onReorder={onReorder}
              />
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};
