import { motion } from "framer-motion";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface WeeklyActivityChartProps {
  data: Array<{ day: string; completed: number }>;
}

export const WeeklyActivityChart = ({ data }: WeeklyActivityChartProps) => (
  <ChartMotionContainer>
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Weekly Momentum</CardTitle>
        <CardDescription>Tasks completed this week.</CardDescription>
      </CardHeader>
      <CardContent className="h-[260px] min-w-0 pt-2">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="completedGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-area-line)" stopOpacity={1} />
                <stop offset="95%" stopColor="var(--chart-area-line)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
            <XAxis dataKey="day" stroke="var(--chart-axis)" tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} stroke="var(--chart-axis)" tickLine={false} axisLine={false} width={24} />
            <Tooltip
              cursor={{ stroke: "var(--chart-grid)", strokeWidth: 2 }}
              contentStyle={{
                background: "var(--chart-tooltip-bg)",
                border: "1px solid var(--chart-tooltip-border)",
                borderRadius: "16px",
              }}
            />
            <Area
              type="monotone"
              dataKey="completed"
              stroke="var(--chart-area-line)"
              strokeWidth={3}
              fill="url(#completedGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
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

