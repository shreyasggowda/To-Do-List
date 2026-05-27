import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
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

export const TaskList = ({
  tasks,
  onToggle,
  onEdit,
  onDelete,
  onReorder,
}: TaskListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  return (
    <div className="space-y-3">
      {tasks.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(event) => {
            if (event.over) {
              onReorder(String(event.active.id), String(event.over.id), tasks.map((task) => task.id));
            }
          }}
        >
          <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
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
          <div className="rounded-full border border-white/10 bg-white/5 p-4">
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
