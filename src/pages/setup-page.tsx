import { DatabaseZap, FileCode2, KeyRound } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const SetupPage = () => (
  <div className="relative min-h-screen px-4 py-6 sm:px-6 lg:px-8">
    <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl items-center">
      <Card className="glass-panel-strong w-full">
        <CardHeader>
          <CardTitle className="text-3xl">Connect Supabase to enable multi-user mode</CardTitle>
          <CardDescription className="max-w-3xl text-base">
            The UI is ready for real accounts, but the environment variables are missing. Add the
            Supabase project URL and publishable key, then run the SQL schema to create the `tasks`
            table and security policies.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-[28px] bg-white/5 p-5">
            <KeyRound className="h-5 w-5 text-foreground" />
            <p className="mt-4 font-semibold">1. Add env vars</p>
            <pre className="mt-3 overflow-x-auto rounded-2xl bg-black/70 p-4 text-sm text-white/85">
{`VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...`}
            </pre>
          </div>

          <div className="rounded-[28px] bg-white/5 p-5">
            <DatabaseZap className="h-5 w-5 text-foreground" />
            <p className="mt-4 font-semibold">2. Run the schema</p>
            <p className="mt-3 text-sm text-muted-foreground">
              Open the Supabase SQL editor and run the statements from `supabase/schema.sql`.
            </p>
          </div>

          <div className="rounded-[28px] bg-white/5 p-5">
            <FileCode2 className="h-5 w-5 text-foreground" />
            <p className="mt-4 font-semibold">3. Restart the app</p>
            <p className="mt-3 text-sm text-muted-foreground">
              Restart `npm run dev` so Vite reloads the new environment variables.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);
