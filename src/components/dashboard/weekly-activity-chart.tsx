import { motion } from "framer-motion";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMounted } from "@/hooks/use-mounted";

interface WeeklyActivityChartProps {
  data: Array<{ day: string; completed: number }>;
}

export const WeeklyActivityChart = ({ data }: WeeklyActivityChartProps) => (
  <ChartMotionContainer>
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Weekly Momentum</CardTitle>
        <CardDescription>See how consistently tasks are being closed this week.</CardDescription>
      </CardHeader>
      <CardContent className="h-[260px] min-w-0 pt-2">
        <ChartGuard>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="completedGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.65} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
              <XAxis dataKey="day" stroke="#94a3b8" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} stroke="#94a3b8" tickLine={false} axisLine={false} width={24} />
              <Tooltip
                cursor={{ stroke: "rgba(56, 189, 248, 0.2)", strokeWidth: 2 }}
                contentStyle={{
                  background: "rgba(15, 23, 42, 0.92)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "16px",
                }}
              />
              <Area
                type="monotone"
                dataKey="completed"
                stroke="#38bdf8"
                strokeWidth={3}
                fill="url(#completedGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartGuard>
      </CardContent>
    </Card>
  </ChartMotionContainer>
);

const ChartMotionContainer = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.12, duration: 0.4 }}
  >
    {children}
  </motion.div>
);

const ChartGuard = ({ children }: { children: React.ReactNode }) => {
  const mounted = useMounted();

  if (!mounted) {
    return <div className="h-full rounded-3xl bg-white/5" />;
  }

  return <>{children}</>;
};
