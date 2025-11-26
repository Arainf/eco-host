// resources/js/components/sustainability/GoalSetupDialog.tsx
"use client"

import React, { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function GoalSetupDialog({ open, onOpenChange, initial = null, onSave }: any) {
    const [name, setName] = useState("")
    const [targetPercent, setTargetPercent] = useState(15)
    const [color, setColor] = useState("#10b981")

    useEffect(() => {
        if (initial) {
            setName(initial.name || "")
            setTargetPercent(initial.targetPercent ?? 15)
            setColor(initial.color || "#10b981")
        } else {
            setName("")
            setTargetPercent(15)
            setColor("#10b981")
        }
    }, [initial])

    const save = () => {
        if (!name.trim()) return alert("Please name the goal")
        onSave?.({ id: initial?.id, name: name.trim(), targetPercent: Number(targetPercent), color })
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{initial ? "Edit Goal" : "Create Goal"}</DialogTitle>
                </DialogHeader>

                <div className="space-y-3">
                    <div>
                        <Label>Goal name</Label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Energy Consumption" />
                    </div>

                    <div>
                        <Label>Target reduction (%)</Label>
                        <Input type="number" value={targetPercent} onChange={(e) => setTargetPercent(Number(e.target.value))} />
                    </div>

                    <div>
                        <Label>Color</Label>
                        <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
                    </div>
                </div>

                <DialogFooter className="mt-4 flex gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={save}>{initial ? "Save" : "Create"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
