// resources/js/components/sustainability/GoalsProgressList.tsx
"use client"

import React, { useMemo } from "react"
import GoalSummaryCard from "./GoalSummaryCard"
import { monthTotals } from '@/components/sustainability/utils/SustainabilityUtils';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function GoalsProgressList({ categories = [], expenses = [], onEdit, onRemove }: any) {
    const cats = Array.isArray(categories) ? categories : []

    // compute progress for each category
    const computed = useMemo(() => {
        return cats.map((c: any) => {
            const totals = monthTotals(expenses, (e: any) => e.category_name === c.name)
            // reduction percent from last -> this
            let reduction = 0
            if (totals.lastMonthSum > 0) reduction = (1 - totals.thisMonthSum / totals.lastMonthSum) * 100
            if (totals.lastMonthSum === 0 && totals.thisMonthSum === 0) reduction = 0
            if (totals.lastMonthSum === 0 && totals.thisMonthSum > 0) reduction = -100
            return { goal: c, progress: Number(reduction.toFixed(2)) }
        })
    }, [cats, expenses])

    if (computed.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Goals</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">You have not defined any sustainability goals yet.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="grid md:grid-cols-2 gap-3">
            {computed.map((c: any) => (
                <GoalSummaryCard key={c.goal.id} goal={c.goal} progress={c.progress} onEdit={onEdit} onRemove={onRemove} />
            ))}
        </div>
    )
}
