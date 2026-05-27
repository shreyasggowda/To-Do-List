import {
  differenceInCalendarDays,
  format,
  formatDistanceToNowStrict,
  isAfter,
  isBefore,
  isToday,
  parseISO,
} from "date-fns";

export const formatTaskDate = (date: string | null) =>
  date ? format(parseISO(date), "MMM d") : "No deadline";

export const formatRelativeDate = (date: string | null) =>
  date ? formatDistanceToNowStrict(parseISO(date), { addSuffix: true }) : "Anytime";

export const formatDueContext = (date: string | null) => {
  if (!date) {
    return "No deadline";
  }

  const dueDate = parseISO(date);
  const delta = differenceInCalendarDays(dueDate, new Date());

  if (delta === 0) {
    return "Due today";
  }

  if (delta === 1) {
    return "Due tomorrow";
  }

  if (delta > 1) {
    return `Due in ${delta} days`;
  }

  if (delta === -1) {
    return "Overdue by 1 day";
  }

  return `Overdue by ${Math.abs(delta)} days`;
};

export const isTaskDueToday = (date: string | null) => (date ? isToday(parseISO(date)) : false);

export const isTaskOverdue = (date: string | null) =>
  date ? isBefore(parseISO(date), new Date()) && !isToday(parseISO(date)) : false;

export const isTaskUpcoming = (date: string | null) =>
  date ? isAfter(parseISO(date), new Date()) && !isToday(parseISO(date)) : false;
