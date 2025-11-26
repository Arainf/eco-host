"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

/**
 * Small card to set reduction target for a category.
 * Uses /data/goals (POST/PUT). If not present on backend, shows warning.
 */

export function GoalsTargetCard() {
    const [categories, setCategories] = useState<any[]>([])
    const [form, setForm] = useState({
        category: "",
        targetPct: "",
        deadline: "",
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        axios.get("/data/categories").then((res) => setCategories(res.data || []))
        // default deadline = 1 month ahead
        const d = new Date()
        d.setMonth(d.getMonth() + 1)
        setForm((f) => ({ ...f, deadline: d.toISOString().split("T")[0] }))
    }, [])

    const save = async () => {
        if (!form.category || !form.targetPct) {
            toast.error("Please choose category and target")
            return
        }
        setLoading(true)
        try {
            // POST to /data/goals - create or update logic depends on backend
            await axios.post("/data/goals", {
                category: form.category,
                target_pct: Number(form.targetPct),
                deadline: form.deadline,
            })
            toast.success("Target saved")
        } catch (err: any) {
            // If endpoint missing, show helpful message
            toast.error("Failed to save target. Ensure /data/goals exists on server.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Set Reduction Target</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
                <div>
                    <Label>Category</Label>
                    <Select onValueChange={(v) => setForm((s) => ({ ...s, category: v }))} value={form.category}>
                        <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((c) => (
                                <SelectItem key={c.id} value={c.name}>
                                    {c.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Target reduction (%)</Label>
                    <Input
                        type="number"
                        min={0}
                        max={100}
                        value={form.targetPct}
                        onChange={(e) => setForm((s) => ({ ...s, targetPct: e.target.value }))}
                        className="mt-1"
                        placeholder="e.g. 15"
                    />
                </div>

                <div>
                    <Label>Deadline</Label>
                    <Input type="date" value={form.deadline} onChange={(e) => setForm((s) => ({ ...s, deadline: e.target.value }))} />
                </div>

                <Button onClick={save} className="w-full" disabled={loading}>
                    {loading ? "Saving…" : "Save Target"}
                </Button>
            </CardContent>
        </Card>
    )
}
