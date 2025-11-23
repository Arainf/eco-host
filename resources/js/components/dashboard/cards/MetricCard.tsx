// components/dashboard/cards/MetricCardV2.tsx
"use client"

import React, { useMemo } from "react"
import { AreaChart, Area, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts"
import { hexToRgba } from '@/components/dashboard/utils/colors';

type DataPoint = { label: string; value: number }

type MetricCardV2Props = {
    title?: string
    categoryName: string
    categoryColor: string
    data: DataPoint[]                  // daily values for chart
    loading?: boolean
    subtitle?: string
    metricType?: "total" | "count" | "average"
    onCategoryChange?: (category: string) => void
    onMetricTypeChange?: (t: "total" | "count" | "average") => void
    allCategories?: { name: string; color: string }[]
}

export default function MetricCardV2({
                                         title,
                                         categoryName,
                                         categoryColor,
                                         data = [],
                                         loading = false,
                                         subtitle,
                                         metricType = "total",
                                         onCategoryChange,
                                         onMetricTypeChange,
                                         allCategories = [],
                                     }: MetricCardV2Props) {
    // value calculation based on metricType
    const valueNumber = useMemo(() => {
        const total = data.reduce((s, d) => s + Number(d.value ?? 0), 0)
        const count = data.length
        if (metricType === "total") return total
        if (metricType === "average") return count === 0 ? 0 : total / count
        return count // count
    }, [data, metricType])

    const formatted = useMemo(() => {
        if (metricType === "count") return `${valueNumber}`
        // money-looking formatting for total/average
        return `₱${Number(valueNumber).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
    }, [valueNumber, metricType])

    // gradient id unique per category to avoid collisions
    const gradientId = `g-${(categoryName || "c").replace(/\s+/g, "")}`

    return (
        <div
            className="
        relative overflow-hidden rounded-2xl border border-white/10
        bg-white/85 dark:bg-neutral-900/50 backdrop-blur-xl
        shadow-[0_10px_30px_rgba(2,6,23,0.12)]
        p-4 transition-transform hover:-translate-y-1
      "
            role="region"
            aria-label={`Metric card ${categoryName}`}
        >
            {/* top controls */}
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="text-xs text-muted-foreground font-medium">{title ?? categoryName}</div>
                    <div className="mt-1 text-2xl font-extrabold text-neutral-900 dark:text-neutral-50">
                        {loading ? <span className="inline-block h-6 w-32 bg-gray-200 dark:bg-neutral-700 animate-pulse rounded" /> : formatted}
                        <span className="ml-2 text-sm font-medium text-muted-foreground">{metricType === "average" ? "avg" : ""}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{subtitle ?? `${data.length} datapoints`}</div>
                </div>

                {/* dropdowns */}
                <div className="flex flex-col items-end gap-2">
                    <select
                        className="text-xs rounded px-2 py-1 bg-white/60 dark:bg-neutral-800 border border-white/10"
                        value={categoryName}
                        onChange={(e) => onCategoryChange?.(e.target.value)}
                        title="Select category"
                    >
                        {allCategories.map(c => (
                            <option key={c.name} value={c.name}>{c.name}</option>
                        ))}
                    </select>

                    <select
                        className="text-xs rounded px-2 py-1 bg-white/60 dark:bg-neutral-800 border border-white/10"
                        value={metricType}
                        onChange={(e) => onMetricTypeChange?.(e.target.value as any)}
                        title="Metric type"
                    >
                        <option value="total">Total</option>
                        <option value="average">Average</option>
                    </select>
                </div>
            </div>

            {/* chart */}
            <div className="mt-3 h-24 w-full">
                {loading ? (
                    <div className="h-full w-full bg-neutral-100 dark:bg-neutral-800 rounded" />
                ) : data.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                        Not enough data yet
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={categoryColor} stopOpacity={0.28} />
                                    <stop offset="100%" stopColor={hexToRgba(categoryColor, 0)} stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={false} />
                            <Tooltip />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke={categoryColor}
                                fill={`url(#${gradientId})`}
                                strokeWidth={2}
                                dot={{ stroke: categoryColor, strokeWidth: 2, r: 4, fill: "#fff" }}
                                activeDot={{ r: 6 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    )
}
