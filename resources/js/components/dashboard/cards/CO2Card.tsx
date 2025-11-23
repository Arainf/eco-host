"use client"
import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type Expense = { category_name?: string; amount?: number | string }

const DEFAULT_FACTORS: Record<string, number> = {
    "Energy Consumption": 0.0008,
    "Water Usage": 0.0002,
    "Waste Management": 0.0005,
    "Sustainable Procurement": 0.0003,
    "Miscellaneous Eco-Expenses": 0.0001,
    "Other Costs": 0.0001,
}

export default function CO2Card({ expenses = [], loading = false }: { expenses?: Expense[]; loading?: boolean }) {
    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Estimated CO₂ Impact</CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-32 rounded mb-2" />
                    <Skeleton className="h-3 w-full rounded" />
                </CardContent>
            </Card>
        )
    }

    const totalKg = (expenses ?? []).reduce((sum, e) => {
        const amt = Number(e.amount ?? 0)
        const cat = (e.category_name as string) ?? "Other Costs"
        const factor = DEFAULT_FACTORS[cat] ?? 0.0002
        return sum + amt * factor
    }, 0)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Estimated CO₂ Impact</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-semibold">{totalKg.toFixed(2)} kg CO₂</div>
                <div className="mt-2 text-sm text-muted-foreground">
                    Estimated using category emission factors. For accuracy, connect real meters or configure custom factors.
                </div>
            </CardContent>
        </Card>
    )
}
