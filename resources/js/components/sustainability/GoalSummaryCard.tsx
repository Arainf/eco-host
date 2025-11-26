"use client"

import React, { useMemo } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type GoalSummaryCardProps = {
    goals?: any[]
    categories?: any[]
    loading?: boolean
}

export default function GoalSummaryCard({
                                            goals = [],
                                            categories = [],
                                            loading = false,
                                        }: GoalSummaryCardProps) {

    // 🔒 Ensure arrays
    const safeGoals = Array.isArray(goals) ? goals : []
    const safeCategories = Array.isArray(categories) ? categories : []

    const summary = useMemo(() => {
        if (!safeGoals.length) return { total: 0, achieved: 0 }

        const achieved = safeGoals.filter(
            (g) => g.current_pct >= g.target_pct
        ).length

        return {
            total: safeGoals.length,
            achieved,
        }
    }, [safeGoals])

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Goal Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Goal Achievements Summary</CardTitle>
            </CardHeader>

            <CardContent>
                {summary.total === 0 ? (
                    <p className="text-sm text-neutral-500">
                        No goals yet — create one to begin tracking your sustainability progress.
                    </p>
                ) : (
                    <>
                        <p className="text-sm font-medium">
                            Total Goals: {summary.total}
                        </p>
                        <p className="text-sm font-medium">
                            Achieved: {summary.achieved}
                        </p>

                        <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded mt-2">
                            <div
                                className="h-2 rounded bg-green-500"
                                style={{
                                    width:
                                        (summary.achieved / summary.total) * 100 + "%",
                                }}
                            ></div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
