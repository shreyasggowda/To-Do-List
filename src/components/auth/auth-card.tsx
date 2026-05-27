import { useState } from "react";
import { LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AuthCardProps {
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
}

export const AuthCard = ({ onSignIn, onSignUp }: AuthCardProps) => {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === "sign-in") {
        await onSignIn(email, password);
      } else {
        await onSignUp(email, password);
      }

      setPassword("");
    } catch (submissionError) {
      const message =
        submissionError instanceof Error
          ? submissionError.message
          : "Something went wrong while contacting Supabase.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="glass-panel-strong w-full max-w-md">
      <CardHeader className="space-y-3">
        <CardTitle className="text-2xl">Access your workspace</CardTitle>
        <CardDescription>
          Sign in to sync tasks across devices, keep every list tied to the right account, and prepare
          the app for real deployment.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <Tabs value={mode} onValueChange={(value) => setMode(value as "sign-in" | "sign-up")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sign-in">Sign in</TabsTrigger>
            <TabsTrigger value="sign-up">Create account</TabsTrigger>
          </TabsList>

          <TabsContent value="sign-in" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Return to your existing workspace from any device.
            </p>
          </TabsContent>

          <TabsContent value="sign-up" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Create a new account so your tasks live in the cloud instead of only in one browser.
            </p>
          </TabsContent>
        </Tabs>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="pl-11"
                placeholder="you@company.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="pl-11"
                placeholder="At least 6 characters"
              />
            </div>
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <Button
            className="w-full rounded-2xl"
            onClick={() => void handleSubmit()}
            disabled={!email || password.length < 6 || isSubmitting}
          >
            {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            {mode === "sign-in" ? "Sign in to FocusFlow" : "Create your FocusFlow account"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
