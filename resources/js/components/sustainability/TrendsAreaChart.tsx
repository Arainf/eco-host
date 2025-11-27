// components/sustainability/TrendsAreaChart.tsx
"use client";

import React from "react";
import { AreaChart, Area, ResponsiveContainer, CartesianGrid, XAxis, Tooltip } from "recharts";

export default function TrendsAreaChart({ data = [], loading = false, title = "Trend" }: any) {
    if (loading) return <div className="h-48" />;

    return (
        <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.05} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} />
                    <XAxis dataKey="label" />
                    <Tooltip formatter={(val: any) => `₱${Number(val).toLocaleString()}`} />
                    <Area dataKey="value" stroke="#60a5fa" fill="url(#tg)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
