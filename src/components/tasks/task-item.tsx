import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import { CalendarClock, CheckCircle2, Circle, GripVertical, MoreHorizontal, PenSquare, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Task } from "@/types/task";
import { cn } from "@/utils/cn";
import { formatDueContext, formatRelativeDate, formatTaskDate, isTaskOverdue } from "@/utils/date";

const priorityVariantMap = {
  low: "low",
  medium: "medium",
  high: "high",
  urgent: "urgent",
} as const;

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export const TaskItem = ({ task, onToggle, onEdit, onDelete }: TaskItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  return (
    <motion.div
      ref={setNodeRef}
      layout
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(isDragging && "z-20")}
    >
      <Card
        className={cn(
          "transition duration-200 hover:-translate-y-0.5 hover:bg-black/[0.03] dark:hover:bg-white/[0.08]",
          task.completed && "opacity-75",
          isDragging && "shadow-glow",
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3 pt-3">
            <button
              type="button"
              onClick={() => onToggle(task.id)}
              className="mt-1 text-muted-foreground transition hover:text-primary"
              aria-label={task.completed ? "Mark task as incomplete" : "Mark task as complete"}
            >
              {task.completed ? (
                <CheckCircle2 className="h-5 w-5 text-foreground" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "text-base font-semibold break-words",
                      task.completed && "text-muted-foreground line-through",
                    )}
                  >
                    {task.title}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground break-words">{task.description}</p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    className="rounded-full p-2 text-muted-foreground transition hover:bg-black/[0.05] hover:text-foreground dark:hover:bg-white/10 touch-none"
                    aria-label="Reorder task"
                    {...attributes}
                    {...listeners}
                  >
                    <GripVertical className="h-4 w-4" />
                  </button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                        <span className="sr-only">Open task actions</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(task.id)}>
                        <PenSquare className="mr-2 h-4 w-4" />
                        Edit task
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-foreground focus:text-foreground"
                        onClick={() => onDelete(task.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete task
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Badge variant={priorityVariantMap[task.priority]} className="capitalize">
                  {task.priority}
                </Badge>

                <Badge
                  variant={isTaskOverdue(task.dueDate) && !task.completed ? "destructive" : "secondary"}
                  className="gap-1"
                >
                  <CalendarClock className="h-3.5 w-3.5" />
                  {formatTaskDate(task.dueDate)}
                </Badge>

                {task.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {task.completed
                  ? `Completed ${formatRelativeDate(task.completedAt)}`
                  : formatDueContext(task.dueDate)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
