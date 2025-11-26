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


const breadcrumbs: BreadcrumbItem[] = [
    { title: "Overview Summary", href: "/dashboard" },
];

export default function Dashboard() {
    const [expenses, setExpenses] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any[]>([])

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

    useEffect(() => {
        async function load() {
            setLoading(true)
            try {
                const res = await axios.get("/data/expenses")
                const expenses = res.data || []

                // build last 30 days
                const days = 30
                const arr: any[] = []
                for (let i = days - 1; i >= 0; i--) {
                    const d = new Date()
                    d.setDate(d.getDate() - i)
                    const iso = d.toISOString().split("T")[0]
                    arr.push({ label: iso, value: 0, count: 0 })
                }

                const idx = (dateStr: string) => arr.findIndex((a) => a.label === dateStr)

                expenses.forEach((e: any) => {
                    const d = new Date(e.date)
                    const iso = d.toISOString().split("T")[0]
                    const i = idx(iso)
                    if (i >= 0) {
                        arr[i].value += Number(e.amount ?? 0)
                        arr[i].count += 1
                    }
                })

                // convert label to short month/day for chart if you like
                const formatted = arr.map((r) => {
                    const d = new Date(r.label)
                    const mm = d.getMonth() + 1
                    const dd = d.getDate()
                    return { label: `${mm}/${dd}`, value: Math.round(r.value), count: r.count }
                })

                setData(formatted)
            } catch (err) {
                setData([])
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

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
                        <TrendChart data={data} loading={loading} title="Spending Trend (30 days)" />
                    </div>
                    <div className="space-y-4">
                        <CO2Card expenses={expenses} loading={loading} />
                        <PieChart data={categoryBreakdown} loading={loading} title="Spending by Category" />

                    </div>
                </div>


            </div>
        </AppLayout>
    )
}
