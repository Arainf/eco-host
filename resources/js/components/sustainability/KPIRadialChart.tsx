"use client"

import React, { useMemo } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from "recharts"

type KPIRadialChartProps = {
    goals?: any[]
    categories?: any[]      // MUST BE an array
    loading?: boolean
}

export default function KPIRadialChart({
                                           goals = [],
                                           categories = [],
                                           loading = false,
                                       }: KPIRadialChartProps) {

    // 🔒 ENSURE categories is ALWAYS AN ARRAY
    const safeCategories = Array.isArray(categories) ? categories : []

    // 🔒 ENSURE goals is ALWAYS AN ARRAY
    const safeGoals = Array.isArray(goals) ? goals : []

    // ---- Build KPI values safely ----
    const chartData = useMemo(() => {
        if (!safeCategories.length || !safeGoals.length) return []

        return safeGoals.map((goal) => {
            const cat = safeCategories.find((c) => c.name === goal.category)
            const pct = goal.current_pct && goal.target_pct
                ? Math.min(100, Math.round((goal.current_pct / goal.target_pct) * 100))
                : 0

            return {
                name: goal.category,
                progress: pct,
                fill: cat?.color || "#4caf50",
            }
        })
    }, [safeGoals, safeCategories])

    // ---- Loading State ----
    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Performance Indicators (KPIs)</CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-48 w-full rounded" />
                </CardContent>
            </Card>
        )
    }

    // ---- Empty State ----
    if (!chartData.length) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Performance Indicators (KPIs)</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-neutral-500">
                        No KPI data yet — add sustainability goals to get started.
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="p-4">
            <CardHeader>
                <CardTitle>Performance Indicators (KPIs)</CardTitle>
            </CardHeader>

            <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                        innerRadius="20%"
                        outerRadius="90%"
                        data={chartData}
                        startAngle={90}
                        endAngle={-270}
                    >
                        <Tooltip
                            formatter={(v: any, _: any, p: any) =>
                                [`${v}%`, p.payload.name]
                            }
                        />
                        <RadialBar
                            minAngle={10}
                            background={{ fill: "#eee" }}
                            dataKey="progress"
                            cornerRadius={5}
                        />
                    </RadialBarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
