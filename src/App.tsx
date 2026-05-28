import { startTransition, useDeferredValue, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import { AppCommandPalette } from "@/components/app-command-palette";
import { TaskDialog } from "@/components/tasks/task-dialog";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useThemeSync } from "@/hooks/use-theme-sync";
import { AppShell } from "@/layouts/app-shell";
import { AuthPage } from "@/pages/auth-page";
import { DashboardPage } from "@/pages/dashboard-page";
import { SetupPage } from "@/pages/setup-page";
import { TasksPage } from "@/pages/tasks-page";
import { useAppStore, useEditingTask } from "@/store/use-app-store";
import type { TaskPage } from "@/types/task";
import { getBrandLogoSrc } from "@/utils/branding";
import { isSupabaseConfigured, supabase } from "@/utils/supabase";
import {
  filterTasks,
  getDashboardStats,
  getPriorityChartData,
  getUniqueTags,
  getWeeklyCompletionData,
} from "@/utils/task-utils";

const pageMeta: Record<
  TaskPage,
  {
    title: string;
    description: string;
  }
> = {
  dashboard: {
    title: "Productivity dashboard",
    description: "A premium overview of progress, focus, and momentum across your tasks.",
  },
  tasks: {
    title: "Task board",
    description: "Capture, prioritize, and organize work with fast interactions and durable structure.",
  },
};

const getToasterOptions = (theme: "light" | "dark") => ({
  classNames: {
    // Sonner toasts render in a portal, so explicit theme branches are more
    // reliable than dark: utilities for keeping contrast correct.
    toast:
      theme === "dark"
        ? "!border-white/10 !bg-black/94 !text-white !shadow-[0_24px_50px_rgba(0,0,0,0.45)]"
        : "!border-black/10 !bg-white/95 !text-black !shadow-[0_18px_40px_rgba(0,0,0,0.14)]",
    title: theme === "dark" ? "!text-white" : "!text-black",
    description: theme === "dark" ? "!text-white/70" : "!text-black/60",
  },
});

const App = () => {
  const tasks = useAppStore((state) => state.tasks);
  const session = useAppStore((state) => state.session);
  const authStatus = useAppStore((state) => state.authStatus);
  const isTasksLoading = useAppStore((state) => state.isTasksLoading);
  const filters = useAppStore((state) => state.filters);
  const activePage = useAppStore((state) => state.activePage);
  const isTaskDialogOpen = useAppStore((state) => state.isTaskDialogOpen);
  const isCommandPaletteOpen = useAppStore((state) => state.isCommandPaletteOpen);
  const theme = useAppStore((state) => state.theme);
  const setSession = useAppStore((state) => state.setSession);
  const loadTasks = useAppStore((state) => state.loadTasks);
  const signIn = useAppStore((state) => state.signIn);
  const signInWithGoogle = useAppStore((state) => state.signInWithGoogle);
  const signUp = useAppStore((state) => state.signUp);
  const signOut = useAppStore((state) => state.signOut);
  const addTask = useAppStore((state) => state.addTask);
  const updateTask = useAppStore((state) => state.updateTask);
  const deleteTask = useAppStore((state) => state.deleteTask);
  const toggleTaskCompletion = useAppStore((state) => state.toggleTaskCompletion);
  const reorderTasks = useAppStore((state) => state.reorderTasks);
  const updateFilters = useAppStore((state) => state.updateFilters);
  const resetFilters = useAppStore((state) => state.resetFilters);
  const openTaskDialog = useAppStore((state) => state.openTaskDialog);
  const closeTaskDialog = useAppStore((state) => state.closeTaskDialog);
  const setActivePage = useAppStore((state) => state.setActivePage);
  const setCommandPaletteOpen = useAppStore((state) => state.setCommandPaletteOpen);
  const setTheme = useAppStore((state) => state.setTheme);
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  const editingTask = useEditingTask();

  useThemeSync(theme);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const authClient = supabase;
    let isMounted = true;

    // Supabase persists the auth session for us, so the app boots by reading
    // the current session and then subscribing to future auth changes.
    const bootstrapSession = async () => {
      const { data, error } = await authClient.auth.getSession();

      if (!isMounted) {
        return;
      }

      if (error) {
        toast.error(error.message);
        setSession(null);
        return;
      }

      setSession(data.session);

      if (data.session) {
        try {
          await loadTasks();
        } catch (loadError) {
          const message =
            loadError instanceof Error
              ? loadError.message
              : "Unable to load your tasks.";
          toast.error(message);
        }
      }
    };

    void bootstrapSession();

    const {
      data: { subscription },
    } = authClient.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);

      if (nextSession) {
        void loadTasks().catch((loadError) => {
          const message =
            loadError instanceof Error
              ? loadError.message
              : "Unable to refresh your tasks.";
          toast.error(message);
        });
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [loadTasks, setSession]);

  const deferredQuery = useDeferredValue(filters.query);
  const filteredTasks = filterTasks(tasks, { ...filters, query: deferredQuery });
  const stats = getDashboardStats(tasks);
  const availableTags = getUniqueTags(tasks);
  const weeklyCompletionData = getWeeklyCompletionData(tasks);
  const priorityChartData = getPriorityChartData(tasks);

  const navigateTo = (page: TaskPage) => {
    startTransition(() => {
      setActivePage(page);
      setCommandPaletteOpen(false);
    });
  };

  useKeyboardShortcuts({
    onOpenCommandPalette: () => setCommandPaletteOpen(true),
    onCreateTask: () => openTaskDialog(),
    onGoToDashboard: () => navigateTo("dashboard"),
    onGoToTasks: () => navigateTo("tasks"),
    onToggleTheme: toggleTheme,
  });

  if (!isSupabaseConfigured) {
    return (
      <>
        <SetupPage />
        <Toaster theme={theme} position="top-right" toastOptions={getToasterOptions(theme)} />
      </>
    );
  }

  if (authStatus === "booting") {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="glass-panel-strong surface-outline rounded-[32px] px-8 py-10 text-center">
          <div className="flex justify-center">
            <img
              src={getBrandLogoSrc(theme === "dark")}
              alt="To Do List logo"
              className="h-12 w-12 rounded-2xl object-cover"
            />
          </div>
          <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">To Do List</p>
          <h2 className="mt-3 text-2xl font-semibold">Loading your workspace</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Reconnecting to the account session and restoring cloud data.
          </p>
        </div>
        <Toaster theme={theme} position="top-right" toastOptions={getToasterOptions(theme)} />
      </div>
    );
  }

  if (!session) {
    return (
      <>
        <AuthPage
          isDarkMode={theme === "dark"}
          onToggleTheme={toggleTheme}
          onSignInWithGoogle={async () => {
            await signInWithGoogle();
          }}
          onSignIn={async (email, password) => {
            await signIn(email, password);
            toast.success("Welcome back");
          }}
          onSignUp={async (email, password) => {
            const result = await signUp(email, password);
            toast.success(
              result.needsEmailVerification
                ? `Verification email sent to ${result.email}. Open it to activate your account.`
                : `Account created for ${result.email}. You can start using your workspace now.`,
            );
          }}
        />
        <Toaster theme={theme} position="top-right" toastOptions={getToasterOptions(theme)} />
      </>
    );
  }

  // App-level orchestration lives here so page components can stay focused on
  // layout and presentation instead of persistence, toasts, or keyboard logic.
  return (
    <>
      <AppShell
        activePage={activePage}
        pageTitle={pageMeta[activePage].title}
        pageDescription={pageMeta[activePage].description}
        isDarkMode={theme === "dark"}
        isSyncing={isTasksLoading}
        userEmail={session.user.email ?? null}
        onNavigate={navigateTo}
        onCreateTask={() => openTaskDialog()}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onToggleTheme={toggleTheme}
        onSignOut={() => {
          void signOut()
            .then(() => toast.success("Signed out"))
            .catch((error: unknown) => {
              const message =
                error instanceof Error ? error.message : "Unable to sign out right now.";
              toast.error(message);
            });
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {activePage === "dashboard" ? (
              <DashboardPage
                stats={stats}
                weeklyCompletionData={weeklyCompletionData}
                priorityChartData={priorityChartData}
              />
            ) : (
              <TasksPage
                tasks={filteredTasks}
                filters={filters}
                availableTags={availableTags}
                isLoading={isTasksLoading}
                onFiltersChange={updateFilters}
                onResetFilters={resetFilters}
                onToggleTask={(taskId) => {
                  const task = tasks.find((item) => item.id === taskId);
                  void toggleTaskCompletion(taskId)
                    .then(() =>
                      toast.success(task?.completed ? "Task moved back to active" : "Task completed"),
                    )
                    .catch((error: unknown) => {
                      const message =
                        error instanceof Error
                          ? error.message
                          : "Unable to update the task right now.";
                      toast.error(message);
                    });
                }}
                onEditTask={(taskId) => openTaskDialog(taskId)}
                onDeleteTask={(taskId) => {
                  void deleteTask(taskId)
                    .then(() => toast.success("Task deleted"))
                    .catch((error: unknown) => {
                      const message =
                        error instanceof Error
                          ? error.message
                          : "Unable to delete the task right now.";
                      toast.error(message);
                    });
                }}
                onReorder={(activeId, overId, visibleTaskIds) => {
                  void reorderTasks(activeId, overId, visibleTaskIds)
                    .then(() => toast.success("Task order updated"))
                    .catch((error: unknown) => {
                      const message =
                        error instanceof Error
                          ? error.message
                          : "Unable to save the new order right now.";
                      toast.error(message);
                    });
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </AppShell>

      <TaskDialog
        isOpen={isTaskDialogOpen}
        task={editingTask}
        onClose={closeTaskDialog}
        onCreate={async (values) => {
          await addTask(values);
          toast.success("Task created");
        }}
        onUpdate={async (taskId, values) => {
          await updateTask(taskId, values);
          toast.success("Task updated");
        }}
      />

      <AppCommandPalette
        open={isCommandPaletteOpen}
        isDarkMode={theme === "dark"}
        onOpenChange={setCommandPaletteOpen}
        onCreateTask={() => {
          setCommandPaletteOpen(false);
          openTaskDialog();
        }}
        onGoToDashboard={() => navigateTo("dashboard")}
        onGoToTasks={() => navigateTo("tasks")}
        onToggleTheme={toggleTheme}
        onSignOut={() => {
          setCommandPaletteOpen(false);
          void signOut()
            .then(() => toast.success("Signed out"))
            .catch((error: unknown) => {
              const message =
                error instanceof Error ? error.message : "Unable to sign out right now.";
              toast.error(message);
            });
        }}
      />

      <Toaster theme={theme} position="top-right" toastOptions={getToasterOptions(theme)} />
    </>
  );
};

export default App;
