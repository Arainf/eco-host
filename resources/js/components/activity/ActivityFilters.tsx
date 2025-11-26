"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ActivityFilters({
                                            query,
                                            setQuery,
                                            period,
                                            setPeriod,
                                        }: any) {
    return (
        <div className="flex gap-3">
            <Input
                placeholder="Search logs..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1"
            />

            <Button
                variant={period === "month" ? "default" : "outline"}
                onClick={() => setPeriod("month")}
            >
                Month
            </Button>

            <Button
                variant={period === "year" ? "default" : "outline"}
                onClick={() => setPeriod("year")}
            >
                Year
            </Button>
        </div>
    )
}
