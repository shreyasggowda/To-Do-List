import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-black/10 bg-black/[0.12] text-foreground dark:border-white/12 dark:bg-white/[0.18]",
        secondary: "border-black/10 bg-black/[0.04] text-foreground dark:border-white/10 dark:bg-white/10",
        success: "border-black/10 bg-black/[0.04] text-black/70 dark:border-white/12 dark:bg-white/[0.1] dark:text-white/80",
        warning: "border-black/10 bg-black/[0.12] text-black/80 dark:border-white/12 dark:bg-white/[0.18] dark:text-white/90",
        destructive: "border-black/10 bg-black/[0.22] text-black dark:border-white/14 dark:bg-white/[0.3] dark:text-white",
        low: "border-black/10 bg-black/[0.14] text-black/80 dark:border-white/10 dark:bg-white/[0.22] dark:text-white/78",
        medium: "border-black/10 bg-black/[0.28] text-black/90 dark:border-white/10 dark:bg-white/[0.42] dark:text-white/88",
        high: "border-black/10 bg-black/[0.42] text-white dark:border-white/12 dark:bg-white/[0.68] dark:text-black/85",
        urgent: "border-black/10 bg-black/[0.88] text-white dark:border-white/14 dark:bg-white/[0.94] dark:text-black",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface BadgeProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export const Badge = ({ className, variant, ...props }: BadgeProps) => (
  <div className={cn(badgeVariants({ variant }), className)} {...props} />
);
