"use client"

import AppLayout from "@/layouts/app-layout"
import axios from 'axios';
import { entrance } from "@/routes"
import { Head } from "@inertiajs/react"
import { useEffect, useState } from "react"

import { EntranceForm } from "@/components/entrance/form"
import { CsvImportSection } from "@/components/entrance/csv-import"
import { RecentExpenses } from "@/components/entrance/recent-expenses"

export default function EntrancePage() {
    const [expenses, setExpenses] = useState([])
    const [loadingRecent, setLoadingRecent] = useState(true)

    const fetchRecent = async () => {
        try {
            setLoadingRecent(true)
            const res = await axios.get("/data/expenses")
            setExpenses(res.data || [])
        } finally {
            setLoadingRecent(false)
        }
    }

    useEffect(() => {
        fetchRecent()
    }, [])

    return (
        <AppLayout breadcrumbs={[{ title: "Data Entry", href: entrance().url }]}>
            <Head title="Data Entry" />

            <div className="p-6 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* LEFT: FORM */}
                    <EntranceForm refreshRecent={fetchRecent} />

                    {/* RIGHT: CSV + RECENT */}
                    <div className="space-y-6">
                        <CsvImportSection refreshRecent={fetchRecent} />
                        <RecentExpenses
                            expenses={expenses}
                            loading={loadingRecent}
                        />
                    </div>

                </div>
            </div>
        </AppLayout>
    )
}
