import { useMemo } from "react";
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AnimatePresence } from "framer-motion";
import { Inbox } from "lucide-react";
import type { Task } from "@/types/task";
import { TaskItem } from "@/components/tasks/task-item";

interface TaskListProps {
  tasks: Task[];
  onToggle: (taskId: string) => void;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onReorder: (activeId: string, overId: string, visibleTaskIds: string[]) => void;
}

const POINTER_SENSOR_OPTIONS = { activationConstraint: { distance: 6 } };
const TOUCH_SENSOR_OPTIONS = { activationConstraint: { delay: 180, tolerance: 6 } };

export const TaskList = ({
  tasks,
  onToggle,
  onEdit,
  onDelete,
  onReorder,
}: TaskListProps) => {
  const keyboardSensorOptions = useMemo(() => ({
    coordinateGetter: sortableKeyboardCoordinates
  }), []);

  const sensors = useSensors(
    useSensor(PointerSensor, POINTER_SENSOR_OPTIONS),
    useSensor(TouchSensor, TOUCH_SENSOR_OPTIONS),
    useSensor(KeyboardSensor, keyboardSensorOptions),
  );

  const taskIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

  return (
    <div className="space-y-3">
      {tasks.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(event) => {
            if (event.over) {
              onReorder(String(event.active.id), String(event.over.id), taskIds);
            }
          }}
        >
          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            <AnimatePresence initial={false}>
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={onToggle}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </AnimatePresence>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="glass-panel surface-outline flex min-h-[300px] flex-col items-center justify-center rounded-[32px] border-dashed p-8 text-center">
          <div className="rounded-full border border-black/10 bg-black/[0.04] p-4 dark:border-white/10 dark:bg-white/5">
            <Inbox className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="mt-5 text-lg font-semibold">Nothing matches these filters</p>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Try clearing a filter or create a new task to build momentum.
          </p>
        </div>
      )}
    </div>
  );
};
