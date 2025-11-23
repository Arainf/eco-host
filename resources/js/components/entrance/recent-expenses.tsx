"use client"

import { useMemo, useState } from "react"
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export function RecentExpenses({ expenses = [], loading = false }: any) {
    const [filter, setFilter] = useState<"week" | "month">("week")

    const toNumber = (v: any) => Number(v ?? 0)

    // filtering
    const filtered = useMemo(() => {
        const today = new Date()
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay())

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

        return expenses.filter((ex: any) => {
            const d = new Date(ex.date)

            if (filter === "week") return d >= startOfWeek && d <= today
            if (filter === "month") return d >= startOfMonth && d <= today

            return true
        })
    }, [expenses, filter])

    // total
    const totalAmount = useMemo(() => {
        return filtered.reduce((sum, ex) => sum + toNumber(ex.amount), 0)
    }, [filtered])

    return (
        <Card className="border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 bg-white">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Recent Expenses</CardTitle>

                    <div className="flex items-center gap-2">
                        <Button
                            variant={filter === "week" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilter("week")}
                        >
                            This Week
                        </Button>
                        <Button
                            variant={filter === "month" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilter("month")}
                        >
                            This Month
                        </Button>
                    </div>
                </div>

                <p className="text-sm mt-2 text-neutral-600 dark:text-neutral-300">
                    Total:{" "}
                    <span className="font-semibold">
        ₱{Intl.NumberFormat("en-US", { notation: "compact" }).format(totalAmount)}
    </span>
                </p>

            </CardHeader>

            <CardContent>
                {/* SKELETONS */}
                {loading && (
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-2">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="w-3 h-3 rounded-full" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                                <div className="text-right">
                                    <Skeleton className="h-4 w-16 ml-auto" />
                                    <Skeleton className="h-3 w-20 ml-auto mt-1" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* EMPTY */}
                {!loading && filtered.length === 0 && (
                    <p className="text-sm text-neutral-500">No expenses yet.</p>
                )}

                {/* LIST */}
                {!loading && filtered.length > 0 && (
                    <div className="space-y-2 max-h-72 overflow-auto">
                        {filtered.map((ex: any) => (
                            <div
                                key={ex.id}
                                className="flex items-center justify-between p-2 rounded hover:bg-neutral-50 dark:hover:bg-neutral-800"
                            >
                                <div className="flex items-center gap-3">
                  <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: ex.category_color }}
                  />
                                    <div>
                                        <div className="text-sm font-medium">{ex.expense_name}</div>
                                        <div className="text-xs text-neutral-500">
                                            {ex.subcategory_name} • {ex.category_name}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-sm font-semibold">
                                        ₱{Number(ex.amount).toFixed(2)}
                                    </div>
                                    <div className="text-xs text-neutral-500">{ex.date}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
