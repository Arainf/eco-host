"use client"
import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function AlertsCard({ expenses = [], loading = false }: { expenses?: any[]; loading?: boolean }) {
    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-4 w-full rounded" />)}
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (!expenses || expenses.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-muted-foreground">No alerts — add some expenses to see automated insights.</div>
                </CardContent>
            </Card>
        )
    }

    // simple alert rules
    const alerts: string[] = []
    const today = new Date()
    const thirtyAgo = new Date(today); thirtyAgo.setDate(today.getDate() - 30)
    const prev30Start = new Date(thirtyAgo); prev30Start.setDate(thirtyAgo.getDate() - 30)

    const sum = (from: Date, to: Date) => expenses.reduce((s, e) => {
        const d = new Date(e.date); const amt = Number(e.amount ?? 0)
        return d >= from && d <= to ? s + amt : s
    }, 0)

    const sumThis = sum(thirtyAgo, today)
    const sumPrev = sum(prev30Start, thirtyAgo)

    if (sumPrev > 0 && sumThis / sumPrev > 1.25) {
        alerts.push(`Spending increased ${( (sumThis/sumPrev -1) * 100 ).toFixed(0)}% vs previous 30 days.`)
    }

    // high subcategory spend
    const subMap = new Map<string, number>()
    expenses.forEach((e: any) => subMap.set(e.subcategory_name, (subMap.get(e.subcategory_name) ?? 0) + Number(e.amount ?? 0)))
    Array.from(subMap.entries()).forEach(([k, v]) => {
        if (v > 15000) alerts.push(`${k} spending is high: ₱${v.toLocaleString()}`)
    })

    if (alerts.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-muted-foreground">No alerts — everything looks stable.</div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Alerts</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="list-disc list-inside space-y-2 text-sm">
                    {alerts.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
            </CardContent>
        </Card>
    )
}
