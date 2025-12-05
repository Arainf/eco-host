// components/sustainability/kpiMetricCard.tsx
"use client";

import React, { useMemo } from "react";
import {
    RadialBarChart,
    RadialBar,
    PolarRadiusAxis,
    ResponsiveContainer,
    Label,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function KPIMetricCard({
                                          label,
                                          value = null,
                                          targetMin = null,
                                          targetMax = null,
                                          currentAmount = null,
                                          unitLabel = "",
                                          loading = false,
                                      }: any) {

    const displayValue = value === null || value === undefined ? null : Number(value);

    // ------- STATUS LOGIC ---------
    const status = useMemo(() => {
        if (displayValue === null) return { text: "No data", color: "#94a3b8" }; // gray
        if (targetMin === null && targetMax === null) return { text: "No target", color: "#94a3b8" };

        if (targetMin !== null && targetMax !== null) {
            if (displayValue >= targetMin && displayValue <= targetMax)
                return { text: "On track", color: "#16a34a" }; // green
            if (displayValue > targetMax)
                return { text: "Exceeded", color: "#f59e0b" }; // amber
            return { text: "Below target", color: "#ef4444" }; // red
        }

        if (targetMin !== null)
            return displayValue >= targetMin
                ? { text: "On track", color: "#16a34a" }
                : { text: "Below target", color: "#ef4444" };

        return { text: "No target", color: "#94a3b8" };
    }, [displayValue, targetMin, targetMax]);

    const radialData =
        displayValue !== null ? [{ [label]: Math.round(displayValue) }] : [];

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>{label}</CardTitle>
            </CardHeader>

            <CardContent className="flex items-center flex-col gap-4">
                {/* ---- RADIAL CHART ---- */}
                <div className="w-1/2 h-36">
                    {loading ? (
                        <div className="h-full w-full bg-neutral-100 animate-pulse rounded" />
                    ) : displayValue === null ? (
                        <div className="h-full w-full flex items-center justify-center text-sm text-neutral-500">
                            No data
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart
                                data={radialData}
                                innerRadius={60}
                                outerRadius={90}
                                startAngle={180}
                                endAngle={0}
                            >
                                <PolarRadiusAxis tick={false} axisLine={false}>
                                    <Label
                                        content={({ viewBox }) => {
                                            if (!viewBox || !("cx" in viewBox)) return null;
                                            return (
                                                <text
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    textAnchor="middle"
                                                >
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) - 8}
                                                        className="fill-foreground text-2xl font-bold"
                                                    >
                                                        {displayValue.toFixed(1)}%
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) + 14}
                                                        className="fill-muted-foreground text-xs"
                                                    >
                                                        change
                                                    </tspan>
                                                </text>
                                            );
                                        }}
                                    />
                                </PolarRadiusAxis>

                                {/* ⚡ FIX: USE STATUS COLOR FOR CHART FILL */}
                                <RadialBar
                                    dataKey={label}
                                    fill={status.color}
                                    cornerRadius={6}
                                />
                            </RadialBarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* ---- TARGET RANGE ---- */}
                <div className="text-xs text-neutral-500 mb-2">
                    Target:{" "}
                    {targetMin == null && targetMax == null
                        ? "Not set"
                        : targetMin != null && targetMax != null
                            ? `${targetMin}% – ${targetMax}%`
                            : targetMin != null
                                ? `≥ ${targetMin}%`
                                : `≤ ${targetMax}%`}
                </div>

                {/* ---- STATUS TEXT ---- */}
                <div className="flex items-center gap-2">
                    <div
                        style={{ backgroundColor: status.color }}
                        className="w-2 h-2 rounded-full"
                    />
                    <div className="text-sm font-medium" style={{ color: status.color }}>
                        {status.text}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
