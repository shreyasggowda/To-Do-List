import type { TaskRecord } from "@/types/database";
import type { Task, TaskFormValues } from "@/types/task";

export const parseTags = (input: string) =>
  input
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

export const mapTaskRecordToTask = (record: TaskRecord): Task => ({
  id: record.id,
  title: record.title,
  description: record.description,
  completed: record.completed,
  priority: record.priority,
  dueDate: record.due_date,
  tags: record.tags ?? [],
  createdAt: record.created_at,
  updatedAt: record.updated_at,
  completedAt: record.completed_at,
  order: record.order_index,
});

export const buildInsertPayload = (
  userId: string,
  values: TaskFormValues,
  orderIndex: number,
) => ({
  user_id: userId,
  title: values.title.trim(),
  description: values.description.trim(),
  priority: values.priority,
  due_date: values.dueDate || null,
  tags: parseTags(values.tags),
  completed: false,
  completed_at: null,
  order_index: orderIndex,
});

export const buildUpdatePayload = (values: TaskFormValues) => ({
  title: values.title.trim(),
  description: values.description.trim(),
  priority: values.priority,
  due_date: values.dueDate || null,
  tags: parseTags(values.tags),
});
