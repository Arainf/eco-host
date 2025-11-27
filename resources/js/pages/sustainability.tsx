"use client"

import { useEffect, useState } from "react"
import axios from "axios"

// Layout + Head
import AppLayout from "@/layouts/app-layout"
import { Head } from "@inertiajs/react"
import { type BreadcrumbItem } from "@/types"

// Components
import KPIRadialStacked from '@/components/sustainability/KPIRadialChart';
import GoalsPanel from "@/components/sustainability/GoalsPanel"
import GoalsList from "@/components/goals/GoalsList"

// UI
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Sustainability", href: "/sustainability" },
]

export default function SustainabilityPage() {
    const [loading, setLoading] = useState(true)
    const [payload, setPayload] = useState<any>(null) // will hold {goals, kpis, meta}
    const [categories, setCategories] = useState<any[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    const load = async () => {
        try {
            setLoading(true)
            const [gRes, cRes] = await Promise.all([
                axios.get("/data/goals"),
                axios.get("/data/categories"),
            ])
            const goalsPayload = gRes.data
            setPayload(goalsPayload)
            setCategories(Array.isArray(cRes.data) ? cRes.data : [])

            // default category to first goal's category or first category
            const defaultCat = goalsPayload?.goals?.[0]?.category_name ?? (cRes.data?.[0]?.name ?? null)
            setSelectedCategory(defaultCat)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load() }, [])

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sustainability" />

            <div className="p-4 w-full h-3/4 mx-auto space-y-6">
                {/* Top bento: KPI (big) + Quick suggestions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        {loading ? (
                            <Card className="p-6"><Skeleton className="h-72" /></Card>
                        ) : (
                            <KPIRadialStacked
                                kpis={payload?.kpis ?? {}}
                                goals={payload?.goals ?? []}
                                selectedCategory={selectedCategory}
                                onSelectCategory={setSelectedCategory}
                                categories={categories}
                            />
                        )}
                    </div>

                    <div>
                        <GoalsList />
                        <GoalsPanel
                            goals={payload?.goals ?? []}
                            categories={categories}
                            loading={loading}
                            onChange={load}
                        />
                    </div>
                </div>

                {/* Goals list */}
                <div>

                </div>
            </div>
        </AppLayout>
    )
}
