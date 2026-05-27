import { useState } from "react";
import { CheckCheck, Command, ListTodo, SunMoon } from "lucide-react";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getBrandLogoSrc } from "@/utils/branding";

interface AuthPageProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
  onSignInWithGoogle: () => Promise<void>;
}

type AuthModalMode = "sign-in" | "sign-up" | null;

export const AuthPage = ({
  isDarkMode,
  onToggleTheme,
  onSignIn,
  onSignUp,
  onSignInWithGoogle,
}: AuthPageProps) => {
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>(null);

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col gap-10">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={getBrandLogoSrc(isDarkMode)}
              alt="To Do List logo"
              className="h-12 w-12 rounded-2xl object-cover"
            />
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">To Do List</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">Productivity that stays out of your way</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="rounded-2xl" onClick={onToggleTheme}>
              <span className="sr-only">Toggle theme</span>
              <SunMoon className="h-4 w-4 text-foreground" />
            </Button>
            <Button variant="outline" className="rounded-2xl" onClick={() => setAuthModalMode("sign-in")}>
              Sign in
            </Button>
            <Button className="rounded-2xl" onClick={() => setAuthModalMode("sign-up")}>
              Create account
            </Button>
          </div>
        </header>

        <main className="grid flex-1 items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="space-y-8">
            <div className="space-y-5">
              <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Focus without clutter</p>
              <h2 className="max-w-4xl text-5xl font-semibold tracking-tight sm:text-6xl">
                Plan the day, finish the work, and keep every task synced.
              </h2>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                To Do List gives you a calm task board, a useful dashboard, and account-based sync so your
                work follows you across devices without turning into a noisy project manager.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="glass-panel surface-outline rounded-[28px] p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-black/10 bg-black/[0.05] dark:border-white/10 dark:bg-white/10">
                  <ListTodo className="h-5 w-5 text-foreground" />
                </div>
                <p className="mt-4 font-semibold">Structured task board</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Capture, organize, and reprioritize work quickly without adding visual noise.
                </p>
              </div>

              <div className="glass-panel surface-outline rounded-[28px] p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-black/10 bg-black/[0.05] dark:border-white/10 dark:bg-white/10">
                  <CheckCheck className="h-5 w-5 text-foreground" />
                </div>
                <p className="mt-4 font-semibold">Cloud-backed progress</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Your tasks are stored per account, so refreshes and device changes never reset the work.
                </p>
              </div>

              <div className="glass-panel surface-outline rounded-[28px] p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-black/10 bg-black/[0.05] dark:border-white/10 dark:bg-white/10">
                  <Command className="h-5 w-5 text-foreground" />
                </div>
                <p className="mt-4 font-semibold">Keyboard-first flow</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Move faster with command palette access, quick capture, and lightweight navigation.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="glass-panel-strong surface-outline rounded-[32px] p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Inside the workspace</p>
              <div className="mt-5 space-y-4">
                <div className="rounded-[26px] border border-black/10 bg-black/[0.03] p-5 dark:border-white/10 dark:bg-white/[0.04]">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">Today’s focus</p>
                    <span className="rounded-full border border-black/10 bg-black/[0.05] px-3 py-1 text-xs text-muted-foreground dark:border-white/10 dark:bg-white/[0.1]">
                      3 tasks
                    </span>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="rounded-2xl border border-black/10 bg-white/90 px-4 py-3 dark:border-white/10 dark:bg-black/60">
                      Finalize portfolio case study
                    </div>
                    <div className="rounded-2xl border border-black/10 bg-white/90 px-4 py-3 dark:border-white/10 dark:bg-black/60">
                      Prepare interview notes
                    </div>
                    <div className="rounded-2xl border border-black/10 bg-white/90 px-4 py-3 dark:border-white/10 dark:bg-black/60">
                      Review next sprint tasks
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[26px] border border-black/10 bg-black/[0.03] p-5 dark:border-white/10 dark:bg-white/[0.04]">
                    <p className="text-sm text-muted-foreground">Completion</p>
                    <p className="mt-2 text-3xl font-semibold">78%</p>
                    <div className="mt-4 h-2.5 rounded-full bg-black/10 dark:bg-white/10">
                      <div className="h-2.5 w-[78%] rounded-full bg-black dark:bg-white" />
                    </div>
                  </div>

                  <div className="rounded-[26px] border border-black/10 bg-black/[0.03] p-5 dark:border-white/10 dark:bg-white/[0.04]">
                    <p className="text-sm text-muted-foreground">Streak</p>
                    <p className="mt-2 text-3xl font-semibold">12 days</p>
                    <p className="mt-4 text-sm text-muted-foreground">Consistent progress without overcomplicating the workflow.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <Dialog open={authModalMode !== null} onOpenChange={(open) => (!open ? setAuthModalMode(null) : null)}>
        <DialogContent className="max-w-md overflow-hidden p-0">
          <AuthCard
            className="max-w-none border-0 bg-transparent shadow-none"
            initialMode={authModalMode ?? "sign-in"}
            onSignIn={onSignIn}
            onSignUp={onSignUp}
            onSignInWithGoogle={onSignInWithGoogle}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
