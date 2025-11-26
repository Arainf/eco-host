"use client"

import axios from "axios"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import { useState } from "react"

export default function GoalDeleteDialog({
                                             id,
                                             onSuccess,
                                         }: {
    id: number
    onSuccess: () => void
}) {
    const [open, setOpen] = useState(false)

    const remove = async () => {
        try {
            await axios.delete(`/data/goals/${id}`)
            toast.success("Goal removed")
            setOpen(false)
            onSuccess()
        } catch {
            toast.error("Failed")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-red-500">
                    <Trash className="w-4 h-4" />
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Goal?</DialogTitle>
                </DialogHeader>

                <p className="text-sm">
                    This action cannot be undone.
                </p>

                <div className="flex gap-2 justify-end mt-4">
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={remove}>Delete</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
