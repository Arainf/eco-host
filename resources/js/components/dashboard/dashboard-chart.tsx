"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

// ✅ Dummy CO₂ data in kilograms per day
const chartData = [
    { date: "2024-06-01", energy: 12.4, transport: 8.9 },
    { date: "2024-06-02", energy: 10.2, transport: 7.5 },
    { date: "2024-06-03", energy: 14.8, transport: 9.7 },
    { date: "2024-06-04", energy: 11.3, transport: 6.8 },
    { date: "2024-06-05", energy: 15.6, transport: 10.1 },
    { date: "2024-06-06", energy: 13.9, transport: 9.0 },
    { date: "2024-06-07", energy: 9.8, transport: 6.1 },
];

const chartConfig = {
    views: {
        label: "CO₂ Overview",
    },
    energy: {
        label: "Energy Emissions (kg)",
        color: "var(--chart-1)",
    },
    transport: {
        label: "Transport Emissions (kg)",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig;

export function DashboardChart() {
    const [activeChart, setActiveChart] =
        React.useState<keyof typeof chartConfig>("energy");

    const total = React.useMemo(
        () => ({
            energy: chartData.reduce((acc, curr) => acc + curr.energy, 0),
            transport: chartData.reduce((acc, curr) => acc + curr.transport, 0),
        }),
        []
    );

    return (
        <Card className="flex flex-col h-full">
            <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
                    <CardTitle>CO₂ Emissions Overview</CardTitle>
                    <CardDescription>
                        Daily breakdown of energy vs. transport emissions
                    </CardDescription>
                </div>
                <div className="flex">
                    {["energy", "transport"].map((key) => {
                        const chart = key as keyof typeof chartConfig;
                        return (
                            <button
                                key={chart}
                                data-active={activeChart === chart}
                                className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6 transition-colors"
                                onClick={() => setActiveChart(chart)}
                            >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
                                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {total[key as keyof typeof total].toFixed(1)} kg
                </span>
                            </button>
                        );
                    })}
                </div>
            </CardHeader>

            <CardContent className="flex-1 flex px-2 sm:p-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-full w-full"
                >
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                });
                            }}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px]"
                                    nameKey="views"
                                    labelFormatter={(value) =>
                                        new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })
                                    }
                                />
                            }
                        />
                        <Bar
                            dataKey={activeChart}
                            fill={`var(--color-${activeChart})`}
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
