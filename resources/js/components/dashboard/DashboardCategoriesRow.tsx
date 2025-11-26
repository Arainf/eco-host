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

export default function DashboardCategoriesRow({
                                                   categories = [],
                                                   expenses = [],
                                                   loading = false,
                                               }: {
    categories: { name: string; color: string }[]
    expenses: Expense[]
    loading?: boolean
}) {

    // Default 3 cards
    const DEFAULT_ORDER = [
        "Energy Consumption",
        "Waste Management",
        "Water Usage",
    ]

    const [slots, setSlots] = useState<string[]>(DEFAULT_ORDER)

    // When categories load → update default slots if needed
    useEffect(() => {
        if (!categories.length) return

        setSlots(prev =>
            prev.map(def => {
                const match = categories.find(c => c.name === def)
                return match ? match.name : def
            })
        )
    }, [categories])

    /** ------------------------------------------------------------------
     * Build monthly dataset per category
     * monthOffset:
     *    0 = this month
     *   -1 = previous month
     * ------------------------------------------------------------------ */
    function buildMonthlyData(expenses: any[], categoryName: string, monthOffset = 0) {
        const now = new Date();
        now.setMonth(now.getMonth() + monthOffset);

        const year = now.getFullYear();
        const month = now.getMonth();

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const arr: any[] = [];

        for (let d = 1; d <= daysInMonth; d++) {
            arr.push({ label: `${month + 1}/${d}`, value: 0 });
        }

        const findIndex = (label: string) => arr.findIndex(a => a.label === label);

        expenses
            .filter(e => e.category_name === categoryName)
            .forEach(e => {
                const dt = new Date(e.date);
                if (dt.getMonth() === month && dt.getFullYear() === year) {
                    const label = `${dt.getMonth() + 1}/${dt.getDate()}`;
                    const idx = findIndex(label);
                    if (idx !== -1) arr[idx].value += Number(e.amount || 0);
                }
            });

        return arr;
    }

    // Switch category for a card
    const slotChange = (index: number, newCategory: string) => {
        setSlots(prev => {
            const updated = [...prev]
            updated[index] = newCategory
            return updated
        })
    }

    return (
        <div className="grid h-[25%] gap-4 md:grid-cols-3">
            {slots.map((categoryName, i) => {
                const cat =
                    categories.find(c => c.name === categoryName) ??
                    { name: categoryName, color: "#9ca3af" }

                // Build monthly datasets
                const thisMonth = buildMonthlyData(expenses, cat.name, 0)
                const prevMonth = buildMonthlyData(expenses, cat.name, -1)

                return (
                    <MetricCardV2
                        key={i}
                        title={cat.name}
                        categoryName={cat.name}
                        categoryColor={cat.color}
                        data={thisMonth}
                        previousData={prevMonth}   // ← FIXED
                        loading={loading}
                        allCategories={categories}
                        onCategoryChange={(c) => slotChange(i, c)}
                    />
                )
            })}
        </div>
    )
}
