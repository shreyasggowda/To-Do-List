export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type TaskPage = "dashboard" | "tasks";
export type TaskStatusFilter = "all" | "active" | "completed";
export type TaskViewFilter = "all" | "today" | "upcoming" | "overdue";

// Interfaces keep domain rules centralized so every component
// reads the same shape instead of re-declaring ad hoc objects.
export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: TaskPriority;
  dueDate: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  order: number;
  isDaily: boolean;
  completedDates: string[];
}

export interface TaskFormValues {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
  tags: string;
  isDaily: boolean;
}

export interface TaskFilters {
  query: string;
  status: TaskStatusFilter;
  priority: TaskPriority | "all";
  tag: string;
  view: TaskViewFilter;
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionPercentage: number;
  productivityStreak: number;
  todayFocus: Task[];
}
