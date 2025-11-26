"use client"

import { useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Category, Goal } from "./types"
import { Pencil } from "lucide-react"

export default function GoalEditDialog({
                                           goal,
                                           categories,
                                           onSuccess,
                                       }: {
    goal: Goal
    categories: Category[]
    onSuccess: () => void
}) {
    const [open, setOpen] = useState(false)
    const [form, setForm] = useState({ ...goal })

    const set = (f: string, v: any) =>
        setForm((prev) => ({ ...prev, [f]: v }))

    const update = async () => {
        try {
            await axios.put(`/data/goals/${goal.id}`, form)
            toast.success("Goal updated")
            setOpen(false)
            onSuccess()
        } catch {
            toast.error("Failed")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Pencil className="w-4 h-4" />
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Goal</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label>Category</Label>
                        <select
                            className="w-full mt-1 p-2 border rounded bg-neutral-100 dark:bg-neutral-800"
                            value={form.category_name}
                            onChange={(e) => set("category_name", e.target.value)}
                        >
                            {categories.map((c) => (
                                <option key={c.id} value={c.name}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <Label>Target Reduction (%)</Label>
                        <Input
                            type="number"
                            value={form.target_pct}
                            onChange={(e) => set("target_pct", e.target.value)}
                        />
                    </div>

                    <div>
                        <Label>Deadline</Label>
                        <Input
                            type="date"
                            value={form.deadeline}
                            onChange={(e) => set("deadline", e.target.value)}
                        />
                    </div>

                    <div>
                        <Label>Notes</Label>
                        <Textarea
                            value={form.notes}
                            onChange={(e) => set("notes", e.target.value)}
                        />
                    </div>

                    <Button onClick={update} className="w-full">
                        Save Changes
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
