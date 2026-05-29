import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Task, TaskFormValues, TaskPriority } from "@/types/task";

const emptyValues: TaskFormValues = {
  title: "",
  description: "",
  priority: "medium",
  dueDate: "",
  tags: "",
};

const toFormValues = (task: Task | null): TaskFormValues =>
  task
    ? {
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate?.slice(0, 10) ?? "",
        tags: task.tags.join(", "),
      }
    : emptyValues;

interface TaskDialogProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onCreate: (values: TaskFormValues) => Promise<void>;
  onUpdate: (taskId: string, values: TaskFormValues) => Promise<void>;
}

export const TaskDialog = ({
  isOpen,
  task,
  onClose,
  onCreate,
  onUpdate,
}: TaskDialogProps) => {
  const [values, setValues] = useState<TaskFormValues>(() => toFormValues(task));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!values.title.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (task) {
        await onUpdate(task.id, values);
        return;
      }

      await onCreate(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? onClose() : null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? "Refine task" : "Capture a new task"}</DialogTitle>
          <DialogDescription>
            Add clear intent, a realistic due date, and tags so the task stays actionable later.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 grid gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={values.title}
              onChange={(event) => setValues((current) => ({ ...current, title: event.target.value }))}
              placeholder="What needs to happen?"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={values.description}
              onChange={(event) =>
                setValues((current) => ({ ...current, description: event.target.value }))
              }
              placeholder="Add context, notes, or success criteria."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Select
                value={values.priority}
                onValueChange={(value) =>
                  setValues((current) => ({ ...current, priority: value as TaskPriority }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Due date</label>
              <Input
                type="date"
                value={values.dueDate}
                onChange={(event) => setValues((current) => ({ ...current, dueDate: event.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tags</label>
            <Input
              value={values.tags}
              onChange={(event) => setValues((current) => ({ ...current, tags: event.target.value }))}
              placeholder="Strategy, Design, Personal"
            />
            <p className="text-xs text-muted-foreground">Separate multiple tags with commas.</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={() => void handleSubmit()} disabled={isSubmitting}>
            {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            {task ? "Save changes" : "Create task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
