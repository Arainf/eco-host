"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import TrendAreaChart from '@/components/dashboard/charts/TrendChart';// or the path you used


/**
 * Lightweight wrapper that builds 30-day data for spend and count per day
 */

export function SustainabilityTrend() {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any[]>([])

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

    return (
        <div>
            <TrendAreaChart data={data} loading={loading} title="30-day Spending Trend" />
        </div>
    )
}
