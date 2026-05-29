import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TaskFilters, TaskPriority } from "@/types/task";
import { cn } from "@/utils/cn";

interface TaskFiltersProps {
  filters: TaskFilters;
  availableTags: string[];
  onFiltersChange: (patch: Partial<TaskFilters>) => void;
  onReset: () => void;
}

const priorities: Array<TaskPriority | "all"> = ["all", "low", "medium", "high", "urgent"];

export const TaskFiltersPanel = ({
  filters,
  availableTags,
  onFiltersChange,
  onReset,
}: TaskFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [localQuery, setLocalQuery] = useState(filters.query);

  // Keep local query in sync if the global query filter changes (e.g. on Reset/Clear)
  useEffect(() => {
    setLocalQuery(filters.query);
  }, [filters.query]);

  // Debounce updates to global store to prevent full page re-renders on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localQuery !== filters.query) {
        onFiltersChange({ query: localQuery });
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [localQuery, onFiltersChange, filters.query]);

  const activeFiltersCount = [
    filters.status !== "all",
    filters.priority !== "all",
    filters.view !== "all",
    filters.tag !== "all",
  ].filter(Boolean).length;

  const hasActiveFilters = activeFiltersCount > 0 || filters.query.trim() !== "";

  return (
    <div className="glass-panel surface-outline space-y-3 p-3.5 sm:p-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={localQuery}
            onChange={(event) => setLocalQuery(event.target.value)}
            placeholder="Search tasks, notes, or tags..."
            className="h-10 rounded-[18px] pl-10 shadow-none"
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "h-10 rounded-[18px] px-3 sm:px-4 gap-2 shrink-0 transition-colors",
            (showFilters || activeFiltersCount > 0) && "border-primary bg-primary/5 text-primary dark:bg-white/5 dark:text-foreground"
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
          {activeFiltersCount > 0 && (
            <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground font-semibold dark:bg-white dark:text-black">
              {activeFiltersCount}
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="h-10 rounded-[18px] px-3 sm:px-4 gap-2 shrink-0 border-dashed"
          >
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">Clear</span>
          </Button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-2.5 pt-3 xl:grid-cols-4 border-t border-black/5 dark:border-white/5 mt-3">
              <div className="space-y-1.5">
                <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Status
                </p>
                <Select
                  value={filters.status}
                  onValueChange={(value) => onFiltersChange({ status: value as TaskFilters["status"] })}
                >
                  <SelectTrigger className="h-10 rounded-[18px] shadow-none">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All tasks</SelectItem>
                    <SelectItem value="active">Active only</SelectItem>
                    <SelectItem value="completed">Completed only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                  Priority
                </p>
                <Select
                  value={filters.priority}
                  onValueChange={(value) => onFiltersChange({ priority: value as TaskFilters["priority"] })}
                >
                  <SelectTrigger className="h-10 rounded-[18px] shadow-none">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priority === "all" ? "All priorities" : priority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                  Timeline
                </p>
                <Select
                  value={filters.view}
                  onValueChange={(value) => onFiltersChange({ view: value as TaskFilters["view"] })}
                >
                  <SelectTrigger className="h-10 rounded-[18px] shadow-none">
                    <SelectValue placeholder="Timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All timelines</SelectItem>
                    <SelectItem value="today">Due today</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">Tag</p>
                <Select value={filters.tag} onValueChange={(value) => onFiltersChange({ tag: value })}>
                  <SelectTrigger className="h-10 rounded-[18px] shadow-none">
                    <SelectValue placeholder="Tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All tags</SelectItem>
                    {availableTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
