import { motion } from "framer-motion";
import { TaskFiltersPanel } from "@/components/tasks/task-filters";
import { TaskList } from "@/components/tasks/task-list";
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
}: TasksPageProps) => (
  <div className="space-y-4">
    <TaskFiltersPanel
      filters={filters}
      availableTags={availableTags}
      onFiltersChange={onFiltersChange}
      onReset={onResetFilters}
    />

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
);
