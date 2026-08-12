import type { TaskPriority } from "@/types/task";

// A dedicated database row type keeps the Supabase payload shape explicit.
// That makes it easier to map server data into UI-friendly task objects.
export interface TaskRecord {
  id: string;
  user_id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: TaskPriority;
  due_date: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  order_index: number;
  is_daily: boolean;
  completed_dates: string[];
}
