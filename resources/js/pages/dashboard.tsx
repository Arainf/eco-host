// pages/dashboard.tsx
"use client"
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { type BreadcrumbItem } from "@/types";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";

import DashboardCategoriesRow from "@/components/dashboard/DashboardCategoriesRow";
import TrendChart from "@/components/dashboard/charts/TrendChart";
import PieChart from "@/components/dashboard/charts/PieChart";
import CO2Card from "@/components/dashboard/cards/CO2Card";
import TopSubcategories from "@/components/dashboard/cards/TopSubcategories";
import AlertsCard from "@/components/dashboard/cards/AlertsCard";
import { Button } from "@/components/ui/button";

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Overview Summary", href: "/dashboard" },
];

export default function Dashboard() {
    const [expenses, setExpenses] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true
        async function load() {
            try {
                setLoading(true)
                const [expRes, catRes] = await Promise.all([
                    axios.get("/data/expenses"),
                    axios.get("/data/categories"),
                ])
                if (!mounted) return
                setExpenses(expRes.data || [])
                // normalize categories array: {name, color}
                setCategories((catRes.data || []).map((c: any) => ({ name: c.name, color: c.color })))
            } catch (err) {
                console.error(err)
            } finally {
                if (mounted) setLoading(false)
            }
        }
        load()
        return () => { mounted = false }
    }, [])

    // trend data and breakdown reused from previous implementation
    const trendData = useMemo(() => {
        const days = 30
        const arr: { label: string; value: number }[] = []
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date(); d.setDate(d.getDate() - i)
            const label = `${d.getMonth()+1}/${d.getDate()}`
            const total = expenses.filter(e => {
                const ed = new Date(e.date)
                return ed.getFullYear() === d.getFullYear() && ed.getMonth() === d.getMonth() && ed.getDate() === d.getDate()
            }).reduce((s,e) => s + Number(e.amount ?? 0), 0)
            arr.push({ label, value: total })
        }
        return arr
    }, [expenses])

    const categoryBreakdown = useMemo(() => {
        const map = new Map<string, { value: number; color?: string }>()
        categories.forEach(c => map.set(c.name, { value: 0, color: c.color }))
        expenses.forEach((e: any) => {
            const cat = e.category_name ?? "Uncategorized"
            const vc = map.get(cat) ?? { value: 0, color: "#888" }
            vc.value += Number(e.amount ?? 0)
            map.set(cat, vc)
        })
        return Array.from(map.entries()).map(([name, { value, color }]) => ({ name, value, color })).filter(x => x.value > 0)
    }, [expenses, categories])

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard v2" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">

                {/* categories row (3 cards initially) */}
                <DashboardCategoriesRow categories={categories} expenses={expenses} loading={loading} />

                {/* charts */}
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="md:col-span-2">
                        <TrendChart data={trendData} loading={loading} title="Spending Trend (30 days)" />
                    </div>
                    <div className="space-y-4">
                        <PieChart data={categoryBreakdown} loading={loading} title="Spending by Category" />
                        <CO2Card expenses={expenses} loading={loading} />
                    </div>
                </div>

                {/* bottom row */}
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="md:col-span-2">
                        <TopSubcategories expenses={expenses} loading={loading} />
                    </div>
                    <div>
                        <AlertsCard expenses={expenses} loading={loading} />
                        <div className="mt-4">
                            <Button variant="outline" size="sm" onClick={() => window.open("/mnt/data/Eco Cost Tracker (Categorization).pdf", "_blank")}>
                                Help: Categorization guide
                            </Button>
                        </div>
                    </div>
                </div>

            </div>
        </AppLayout>
    )
}
