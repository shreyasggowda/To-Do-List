import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// shadcn/ui components commonly pair clsx and tailwind-merge so conditional
// classes stay ergonomic while conflicting Tailwind utilities are deduplicated.
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
