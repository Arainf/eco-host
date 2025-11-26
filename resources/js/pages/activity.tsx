// resources/js/components/activity/ActivityPage.tsx
"use client"
import React, { useEffect, useState } from "react"
import axios from "axios"
import AppLayout from "@/layouts/app-layout"
import { Head } from "@inertiajs/react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import ActivityTable from '@/components/activity/ActivityTable';

export default function ActivityPage() {
    const [loading, setLoading] = useState(true)
    const [logs, setLogs] = useState<any[]>([])
    const [query, setQuery] = useState("")
    const [limit, setLimit] = useState(50)

    const load = async (opts = { limit: 50 }) => {
        try {
            setLoading(true)
            const res = await axios.get("/data/activity", { params: { limit: opts.limit } })
            setLogs(Array.isArray(res.data) ? res.data : [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load({ limit }) }, [limit])

    return (
        <AppLayout breadcrumbs={[{ title: "Activity Log", href: "/activity" }]}>
            <Head title="Activity Log" />
            <div className="p-4 max-w-7xl mx-auto space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Activity Log</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Record of edits, deletions and creations. Each entry shows a readable summary — expand any row to view full JSON.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        {loading ? (
                            <div className="space-y-3">
                                <Skeleton className="h-8 w-1/3" />
                                <Skeleton className="h-48 w-full" />
                            </div>
                        ) : (
                            <ActivityTable
                                logs={logs}
                                query={query}
                                setQuery={setQuery}
                                onLoadMore={() => setLimit(prev => prev + 50)}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}
