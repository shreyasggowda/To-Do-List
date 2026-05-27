import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TaskFilters, TaskPriority } from "@/types/task";

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
}: TaskFiltersProps) => (
  <div className="glass-panel surface-outline space-y-3 p-3.5 sm:p-4">
    <div className="flex flex-col gap-2.5 xl:flex-row xl:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.query}
          onChange={(event) => onFiltersChange({ query: event.target.value })}
          placeholder="Search tasks, notes, or tags..."
          className="h-10 rounded-[18px] pl-10 shadow-none"
        />
      </div>
      <Button variant="outline" size="sm" onClick={onReset} className="h-10 rounded-[18px] px-4">
        <X className="h-4 w-4" />
        Clear filters
      </Button>
    </div>

    <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-4">
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
  </div>
);
