"use client"

import React, { useState, useEffect } from "react"
import MetricCardV2 from '@/components/dashboard/cards/MetricCard';

type Expense = {
    id?: number
    expense_name?: string
    subcategory_name?: string
    category_name?: string
    category_color?: string
    amount?: number | string
    date?: string
}

export function DashboardCategoriesRow({
                                           categories = [],
                                           expenses = [],
                                           loading = false,
                                       }: {
    categories: { name: string; color: string }[]
    expenses: Expense[]
    loading?: boolean
}) {

    // Hard-coded defaults ALWAYS visible
    const DEFAULT_ORDER = [
        "Energy Consumption",
        "Waste Management",
        "Water Usage",
    ]

    // Local state stores which category appears in each card
    const [slots, setSlots] = useState<string[]>(DEFAULT_ORDER)

    // When categories load, update only those that exist
    useEffect(() => {
        if (!categories || categories.length === 0) return

        setSlots(prev => {
            return prev.map(defaultName => {
                const exists = categories.find(c => c.name === defaultName)
                return exists ? exists.name : defaultName  // keep default if missing
            })
        })
    }, [categories])

    // metric type (total/average/count)
    const [metricTypes, setMetricTypes] = useState<("total" | "average" | "count")[]>([
        "total",
        "total",
        "total",
    ])

    // Chart data per category
    const chartDataFor = (categoryName: string) => {
        const days = 30
        const arr = []
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date()
            d.setDate(d.getDate() - i)
            const label = `${d.getMonth() + 1}/${d.getDate()}`
            const total = expenses
                .filter(e => {
                    const ed = new Date(e.date)
                    return (
                        ed.getFullYear() === d.getFullYear() &&
                        ed.getMonth() === d.getMonth() &&
                        ed.getDate() === d.getDate() &&
                        (e.category_name ?? "") === categoryName
                    )
                })
                .reduce((s, e) => s + Number(e.amount ?? 0), 0)

            arr.push({ label, value: total })
        }
        return arr
    }

    const slotChange = (index: number, category: string) => {
        setSlots(prev => {
            const copy = [...prev]
            copy[index] = category
            return copy
        })
    }

    const metricChange = (index: number, m: "total" | "average" | "count") => {
        setMetricTypes(prev => {
            const copy = [...prev]
            copy[index] = m
            return copy
        })
    }

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {slots.map((slotCategory, i) => {
                const cat =
                    categories.find(c => c.name === slotCategory) ??
                    // fallback placeholder color while loading or missing
                    { name: slotCategory, color: "#9ca3af" } // neutral gray

                const data = loading ? [] : chartDataFor(cat.name)

                return (
                    <MetricCardV2
                        key={i}
                        title={cat.name}
                        categoryName={cat.name}
                        categoryColor={cat.color}
                        data={data}
                        loading={loading}
                        subtitle={
                            loading
                                ? "Loading..."
                                : `${data.reduce((s, d) => s + Number(d.value || 0), 0).toLocaleString()} total`
                        }
                        metricType={metricTypes[i]}
                        allCategories={categories.length > 0 ? categories : DEFAULT_ORDER.map(d => ({ name: d, color: "#9ca3af" }))}
                        onCategoryChange={c => slotChange(i, c)}
                        onMetricTypeChange={m => metricChange(i, m as any)}
                    />
                )
            })}
        </div>
    )
}

export default DashboardCategoriesRow
