"use client";

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

interface DashboardMetricCardProps {
    title: string;
    year: string;
    value: string | number;
    subtitle?: string;
    subtitleColor?: "green" | "red" | "muted";
    className?: string;
    chartData: { month: string; value: number }[];
    chartConfig?: ChartConfig;
}

export function DashboardMetricCard({
    title,
    year,
    value,
    subtitle,
    subtitleColor = "muted",
    className,
    chartData,
    chartConfig = {
        dataKey: "value",
        color: "var(--chart-1)",
        label: "Metric",
    },
}: DashboardMetricCardProps) {
    const colorMap = {
        green: "text-green-600 dark:text-green-400",
        red: "text-red-600 dark:text-red-400",
        muted: "text-muted-foreground",
    };

    return (
        <Card
            className={cn(
                "rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-background/70 backdrop-blur-md shadow-sm hover:shadow-md transition-all",
                className
            )}
        >
            <CardHeader>
                <CardTitle className="text-xl font-semibold text-black flex flex-row justify-between">
                   <span className="tracking-wider">{title}</span>
                    <span className="text-muted-foreground font-medium text-sm">{year}</span>
                </CardTitle>

            </CardHeader>

            <CardContent className="mt-[-2%] flex flex-row items-center justify-between gap-4">
                <div className="flex flex-col flex-shrink">
                    <span className="text-3xl font-bold tracking-tight">{value}</span>
                    {subtitle && (
                        <CardDescription
                            className={cn("text-sm mt-1", colorMap[subtitleColor])}
                        >
                            {subtitle}
                        </CardDescription>
                    )}
                </div>

                {/* Chart */}
                <ChartContainer config={chartConfig} className="w-[60%] h-auto">
                    <LineChart
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Line
                            dataKey={chartConfig.dataKey}
                            type="natural"
                            stroke={chartConfig.color}
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
