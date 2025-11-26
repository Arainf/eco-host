"use client"

import { useEffect, useState } from "react"
import axios from "axios"

// Layout + routing
import AppLayout from "@/layouts/app-layout"
import { sustainability } from "@/routes"
import { Head } from "@inertiajs/react"
import { type BreadcrumbItem } from "@/types"

// Components
import KPIRadialChart from "@/components/sustainability/KPIRadialChart"
import GoalsList from "@/components/goals/GoalsList"
import GoalSummaryCard from "@/components/sustainability/GoalSummaryCard"
import { SustainabilityTrend } from '@/components/sustainability/SustainabilityTrend';

// UI
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from "@/components/ui/skeleton"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Sustainability",
        href: sustainability().url,
    },
]

export default function SustainabilityPage() {
    const [loading, setLoading] = useState(true)
    const [goals, setGoals] = useState([])
    const [categories, setCategories] = useState([])
    const [expenses, setExpenses] = useState([])
    const [trendData, setTrendData] = useState([])

    useEffect(() => {
        load()
    }, [])

    const load = async () => {
        try {
            setLoading(true)

            const [g, c, e] = await Promise.all([
                axios.get("/data/goals"),
                axios.get("/data/categories"),
                axios.get("/data/expenses"),
            ])

            const goalList = Array.isArray(g.data) ? g.data : []
            const catList = Array.isArray(c.data) ? c.data : []
            const expList = Array.isArray(e.data) ? e.data : []

            setGoals(goalList)
            setCategories(catList)
            setExpenses(expList)

            setTrendData(computeTrend(expList))
        } finally {
            setLoading(false)
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sustainability" />

            <div className="flex flex-col gap-6 p-4 max-w-7xl mx-auto">

                {/* ---------------------------------------------------------------- */}
                {/* KPI SECTION */}
                {/* ---------------------------------------------------------------- */}
                <Card className="p-6">
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Performance Indicators (KPIs)
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="grid place-items-center">
                            <KPIRadialChart
                                goals={goals}
                                categories={categories}
                                expenses={expenses}
                                loading={loading}
                            />
                        </div>

                        <p className="text-center text-sm text-muted-foreground mt-4">
                            Your sustainability score is based on your set goals and your expense data.
                        </p>
                    </CardContent>
                </Card>

                {/* ---------------------------------------------------------------- */}
                {/* GOALS + SUMMARY */}
                {/* ---------------------------------------------------------------- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* LEFT: Goals list */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Your Goals</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <Skeleton className="h-40 w-full" />
                                ) : (
                                    <GoalsList />
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT: Summary */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Goal Summary</CardTitle>
                            </CardHeader>

                            <CardContent>
                                <GoalSummaryCard
                                    goals={goals}
                                    categories={categories}
                                    expenses={expenses}
                                    loading={loading}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* ---------------------------------------------------------------- */}
                {/* TREND CHART */}
                {/* ---------------------------------------------------------------- */}
                <Card className="p-6">
                    <CardHeader>
                        <CardTitle className="text-lg">Spending Trend (Last 30 Days)</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <SustainabilityTrend
                            data={trendData}
                            loading={loading}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}

/* ---------------------------------------------------------------------- */
/* Helper: Build last-30-days trend */
/* ---------------------------------------------------------------------- */

function computeTrend(expenses: any[]) {
    const map = new Map()

    expenses.forEach((e) => {
        const d = new Date(e.date)
        const key = `${d.getMonth() + 1}/${d.getDate()}`
        map.set(key, (map.get(key) ?? 0) + Number(e.amount))
    })

    return [...map.entries()]
        .map(([label, value]) => ({ label, value }))
        .slice(-30)
}
