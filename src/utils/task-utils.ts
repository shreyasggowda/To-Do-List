import { eachDayOfInterval, format, isSameDay, parseISO, subDays } from "date-fns";
import type { DashboardStats, Task, TaskFilters, TaskPriority } from "@/types/task";
import { isTaskDueToday, isTaskOverdue, isTaskUpcoming } from "@/utils/date";

const priorityWeight: Record<TaskPriority, number> = {
  low: 1,
  medium: 2,
  high: 3,
  urgent: 4,
};

export const sortTasks = (tasks: Task[]) =>
  [...tasks].sort((left, right) => {
    if (left.completed !== right.completed) {
      return Number(left.completed) - Number(right.completed);
    }

    if (left.order !== right.order) {
      return left.order - right.order;
    }

    return priorityWeight[right.priority] - priorityWeight[left.priority];
  });

export const filterTasks = (tasks: Task[], filters: TaskFilters) =>
  sortTasks(tasks).filter((task) => {
    const matchesQuery =
      filters.query.trim().length === 0 ||
      [task.title, task.description, task.tags.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(filters.query.toLowerCase());

    const matchesStatus =
      filters.status === "all" ||
      (filters.status === "active" && !task.completed) ||
      (filters.status === "completed" && task.completed);

    const matchesPriority =
      filters.priority === "all" || task.priority === filters.priority;

    const matchesTag =
      filters.tag === "all" ||
      task.tags.some((tag) => tag.toLowerCase() === filters.tag.toLowerCase());

    const matchesView =
      filters.view === "all" ||
      (filters.view === "today" && isTaskDueToday(task.dueDate)) ||
      (filters.view === "upcoming" && isTaskUpcoming(task.dueDate)) ||
      (filters.view === "overdue" && isTaskOverdue(task.dueDate) && !task.completed);

    return matchesQuery && matchesStatus && matchesPriority && matchesTag && matchesView;
  });

export const getUniqueTags = (tasks: Task[]) =>
  Array.from(new Set(tasks.flatMap((task) => task.tags))).sort((left, right) =>
    left.localeCompare(right),
  );

export const getDashboardStats = (tasks: Task[]): DashboardStats => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const todayFocus = sortTasks(
    tasks.filter((task) => !task.completed && (isTaskDueToday(task.dueDate) || task.priority === "urgent")),
  ).slice(0, 3);

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    completionPercentage,
    productivityStreak: calculateProductivityStreak(tasks),
    todayFocus,
  };
};

export const calculateProductivityStreak = (tasks: Task[]) => {
  const completedDates = tasks
    .filter((task) => task.completedAt)
    .map((task) => parseISO(task.completedAt!));

  if (completedDates.length === 0) {
    return 0;
  }

  let streak = 0;
  let cursor = new Date();

  while (
    completedDates.some((completedDate) => isSameDay(completedDate, cursor))
  ) {
    streak += 1;
    cursor = subDays(cursor, 1);
  }

  return streak;
};

export const getWeeklyCompletionData = (tasks: Task[]) => {
  const interval = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date(),
  });

  return interval.map((day) => ({
    day: format(day, "EEE"),
    completed: tasks.filter(
      (task) => task.completedAt && isSameDay(parseISO(task.completedAt), day),
    ).length,
  }));
};

export const getPriorityChartData = (tasks: Task[]) =>
  (["low", "medium", "high", "urgent"] as TaskPriority[]).map((priority) => ({
    priority,
    total: tasks.filter((task) => task.priority === priority && !task.completed).length,
  }));
