import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  index: number;
}

export const StatCard = ({ label, value, icon: Icon, index }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.06, duration: 0.35 }}
  >
    <Card className="overflow-hidden">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2.5">
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm text-muted-foreground truncate" title={label}>{label}</p>
            <p className="mt-1 sm:mt-2 text-xl sm:text-3xl font-bold tracking-tight truncate">{value}</p>
          </div>
          <div className="shrink-0 rounded-xl sm:rounded-2xl border border-black/10 bg-black/[0.04] p-2.5 sm:p-3 text-foreground dark:border-white/10 dark:bg-white/10">
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);
