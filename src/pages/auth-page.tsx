import { Cloud, ShieldCheck, Sparkles, SunMoon } from "lucide-react";
import { AuthCard } from "@/components/auth/auth-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AuthPageProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
}

export const AuthPage = ({
  isDarkMode,
  onToggleTheme,
  onSignIn,
  onSignUp,
}: AuthPageProps) => (
  <div className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
    <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col justify-between gap-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">FocusFlow</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Premium productivity for real accounts</h1>
        </div>

        <Button variant="outline" size="icon" className="rounded-2xl" onClick={onToggleTheme}>
          <span className="sr-only">Toggle theme</span>
          <SunMoon className={`h-4 w-4 ${isDarkMode ? "text-amber-200" : "text-slate-700"}`} />
        </Button>
      </div>

      <div className="grid flex-1 items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <Badge variant="secondary" className="border border-white/10 bg-white/10">
            Multi-user upgrade
          </Badge>
          <div className="space-y-4">
            <h2 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Deployable task management with cloud sync, secure access, and a premium interface.
            </h2>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              This version uses Supabase authentication and a shared Postgres database so each user gets
              a private synced workspace instead of a browser-local task list.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="glass-panel surface-outline rounded-[28px] p-5">
              <Cloud className="h-5 w-5 text-primary" />
              <p className="mt-4 font-semibold">Cloud-backed tasks</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Tasks live in a hosted database so refreshes and device switches no longer lose data.
              </p>
            </div>
            <div className="glass-panel surface-outline rounded-[28px] p-5">
              <ShieldCheck className="h-5 w-5 text-emerald-300" />
              <p className="mt-4 font-semibold">Per-user privacy</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Row-level security ensures every user only sees their own records.
              </p>
            </div>
            <div className="glass-panel surface-outline rounded-[28px] p-5">
              <Sparkles className="h-5 w-5 text-sky-300" />
              <p className="mt-4 font-semibold">Production-ready path</p>
              <p className="mt-2 text-sm text-muted-foreground">
                The same architecture can be deployed to Vercel and grown into collaboration later.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <AuthCard onSignIn={onSignIn} onSignUp={onSignUp} />
        </div>
      </div>
    </div>
  </div>
);
