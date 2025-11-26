"use client"

import * as React from "react"
import {
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    ResponsiveContainer,
} from "recharts"

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

type TrendAreaChartProps = {
    data?: { label: string; value: number; count?: number }[]
    loading?: boolean
    title?: string
}

export default function TrendAreaChart({
                                           data = [],
                                           loading = false,
                                           title = "Sustainability Trend",
                                       }: TrendAreaChartProps) {
    const [metric, setMetric] = React.useState<"value" | "count">("value")

    const metricLabel =
        metric === "value" ? "Daily Spend (₱)" : "Daily Activity (#)"

    // Loading state
    if (loading) {
        return (
            <Card className="h-full w-full">
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-56 w-full rounded-lg" />
                </CardContent>
            </Card>
        )
    }

    // Empty state
    if (!data || data.length === 0) {
        return (
            <Card className="h-full w-full">
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-40 text-sm text-muted-foreground">
                    Not enough data yet — start adding expenses to see analytics.
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full h-full flex flex-col p-4 sm:p-6 gap-4">
            {/* HEADER */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <CardTitle className="text-lg font-semibold">{title}</CardTitle>

                {/* Toggle buttons */}
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant={metric === "value" ? "default" : "outline"}
                        onClick={() => setMetric("value")}
                        className="transition-colors"
                    >
                        Spend (₱)
                    </Button>

                    <Button
                        size="sm"
                        variant={metric === "count" ? "default" : "outline"}
                        onClick={() => setMetric("count")}
                        className="transition-colors"
                    >
                        Frequency (#)
                    </Button>
                </div>
            </div>

            {/* CHART */}
            <div className="flex-1 min-h-[240px] w-full">
                <ChartContainer
                    config={{
                        data: {
                            label: metricLabel,
                            color: "var(--chart-1)",
                        },
                    }}
                    className="w-full h-full"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data}
                            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="fillArea" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="5%"
                                        stopColor="var(--color-data)"
                                        stopOpacity={0.7}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="var(--color-data)"
                                        stopOpacity={0.05}
                                    />
                                </linearGradient>
                            </defs>

                            <CartesianGrid vertical={false} strokeDasharray="4 4" opacity={0.4} />

                            <XAxis
                                dataKey="label"
                                tickLine={false}
                                axisLine={false}
                                minTickGap={20}
                                interval="preserveStartEnd"
                                tickMargin={10}
                                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                            />

                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        indicator="dot"
                                        labelFormatter={(lbl) => `Date: ${lbl}`}
                                        valueFormatter={(val) =>
                                            metric === "value"
                                                ? `₱${val.toLocaleString()}`
                                                : `${val} entries`
                                        }
                                    />
                                }
                            />

                            <Area
                                type="monotone"
                                dataKey={metric}
                                fill="url(#fillArea)"
                                stroke="var(--color-data)"
                                strokeWidth={2}
                                animationDuration={500}
                                animationEasing="ease-out"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </div>
        </Card>
    )
}
