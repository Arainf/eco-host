"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import GoalCreateDialog from '@/components/goals/GoalCreateDialog';
import GoalItem from '@/components/goals/GoalItem';
import { Goal, Category } from "./types"

export default function GoalsList() {
    const [goals, setGoals] = useState<Goal[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)

    const load = async () => {
        try {
            setLoading(true)

            const [g, c] = await Promise.all([
                axios.get("/data/goals"),
                axios.get("/data/categories")
            ])

            // FIXED — extract the actual goals array
            const raw = g.data
            setGoals(Array.isArray(raw.goals) ? raw.goals : [])

            setCategories(Array.isArray(c.data) ? c.data : [])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load()
    }, [])

    return (
        <Card className="p-4">
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Sustainability Goals</CardTitle>
                <GoalCreateDialog categories={categories} onSuccess={load} />
            </CardHeader>

            <CardContent className="space-y-4">
                {loading ? (
                    [...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full rounded-lg" />
                    ))
                ) : goals.length === 0 ? (
                    <p className="text-sm text-neutral-500">
                        No sustainability goals yet — create your first goal.
                    </p>
                ) : (
                    goals.map((g) => (
                        <GoalItem
                            key={g.id}
                            goal={g}
                            categories={categories}
                            onChanged={load}
                        />
                    ))
                )}
            </CardContent>
        </Card>
    )
}
