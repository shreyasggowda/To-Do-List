import { useEffect, useState } from "react";
import { Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/utils/cn";

interface AuthCardProps {
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
  onSignInWithGoogle: () => Promise<void>;
  className?: string;
  initialMode?: "sign-in" | "sign-up";
}

const GoogleIcon = () => (
  <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24">
    <path
      d="M21.805 12.23c0-.79-.067-1.364-.211-1.961H12.2v3.575h5.514c-.111.888-.709 2.225-2.039 3.123l-.019.12 2.91 2.208.201.02c1.85-1.673 2.938-4.134 2.938-7.085Z"
      fill="#4285F4"
    />
    <path
      d="M12.2 21.75c2.7 0 4.971-.868 6.628-2.364l-3.092-2.348c-.83.565-1.948.96-3.536.96-2.644 0-4.887-1.71-5.683-4.073l-.116.01-3.025 2.294-.04.108C5.981 19.565 8.832 21.75 12.2 21.75Z"
      fill="#34A853"
    />
    <path
      d="M6.517 13.925A5.903 5.903 0 0 1 6.183 12c0-.67.122-1.318.323-1.925l-.006-.128-3.064-2.33-.1.046A9.667 9.667 0 0 0 2.3 12c0 1.561.379 3.038 1.036 4.337l3.181-2.412Z"
      fill="#FBBC05"
    />
    <path
      d="M12.2 5.999c2.003 0 3.355.855 4.129 1.57l3.014-2.885C17.161 2.7 14.9 1.5 12.2 1.5 8.832 1.5 5.981 3.685 3.336 7.663L6.505 10.12c.806-2.364 3.05-4.121 5.695-4.121Z"
      fill="#EB4335"
    />
  </svg>
);

export const AuthCard = ({
  onSignIn,
  onSignUp,
  onSignInWithGoogle,
  className,
  initialMode = "sign-in",
}: AuthCardProps) => {
  const [mode, setMode] = useState<"sign-in" | "sign-up">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isCreatingAccount = mode === "sign-up";
  const passwordsMatch = !isCreatingAccount || confirmPassword === password;

  useEffect(() => {
    setMode(initialMode);
    setError(null);
  }, [initialMode]);

  const handleSubmit = async () => {
    setError(null);

    if (isCreatingAccount && !passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (!isCreatingAccount) {
        await onSignIn(email, password);
      } else {
        await onSignUp(email, password);
      }

      setPassword("");
      setConfirmPassword("");
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

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      await onSignInWithGoogle();
    } catch (submissionError) {
      const message =
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to start Google sign-in right now.";
      setError(message);
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={cn("glass-panel-strong w-full max-w-md", className)}>
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
          <Button
            variant="outline"
            className="w-full rounded-2xl"
            onClick={() => void handleGoogleSignIn()}
            disabled={isSubmitting}
          >
            <GoogleIcon />
            Continue with Google
          </Button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
            <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
          </div>

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
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="pl-11 pr-12"
                placeholder="At least 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-muted-foreground transition hover:bg-white/10 hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {isCreatingAccount ? (
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm password</label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="pl-11 pr-12"
                  placeholder="Re-enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-muted-foreground transition hover:bg-white/10 hover:text-foreground"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ) : null}

          {error ? (
            <div className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-foreground">
              {error}
            </div>
          ) : null}

          <Button
            className="w-full rounded-2xl"
            onClick={() => void handleSubmit()}
            disabled={
              !email ||
              password.length < 6 ||
              (isCreatingAccount && (!confirmPassword || !passwordsMatch)) ||
              isSubmitting
            }
          >
            {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            {isCreatingAccount ? "Create your To Do List account" : "Sign in to To Do List"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
