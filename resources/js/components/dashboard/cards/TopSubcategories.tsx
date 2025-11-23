"use client"
import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type Expense = { subcategory_name?: string; amount?: number | string; category_color?: string }

export default function TopSubcategories({ expenses = [], loading = false, limit = 5 }: { expenses?: Expense[]; loading?: boolean; limit?: number }) {
    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Top Subcategories</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {[...Array(limit)].map((_, i) => <Skeleton key={i} className="h-6 w-full rounded" />)}
                    </div>
                </CardContent>
            </Card>
        )
    }

    const map: Map<string, { total: number; color?: string }> = new Map()

    ;(expenses ?? []).forEach((e: any) => {
        const name = e.subcategory_name ?? "Unknown"
        const amt = Number(e.amount ?? 0)
        const prev = map.get(name) ?? { total: 0, color: e.category_color }
        prev.total += amt
        map.set(name, prev)
    })


    const ranked = Array.from(map.entries()).map(([name, { total, color }]) => ({ name, total, color })).sort((a, b) => b.total - a.total).slice(0, limit)

    if (ranked.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Top Subcategories</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-muted-foreground">Not enough data yet — add expenses to see top subcategories.</div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Top Subcategories</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3">
                    {ranked.map(r => (
                        <li key={r.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: r.color ?? "#ddd" }} />
                                <div>
                                    <div className="text-sm font-medium">{r.name}</div>
                                    <div className="text-xs text-muted-foreground">Subcategory</div>
                                </div>
                            </div>
                            <div className="text-sm font-semibold">₱{r.total.toLocaleString("en-US", {minimumFractionDigits:2})}</div>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}
