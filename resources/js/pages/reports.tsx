"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"

// Layout
import AppLayout from "@/layouts/app-layout"
import { Head } from "@inertiajs/react"
import { type BreadcrumbItem } from "@/types"

// UI
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"

import { toast } from "sonner"

// Charts
import TrendChart from "@/components/dashboard/charts/TrendChart"
import PieChart from "@/components/dashboard/charts/PieChart"

// Breadcrumb
const breadcrumbs: BreadcrumbItem[] = [
    { title: "Reports & Analytics", href: "/reports" },
]

export default function ReportsPage() {
    const yearNow = new Date().getFullYear()
    const currentMonth = new Date().getMonth() + 1
    const defaultSem = currentMonth >= 8 || currentMonth <= 12 ? 1 : 2

    const [year, setYear] = useState(yearNow)
    const [semester, setSemester] = useState(defaultSem)
    const [loading, setLoading] = useState(false)
    const [report, setReport] = useState<any>(null)

    // Load report
    useEffect(() => { load() }, [year, semester])

    async function load() {
        setLoading(true)
        try {
            const { data } = await axios.get("/data/reports/semester", {
                params: { year, semester },
            })
            setReport(data)
        } catch (err) {
            toast.error("Failed to load report")
        } finally {
            setLoading(false)
        }
    }

    async function exportPdf() {
        try {
            const res = await axios.post(
                "/data/reports/export",
                { year, semester },
                { responseType: "blob" }
            )

            const url = window.URL.createObjectURL(new Blob([res.data]))
            const a = document.createElement("a")
            a.href = url
            a.download = `report_sem${semester}_${year}.pdf`
            a.click()
            window.URL.revokeObjectURL(url)
        } catch (err) {
            toast.error("PDF export failed")
        }
    }

    const summary = report?.summary ?? {}
    const months = report?.monthly ?? []
    const categories = report?.by_category ?? []
    const topSubs = report?.top_subcategories ?? []

    const peso = (v: any) => `₱${Number(v || 0).toLocaleString()}`

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports & Analytics" />

            <div className="p-4 w-full mx-auto space-y-8">

                {/* HEADER BAR */}
                <div className="flex flex-wrap justify-end gap-2">
                    <Select
                        value={String(semester)}
                        onValueChange={(v) => setSemester(Number(v))}
                    >
                        <SelectTrigger className="w-[220px]">
                            <SelectValue placeholder="Semester" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">1st Semester — Aug–Dec</SelectItem>
                            <SelectItem value="2">2nd Semester — Jan–May</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={String(year)}
                        onValueChange={(v) => setYear(Number(v))}
                    >
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                            {[yearNow, yearNow - 1, yearNow - 2].map((y) => (
                                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button onClick={exportPdf} disabled={!report || loading}>
                        Export as PDF
                    </Button>
                </div>

                {/* TOP BENTO GRID */}
                <div className="grid gap-4 md:grid-cols-3">

                    {/* LEFT = Trend Chart (2 cols) */}
                    <Card className="md:col-span-2 flex flex-col">
                        <CardHeader>
                            <CardTitle>Monthly Trend</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-4">
                            <TrendChart
                                data={months.map((m: any) => ({
                                    label: m.label,
                                    value: m.amount,
                                }))}
                                loading={loading}
                                title=""
                            />
                        </CardContent>
                    </Card>

                    {/* RIGHT = Summary + Top Subcategories */}
                    <div className="flex flex-col gap-4 h-full">

                        {/* SEMESTER SUMMARY */}
                        <Card className="flex flex-col">
                            <CardHeader>
                                <CardTitle>Semester Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {loading ? (
                                    "Loading..."
                                ) : (
                                    <>
                                        <div>Total Spending</div>
                                        <div className="text-3xl font-bold">
                                            {peso(summary.total_amount)}
                                        </div>
                                        <div className="text-sm text-neutral-500">
                                            Entries: {summary.entries ?? 0}
                                        </div>
                                        <div className="text-sm text-neutral-500">
                                            Top Category: {summary.highest_category ?? "—"}
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* TOP SUBCATEGORIES */}
                        <Card className="flex flex-col">
                            <CardHeader>
                                <CardTitle>Top Subcategories</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {(topSubs ?? []).length === 0 ? (
                                    <div className="text-sm text-neutral-500">No data available</div>
                                ) : (
                                    <div className="space-y-2">
                                        {topSubs.map((s: any, index: number) => (
                                            <div
                                                key={s.name}
                                                className="flex items-center justify-between p-2 border rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800 transition"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="text-xs w-5 h-5 flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                                                        {index + 1}
                                                    </div>
                                                    <span className="font-medium">{s.name}</span>
                                                </div>

                                                <div className="font-semibold text-neutral-700 dark:text-neutral-100">
                                                    {peso(s.amount)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                    </div>
                </div>

                {/* BOTTOM SECTION */}
                <div className="grid gap-4 md:grid-cols-3">

                    {/* FULL-WIDTH Monthly Breakdown */}
                    <Card className="md:col-span-3 flex flex-col">
                        <CardHeader>
                            <CardTitle>Monthly Breakdown</CardTitle>
                        </CardHeader>

                        <CardContent className="text-sm">
                            {(months ?? []).length === 0 ? (
                                <div className="text-neutral-500">No monthly data</div>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead>
                                    <tr className="text-left text-neutral-500 border-b">
                                        <th className="py-1">Month</th>
                                        <th className="py-1">Amount</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {months.map((m: any) => (
                                        <tr
                                            key={m.label}
                                            className="border-b hover:bg-neutral-50 dark:hover:bg-neutral-800 transition"
                                        >
                                            <td className="py-1">{m.label}</td>
                                            <td className="py-1 font-medium">{peso(m.amount)}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            )}
                        </CardContent>
                    </Card>

                </div>

            </div>
        </AppLayout>
    )
}
