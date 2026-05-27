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
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-black/[0.04] p-3 text-foreground dark:border-white/10 dark:bg-white/10">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);
