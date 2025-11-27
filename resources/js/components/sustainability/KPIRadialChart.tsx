"use client"

import {
    RadialBarChart,
    RadialBar,
    PolarRadiusAxis,
    Label,
    ResponsiveContainer,
} from "recharts"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function KPIRadialStacked({
                                             goals = [],
                                             expenses = [],
                                             loading = false,
                                         }) {
    if (loading) {
        return (
            <Card><CardContent>Loading KPI…</CardContent></Card>
        )
    }

    // ---- STEP 1: GET CURRENT + PREVIOUS MONTH EXPENSES PER CATEGORY ----
    const now = new Date()
    const currMonth = now.getMonth()
    const currYear = now.getFullYear()

    const prevMonth = currMonth === 0 ? 11 : currMonth - 1
    const prevYear = currMonth === 0 ? currYear - 1 : currYear

    function sumFor(category: string, month: number, year: number) {
        return expenses
            .filter(e => {
                const d = new Date(e.date)
                return (
                    e.category_name === category &&
                    d.getMonth() === month &&
                    d.getFullYear() === year
                )
            })
            .reduce((s, e) => s + Number(e.amount), 0)
    }

    // ---- STEP 2: Build dataset for each category that has a goal ----
    const kpiPoints = goals.map(g => {
        const cat = g.category_name

        const previous = sumFor(cat, prevMonth, prevYear)
        const current = sumFor(cat, currMonth, currYear)

        let percent = 0

        // Client KPI logic (merged version)
        if (g.type === "sustainable_material") {
            // sustainable purchase increase
            percent = previous > 0 ? ((current - previous) / previous) * 100 : 0
        } else {
            // reduction-based
            percent = previous > 0 ? ((previous - current) / previous) * 100 : 0
        }

        return {
            name: cat,
            value: percent,
            color: g.category_color || "#4caf50"
        }
    })

    // ---- STEP 3: Convert to stacked radial bar chart ----
    // Recharts needs a single object with keys:
    // { Energy: 10, Water: -5 ... }
    const dataObj: any = {}
    kpiPoints.forEach(pt => {
        dataObj[pt.name] = Math.round(pt.value)
    })

    const data = [dataObj]

    // build config
    const chartConfig: any = {}
    kpiPoints.forEach(pt => {
        chartConfig[pt.name] = {
            label: pt.name,
            color: pt.color
        }
    })

    // Compute overall score = average of all KPIs
    const avg =
        kpiPoints.reduce((s, x) => s + x.value, 0) / (kpiPoints.length || 1)

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Sustainability KPI</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-1 items-center pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square w-full max-w-[300px]"
                >
                    <ResponsiveContainer>
                        <RadialBarChart
                            data={data}
                            innerRadius={70}
                            outerRadius={130}
                            startAngle={180}
                            endAngle={0}
                        >
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />

                            <PolarRadiusAxis tick={false} axisLine={false}>
                                <Label
                                    content={({ viewBox }) => {
                                        if (!viewBox || !("cx" in viewBox)) return null

                                        return (
                                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) - 10}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {avg.toFixed(1)}%
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 15}
                                                    className="fill-muted-foreground text-sm"
                                                >
                                                    overall improvement
                                                </tspan>
                                            </text>
                                        )
                                    }}
                                />
                            </PolarRadiusAxis>

                            {kpiPoints.map((pt, i) => (
                                <RadialBar
                                    key={pt.name}
                                    dataKey={pt.name}
                                    stackId="a"
                                    cornerRadius={5}
                                    fill={pt.color}
                                />
                            ))}
                        </RadialBarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
