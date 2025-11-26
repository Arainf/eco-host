"use client"

import { useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Category } from "./types"

export default function GoalCreateDialog({
                                             categories,
                                             onSuccess,
                                         }: {
    categories: Category[]
    onSuccess: () => void
}) {
    const [open, setOpen] = useState(false)
    const [form, setForm] = useState({
        category_name: "",
        target_pct: "",
        deadline: "",
        notes: "",
    })

    const set = (field: string, value: any) =>
        setForm((prev) => ({ ...prev, [field]: value }))

    const save = async () => {
        try {
            await axios.post("/data/goals", form)
            toast.success("Goal created")
            setOpen(false)
            onSuccess()
        } catch {
            toast.error("Failed")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add Goal</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Sustainability Goal</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label>Category</Label>
                        <select
                            className="w-full mt-1 p-2 border rounded bg-neutral-100 dark:bg-neutral-800"
                            value={form.category_name}
                            onChange={(e) => set("category_name", e.target.value)}
                        >
                            <option value="">Select category</option>
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
                            value={form.deadline}
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

                    <Button onClick={save} className="w-full">
                        Save Goal
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
