import { motion } from "framer-motion";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMounted } from "@/hooks/use-mounted";

const priorityColors: Record<string, string> = {
  low: "#34d399",
  medium: "#60a5fa",
  high: "#f59e0b",
  urgent: "#f87171",
};

interface PriorityChartProps {
  data: Array<{ priority: string; total: number }>;
}

export const PriorityChart = ({ data }: PriorityChartProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.18, duration: 0.4 }}
  >
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Priority Load</CardTitle>
        <CardDescription>Balance the remaining workload before it becomes noisy.</CardDescription>
      </CardHeader>
      <CardContent className="h-[260px] min-w-0 pt-2">
        <PriorityChartGuard data={data} />
      </CardContent>
    </Card>
  </motion.div>
);

const PriorityChartGuard = ({ data }: PriorityChartProps) => {
  const mounted = useMounted();

  if (!mounted) {
    return <div className="h-full rounded-3xl bg-white/5" />;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis
          dataKey="priority"
          stroke="#94a3b8"
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => value.toUpperCase()}
        />
        <YAxis allowDecimals={false} stroke="#94a3b8" tickLine={false} axisLine={false} width={24} />
        <Tooltip
          cursor={{ fill: "rgba(255,255,255,0.04)" }}
          contentStyle={{
            background: "rgba(15, 23, 42, 0.92)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
          }}
        />
        <Bar dataKey="total" radius={[10, 10, 4, 4]}>
          {data.map((entry) => (
            <Cell key={entry.priority} fill={priorityColors[entry.priority]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
