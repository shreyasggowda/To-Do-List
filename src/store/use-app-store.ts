import type { Session } from "@supabase/supabase-js";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Task, TaskFilters, TaskFormValues, TaskPage } from "@/types/task";
import { STORAGE_KEYS } from "@/utils/storage";
import { supabase } from "@/utils/supabase";
import {
  buildInsertPayload,
  buildUpdatePayload,
  mapTaskRecordToTask,
} from "@/utils/task-mappers";
import { sortTasks } from "@/utils/task-utils";

const defaultFilters: TaskFilters = {
  query: "",
  status: "all",
  priority: "all",
  tag: "all",
  view: "all",
};

interface AppState {
  tasks: Task[];
  session: Session | null;
  authStatus: "booting" | "signed-out" | "signed-in";
  isTasksLoading: boolean;
  filters: TaskFilters;
  activePage: TaskPage;
  editingTaskId: string | null;
  isTaskDialogOpen: boolean;
  isCommandPaletteOpen: boolean;
  theme: "dark" | "light";
  setSession: (session: Session | null) => void;
  loadTasks: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (
    email: string,
    password: string,
  ) => Promise<{ email: string; needsEmailVerification: boolean }>;
  signOut: () => Promise<void>;
  addTask: (values: TaskFormValues) => Promise<void>;
  updateTask: (taskId: string, values: TaskFormValues) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  toggleTaskCompletion: (taskId: string) => Promise<void>;
  reorderTasks: (
    activeId: string,
    overId: string,
    visibleTaskIds: string[],
  ) => Promise<void>;
  updateFilters: (patch: Partial<TaskFilters>) => void;
  resetFilters: () => void;
  openTaskDialog: (taskId?: string) => void;
  closeTaskDialog: () => void;
  setActivePage: (page: TaskPage) => void;
  setCommandPaletteOpen: (isOpen: boolean) => void;
  setTheme: (theme: "dark" | "light") => void;
}

const getCurrentUserId = (state: AppState) => state.session?.user.id ?? null;

// Zustand is used instead of Redux because the app is modest in scope,
// but still benefits from a single global store shared across the dashboard,
// filters, dialogs, keyboard shortcuts, command palette, auth state, and sync status.
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      tasks: [],
      session: null,
      authStatus: "booting",
      isTasksLoading: false,
      filters: defaultFilters,
      activePage: "dashboard",
      editingTaskId: null,
      isTaskDialogOpen: false,
      isCommandPaletteOpen: false,
      theme: "dark",
      setSession: (session) =>
        set({
          session,
          authStatus: session ? "signed-in" : "signed-out",
          tasks: session ? get().tasks : [],
          editingTaskId: null,
          isTaskDialogOpen: false,
          isCommandPaletteOpen: false,
        }),
      loadTasks: async () => {
        const state = get();
        const userId = getCurrentUserId(state);

        if (!supabase || !userId) {
          set({ tasks: [], isTasksLoading: false });
          return;
        }

        set({ isTasksLoading: true });

        const { data, error } = await supabase
          .from("tasks")
          .select("*")
          .eq("user_id", userId)
          .order("order_index", { ascending: true });

        if (error) {
          set({ isTasksLoading: false });
          throw new Error(error.message);
        }

        set({
          tasks: (data ?? []).map((record) => mapTaskRecordToTask(record)),
          isTasksLoading: false,
        });
      },
      signIn: async (email, password) => {
        if (!supabase) {
          throw new Error("Supabase is not configured yet.");
        }

        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw new Error(error.message);
        }
      },
      signInWithGoogle: async () => {
        if (!supabase) {
          throw new Error("Supabase is not configured yet.");
        }

        // OAuth lets Google own the sensitive password flow while Supabase
        // handles the callback and turns it into a normal session for the app.
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: window.location.origin,
          },
        });

        if (error) {
          throw new Error(error.message);
        }
      },
      signUp: async (email, password) => {
        if (!supabase) {
          throw new Error("Supabase is not configured yet.");
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });

        if (error) {
          throw new Error(error.message);
        }

        if (data.session) {
          set({
            session: data.session,
            authStatus: "signed-in",
          });
        }

        // When email confirmation is enabled, Supabase returns no session yet.
        // Returning this flag lets the UI show a precise next-step message.
        return {
          email,
          needsEmailVerification: !data.session,
        };
      },
      signOut: async () => {
        if (!supabase) {
          throw new Error("Supabase is not configured yet.");
        }

        const { error } = await supabase.auth.signOut();

        if (error) {
          throw new Error(error.message);
        }

        set({
          session: null,
          authStatus: "signed-out",
          tasks: [],
          editingTaskId: null,
          isTaskDialogOpen: false,
          isCommandPaletteOpen: false,
          activePage: "dashboard",
        });
      },
      addTask: async (values) => {
        const state = get();
        const userId = getCurrentUserId(state);

        if (!supabase || !userId) {
          throw new Error("You need to be signed in to create tasks.");
        }

        const nextOrder =
          state.tasks.length === 0
            ? 0
            : Math.min(...state.tasks.map((task) => task.order)) - 1;

        const { data, error } = await supabase
          .from("tasks")
          .insert(buildInsertPayload(userId, values, nextOrder))
          .select("*")
          .single();

        if (error) {
          throw new Error(error.message);
        }

        set((current) => ({
          tasks: [mapTaskRecordToTask(data), ...current.tasks],
          isTaskDialogOpen: false,
          editingTaskId: null,
        }));
      },
      updateTask: async (taskId, values) => {
        const state = get();
        const userId = getCurrentUserId(state);

        if (!supabase || !userId) {
          throw new Error("You need to be signed in to update tasks.");
        }

        const { data, error } = await supabase
          .from("tasks")
          .update(buildUpdatePayload(values))
          .eq("id", taskId)
          .eq("user_id", userId)
          .select("*")
          .single();

        if (error) {
          throw new Error(error.message);
        }

        const updatedTask = mapTaskRecordToTask(data);

        set((current) => ({
          tasks: current.tasks.map((task) =>
            task.id === taskId ? updatedTask : task,
          ),
          isTaskDialogOpen: false,
          editingTaskId: null,
        }));
      },
      deleteTask: async (taskId) => {
        const state = get();
        const userId = getCurrentUserId(state);

        if (!supabase || !userId) {
          throw new Error("You need to be signed in to delete tasks.");
        }

        const { error } = await supabase
          .from("tasks")
          .delete()
          .eq("id", taskId)
          .eq("user_id", userId);

        if (error) {
          throw new Error(error.message);
        }

        set((current) => ({
          tasks: current.tasks.filter((task) => task.id !== taskId),
        }));
      },
      toggleTaskCompletion: async (taskId) => {
        const state = get();
        const userId = getCurrentUserId(state);
        const task = state.tasks.find((item) => item.id === taskId);

        if (!supabase || !userId || !task) {
          throw new Error("The task could not be found.");
        }

        const nextCompleted = !task.completed;

        const { data, error } = await supabase
          .from("tasks")
          .update({
            completed: nextCompleted,
            completed_at: nextCompleted ? new Date().toISOString() : null,
          })
          .eq("id", taskId)
          .eq("user_id", userId)
          .select("*")
          .single();

        if (error) {
          throw new Error(error.message);
        }

        const updatedTask = mapTaskRecordToTask(data);

        set((current) => ({
          tasks: current.tasks.map((item) =>
            item.id === taskId ? updatedTask : item,
          ),
        }));
      },
      reorderTasks: async (activeId, overId, visibleTaskIds) => {
        const state = get();
        const db = supabase;
        const userId = getCurrentUserId(state);

        if (!db || !userId || activeId === overId) {
          return;
        }

        const activeIndex = visibleTaskIds.indexOf(activeId);
        const overIndex = visibleTaskIds.indexOf(overId);

        if (activeIndex < 0 || overIndex < 0) {
          return;
        }

        const nextVisibleIds = [...visibleTaskIds];
        const [moved] = nextVisibleIds.splice(activeIndex, 1);
        nextVisibleIds.splice(overIndex, 0, moved);

        const sortedTasks = sortTasks(state.tasks);
        const visiblePositions = sortedTasks
          .map((task, index) => (nextVisibleIds.includes(task.id) ? index : -1))
          .filter((index) => index >= 0);

        const taskById = new Map(state.tasks.map((task) => [task.id, task]));
        const reorderedVisibleTasks = nextVisibleIds
          .map((id) => taskById.get(id))
          .filter((task): task is Task => Boolean(task));

        const nextSortedTasks = [...sortedTasks];
        visiblePositions.forEach((position, index) => {
          nextSortedTasks[position] = reorderedVisibleTasks[index];
        });

        const nextTasks = state.tasks.map((task) => {
          const nextOrder = nextSortedTasks.findIndex((item) => item.id === task.id);
          return {
            ...task,
            order: nextOrder,
          };
        });

        set({ tasks: nextTasks });

        const updates = await Promise.all(
          nextTasks.map((task) =>
            db
              .from("tasks")
              .update({ order_index: task.order })
              .eq("id", task.id)
              .eq("user_id", userId),
          ),
        );

        const failedUpdate = updates.find((result) => result.error);

        if (failedUpdate?.error) {
          await get().loadTasks();
          throw new Error(failedUpdate.error.message);
        }
      },
      updateFilters: (patch) =>
        set((state) => ({
          filters: {
            ...state.filters,
            ...patch,
          },
        })),
      resetFilters: () =>
        set({
          filters: defaultFilters,
        }),
      openTaskDialog: (taskId) =>
        set({
          editingTaskId: taskId ?? null,
          isTaskDialogOpen: true,
        }),
      closeTaskDialog: () =>
        set({
          editingTaskId: null,
          isTaskDialogOpen: false,
        }),
      setActivePage: (page) => set({ activePage: page }),
      setCommandPaletteOpen: (isOpen) => set({ isCommandPaletteOpen: isOpen }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: STORAGE_KEYS.ui,
      // We still persist small UI preferences like theme locally because they
      // are device-specific. Actual task data now lives in Supabase so each
      // signed-in user gets a synced workspace instead of a browser-only list.
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        activePage: state.activePage,
      }),
    },
  ),
);

export const useEditingTask = () => {
  const tasks = useAppStore((state) => state.tasks);
  const editingTaskId = useAppStore((state) => state.editingTaskId);
  return tasks.find((task) => task.id === editingTaskId) ?? null;
};
