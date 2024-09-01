"use client";

import { Bar, BarChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { date: "2024-07-15", new: 450, reviewed: 300 },
  { date: "2024-07-16", new: 380, reviewed: 420 },
  { date: "2024-07-17", new: 520, reviewed: 120 },
  { date: "2024-07-18", new: 140, reviewed: 550 },
  { date: "2024-07-19", new: 600, reviewed: 350 },
  { date: "2024-07-20", new: 480, reviewed: 400 },
  { date: "2024-07-21", new: 300, reviewed: 300 },
  { date: "2024-07-22", new: 520, reviewed: 200 },
  { date: "2024-07-23", new: 300, reviewed: 400 },
  { date: "2024-07-24", new: 400, reviewed: 300 },
  { date: "2024-07-25", new: 600, reviewed: 200 },
  { date: "2024-07-26", new: 300, reviewed: 300 },
];

const chartConfig = {
  new: {
    label: "new",
    color: "hsl(var(--chart-1))",
  },
  reviewed: {
    label: "reviewed",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function Component() {
  return (
    <Card className="w-full border-secondary bg-secondary/25 text-primary backdrop-blur-sm">
      <CardHeader className="h-24">
        <CardTitle>You're Study History</CardTitle>
        <CardDescription>
          Perfect! You are meeting your learning goals.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          className="aspect-auto h-80 w-full"
          config={chartConfig}
        >
          <BarChart accessibilityLayer data={chartData}>
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  weekday: "short",
                });
              }}
            />
            <Bar
              dataKey="reviewed"
              stackId="a"
              fill="#52A7E0"
              radius={[0, 0, 8, 8]}
            />
            <Bar
              dataKey="new"
              stackId="a"
              fill="#70EE9C"
              radius={[8, 8, 0, 0]}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              cursor={false}
              defaultIndex={1}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="h-12">
        <div className="flex w-full flex-row justify-between">
          <div className="row flex gap-2">
            <p>🎯 Daily Learning Goal</p>
            <button className="font-bold underline">80 cards</button>
          </div>
          <div className="row flex gap-2">
            <p>🔥 Current Streak: </p>
            <p className="font-bold">5 days</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
