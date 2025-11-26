"use client"

import React, { useMemo } from "react"
import {
    LineChart,
    Line,
    ResponsiveContainer,
    Tooltip,
    CartesianGrid,
    XAxis,
} from "recharts"

// shadcn UI
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from 'lucide-react';

type DataPoint = { label: string; value: number }

type MetricCardV2Props = {
    title?: string
    categoryName: string
    categoryColor: string
    data: DataPoint[]
    previousData?: DataPoint[]        // ← NEW
    loading?: boolean
    onCategoryChange?: (category: string) => void
    allCategories?: { name: string; color: string }[]
}

export default function MetricCardV2({
                                         title,
                                         categoryName,
                                         categoryColor,
                                         data = [],
                                         previousData = [],
                                         loading = false,
                                         onCategoryChange,
                                         allCategories = [],
                                     }: MetricCardV2Props) {

    // Total this month
    const total = useMemo(() => {
        return data.reduce((s, d) => s + Number(d.value ?? 0), 0)
    }, [data])

    // Total previous month
    const prevTotal = useMemo(() => {
        return previousData.reduce((s, d) => s + Number(d.value ?? 0), 0)
    }, [previousData])

    // Percentage change
    const percentChange = useMemo(() => {
        if (!Array.isArray(previousData) || previousData.length === 0) return null;

        const prev = prevTotal;
        const curr = total;

        if (prev <= 0) return null;

        return ((curr - prev) / prev) * 100;
    }, [total, prevTotal, previousData]);


    const formattedTotal = `₱${total.toLocaleString("en-US", {
        minimumFractionDigits: 2,
    })}`

    // Subtitle logic
    const subtitle = useMemo(() => {
        if (percentChange === null) return "No previous data"

        const abs = Math.abs(percentChange).toFixed(1)

        return percentChange > 0
            ? `↑ ${abs}% from last month`
            : `↓ ${abs}% lower than last month`
    }, [percentChange])

    // Clean date formatting
    const formattedData = data.map((d) => {
        const [mm, dd] = d.label.split("/")
        const monthName = new Date(2025, Number(mm) - 1, Number(dd)).toLocaleString(
            "en-US",
            { month: "short" }
        )
        return {
            ...d,
            readable: `${monthName} ${dd}`,
        }
    })

    return (
        <div
            className="
        relative overflow-hidden rounded-xl border
        border-neutral-200/60 dark:border-neutral-800/60
        bg-white/90 dark:bg-neutral-900/50 backdrop-blur-md
        shadow-sm hover:shadow-md
        p-5 pt-8 transition-all duration-300
        flex items-center justify-between gap-6
      "
        >
            {/* ⋮ dropdown menu */}
            <div className="absolute left-3 top-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 transition"
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="start"
                        className="w-66 p-2 animate-in fade-in zoom-in-50 duration-150"
                    >
                        <p className="text-xs px-2 pb-1 text-neutral-500">Select Category</p>

                        {allCategories.map((c) => (
                            <Button
                                key={c.name}
                                variant="ghost"
                                className="w-full justify-start text-sm transition"
                                onClick={() => onCategoryChange?.(c.name)}
                            >
                                <span
                                    className="w-2 h-2 rounded-full mr-2"
                                    style={{ backgroundColor: c.color }}
                                />
                                {c.name}
                            </Button>
                        ))}

                        <DropdownMenuSeparator />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* LEFT CONTENT */}
            <div className="flex flex-col w-1/2 space-y-2">
                <div className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                    {title ?? categoryName}
                </div>

                {/* VALUE */}
                <div
                    className="
            mt-1 text-3xl font-bold text-neutral-900 dark:text-neutral-50
            transition-all duration-300 animate-in fade-in slide-in-from-bottom-1
          "
                >
                    {loading ? (
                        <span className="h-7 w-24 bg-neutral-300 dark:bg-neutral-700 animate-pulse rounded inline-block"></span>
                    ) : (
                        formattedTotal
                    )}
                </div>

                {/* PERCENTAGE SUBTITLE */}
                <div
                    className="
            text-xs text-neutral-500 dark:text-neutral-400
            animate-in fade-in duration-300 delay-100
          "
                >
                    {loading ? (
                        <span className="h-3 w-24 bg-neutral-300 dark:bg-neutral-700 animate-pulse rounded inline-block"></span>
                    ) : (
                        subtitle
                    )}
                </div>
            </div>

            {/* RIGHT — CHART */}
            <div
                className="
          w-3/4 h-20 transition-all duration-300
          animate-in fade-in slide-in-from-right-2
        "
            >
                {loading ? (
                    <div className="h-full w-full bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
                ) : formattedData.length === 0 ? (
                    <div className="h-full w-full flex items-center justify-center text-xs text-neutral-400">
                        No data
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={formattedData}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                horizontal={false}
                                vertical={false}
                            />

                            <XAxis
                                dataKey="readable"
                                tick={{ fontSize: 8, fill: "#777" }}
                                interval={4}
                            />

                            <Tooltip
                                contentStyle={{
                                    background: "rgba(255,255,255,0.9)",
                                    borderRadius: "6px",
                                    border: "1px solid #ddd",
                                    textSizeAdjust: "12px",
                                }}
                                formatter={(value: any) => [
                                    `₱${value.toLocaleString()}`,
                                    "Amount",
                                ]}
                                labelFormatter={(label: any) => `Date: ${label}`}
                            />

                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke={categoryColor}
                                strokeWidth={2}
                                dot={{ r: 0 }}
                                activeDot={{ r: 5, stroke: categoryColor }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    )
}
