import { motion } from "framer-motion";
import {
  BriefcaseBusiness,
  Command,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Menu,
  MoonStar,
  Plus,
  SunMedium,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { TaskPage } from "@/types/task";
import { cn } from "@/utils/cn";

interface AppShellProps {
  activePage: TaskPage;
  pageTitle: string;
  pageDescription: string;
  isDarkMode: boolean;
  isSyncing: boolean;
  userEmail: string | null;
  onNavigate: (page: TaskPage) => void;
  onCreateTask: () => void;
  onOpenCommandPalette: () => void;
  onToggleTheme: () => void;
  onSignOut: () => void;
  children: React.ReactNode;
}

const navigationItems: Array<{ id: TaskPage; label: string; icon: typeof LayoutDashboard }> = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "tasks", label: "Tasks", icon: BriefcaseBusiness },
];

interface NavigationContentProps {
  activePage: TaskPage;
  userEmail: string | null;
  onNavigate: (page: TaskPage) => void;
  onSignOut: () => void;
}

const NavigationContent = ({
  activePage,
  userEmail,
  onNavigate,
  onSignOut,
}: NavigationContentProps) => (
  <div className="flex h-full flex-col">
    <div className="flex items-center gap-3">
      <div className="rounded-2xl bg-gradient-to-br from-sky-400 via-cyan-300 to-emerald-300 p-2.5 text-slate-950 shadow-lg shadow-cyan-500/20">
        <Command className="h-4 w-4" />
      </div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          FocusFlow
        </p>
        <h1 className="text-lg font-semibold">Productivity Suite</h1>
      </div>
    </div>

    <div className="mt-8 space-y-2">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition",
              isActive
                ? "bg-white/10 text-foreground shadow-sm"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </button>
        );
      })}
    </div>

    <div className="mt-auto space-y-3">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
        <p className="text-sm font-semibold">Signed in as</p>
        <p className="mt-2 break-all text-sm text-muted-foreground">{userEmail}</p>
        <Button variant="outline" className="mt-4 w-full rounded-2xl" onClick={onSignOut}>
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
        <p className="text-sm font-semibold">Keyboard-first flow</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Jump between views with `G` and `T`, create tasks with `N`, and open the command palette with
          `Cmd/Ctrl + K`.
        </p>
      </div>
    </div>
  </div>
);

export const AppShell = ({
  activePage,
  pageTitle,
  pageDescription,
  isDarkMode,
  isSyncing,
  userEmail,
  onNavigate,
  onCreateTask,
  onOpenCommandPalette,
  onToggleTheme,
  onSignOut,
  children,
}: AppShellProps) => (
  <div className="relative min-h-screen px-4 py-4 sm:px-6 lg:px-8">
    <div className="mx-auto grid max-w-[1600px] gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="glass-panel-strong surface-outline hidden min-h-[calc(100vh-2rem)] p-6 lg:block">
        <NavigationContent
          activePage={activePage}
          userEmail={userEmail}
          onNavigate={onNavigate}
          onSignOut={onSignOut}
        />
      </aside>

      <div className="space-y-4">
        <header className="glass-panel-strong surface-outline sticky top-4 z-30 p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-2xl lg:hidden">
                    <span className="sr-only">Open navigation</span>
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="lg:hidden">
                  <NavigationContent
                    activePage={activePage}
                    userEmail={userEmail}
                    onNavigate={onNavigate}
                    onSignOut={onSignOut}
                  />
                </SheetContent>
              </Sheet>

              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Workspace</p>
                <motion.h2
                  key={pageTitle}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl"
                >
                  {pageTitle}
                </motion.h2>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{pageDescription}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-muted-foreground">
                {isSyncing ? (
                  <span className="inline-flex items-center gap-2">
                    <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                    Syncing workspace
                  </span>
                ) : (
                  "Cloud sync active"
                )}
              </div>

              <Button
                variant="outline"
                className="rounded-2xl"
                onClick={onOpenCommandPalette}
              >
                <Command className="h-4 w-4" />
                Search commands
                <span className="rounded-full bg-white/10 px-2 py-1 text-[11px] text-muted-foreground">
                  Cmd/Ctrl + K
                </span>
              </Button>

              <Button variant="outline" size="icon" className="rounded-2xl" onClick={onToggleTheme}>
                <span className="sr-only">Toggle theme</span>
                {isDarkMode ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
              </Button>

              <Button className="rounded-2xl" onClick={onCreateTask}>
                <Plus className="h-4 w-4" />
                New task
              </Button>
            </div>
          </div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  </div>
);
