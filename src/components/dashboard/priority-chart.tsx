import { motion } from "framer-motion";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMounted } from "@/hooks/use-mounted";

const priorityColors: Record<string, string> = {
  low: "var(--chart-bar-low)",
  medium: "var(--chart-bar-medium)",
  high: "var(--chart-bar-high)",
  urgent: "var(--chart-bar-urgent)",
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
        <CardDescription>Tasks grouped by priority.</CardDescription>
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
    return <div className="h-full rounded-3xl bg-black/[0.04] dark:bg-white/5" />;
  }

  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
      <BarChart data={data}>
        <XAxis
          dataKey="priority"
          stroke="var(--chart-axis)"
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => value.toUpperCase()}
        />
        <YAxis allowDecimals={false} stroke="var(--chart-axis)" tickLine={false} axisLine={false} width={24} />
        <Tooltip
          cursor={{ fill: "var(--chart-grid)" }}
          contentStyle={{
            background: "var(--chart-tooltip-bg)",
            border: "1px solid var(--chart-tooltip-border)",
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
