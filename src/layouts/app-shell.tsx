import { useState } from "react";
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
import { getBrandLogoSrc } from "@/utils/branding";
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
  isDarkMode: boolean;
  userEmail: string | null;
  onNavigate: (page: TaskPage) => void;
  onSignOut: () => void;
}

const ShortcutKey = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={cn(
      "inline-flex min-w-7 items-center justify-center rounded-xl border border-black/10 bg-black/[0.05] px-2 py-1 text-[11px] font-semibold text-foreground shadow-sm shadow-black/10 dark:border-white/10 dark:bg-white/[0.06] dark:shadow-black/30",
      className,
    )}
  >
    {children}
  </span>
);

const AccountCard = ({
  userEmail,
  onSignOut,
}: Pick<NavigationContentProps, "userEmail" | "onSignOut">) => (
  <div className="rounded-[24px] border border-black/10 bg-white/95 p-4 shadow-lg shadow-black/10 backdrop-blur-xl dark:border-white/10 dark:bg-black/80 dark:shadow-2xl dark:shadow-black/40">
    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
      Signed in as
    </p>
    <p className="mt-2 truncate text-sm font-medium" title={userEmail ?? undefined}>
      {userEmail}
    </p>
    <Button variant="outline" size="sm" className="mt-4 h-10 w-full rounded-[16px]" onClick={onSignOut}>
      <LogOut className="h-4 w-4" />
      Sign out
    </Button>
  </div>
);

const NavigationContent = ({
  activePage,
  isDarkMode,
  userEmail,
  onNavigate,
  onSignOut,
}: NavigationContentProps) => (
  <div className="flex h-full flex-col overflow-y-auto scrollbar-subtle">
    <div className="flex items-center gap-3">
      <img
        src={getBrandLogoSrc(isDarkMode)}
        alt="To Do List logo"
        className="h-11 w-11 rounded-2xl object-cover"
      />
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          To Do List
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
                ? "border border-black/10 bg-black/[0.04] text-foreground shadow-sm shadow-black/5 dark:border-white/10 dark:bg-white/10 dark:shadow-black/30"
                : "text-muted-foreground hover:bg-black/[0.03] hover:text-foreground dark:hover:bg-white/5",
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </button>
        );
      })}
    </div>

    <div className="mt-auto space-y-3 pt-6 shrink-0">
      <div className="hidden lg:block rounded-[28px] border border-black/10 bg-white/95 p-4 shadow-lg shadow-black/10 dark:border-white/10 dark:bg-white/5 dark:shadow-black/30">
        <p className="text-sm font-semibold">Keyboard-first flow</p>
        <div className="mt-4 space-y-3 text-sm text-muted-foreground">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <span>Dashboard</span>
            <ShortcutKey>G</ShortcutKey>
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <span>Tasks</span>
            <ShortcutKey>T</ShortcutKey>
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <span>New task</span>
            <ShortcutKey>N</ShortcutKey>
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
            <span>Command palette</span>
            <ShortcutKey className="min-w-[96px] px-3">Cmd/Ctrl + K</ShortcutKey>
          </div>
        </div>
      </div>

      <AccountCard userEmail={userEmail} onSignOut={onSignOut} />
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
}: AppShellProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigate = (page: TaskPage) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="relative min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1600px] gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="glass-panel-strong surface-outline sticky top-4 hidden h-[calc(100vh-2rem)] self-start overflow-hidden p-6 lg:block">
          <NavigationContent
            activePage={activePage}
            isDarkMode={isDarkMode}
            userEmail={userEmail}
            onNavigate={handleNavigate}
            onSignOut={onSignOut}
          />
        </aside>

        <div className="space-y-4">
          <header className="glass-panel-strong surface-outline sticky top-4 z-30 p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-3">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-2xl lg:hidden">
                      <span className="sr-only">Open navigation</span>
                      <Menu className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="lg:hidden">
                    <NavigationContent
                      activePage={activePage}
                      isDarkMode={isDarkMode}
                      userEmail={userEmail}
                      onNavigate={handleNavigate}
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
              <div className="rounded-full border border-black/10 bg-black/[0.04] px-3 py-2 text-xs text-muted-foreground dark:border-white/10 dark:bg-white/5">
                {isSyncing ? (
                  <span className="inline-flex items-center gap-2">
                    <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                    <span className="hidden sm:inline">Syncing workspace</span>
                    <span className="sm:hidden">Syncing</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span className="hidden sm:inline">Cloud sync active</span>
                    <span className="sm:hidden">Synced</span>
                  </span>
                )}
              </div>

              <Button
                variant="outline"
                className="rounded-2xl"
                onClick={onOpenCommandPalette}
              >
                <Command className="h-4 w-4" />
                <span className="hidden sm:inline">Search commands</span>
                <span className="hidden md:inline rounded-full bg-black/[0.05] px-2 py-1 text-[11px] text-muted-foreground dark:bg-white/10">
                  Cmd/Ctrl + K
                </span>
              </Button>

              <Button variant="outline" size="icon" className="rounded-2xl" onClick={onToggleTheme}>
                <span className="sr-only">Toggle theme</span>
                {isDarkMode ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
              </Button>

              <Button className="rounded-2xl" onClick={onCreateTask}>
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New task</span>
                <span className="sm:hidden">New</span>
              </Button>
            </div>
          </div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  </div>
  );
};
