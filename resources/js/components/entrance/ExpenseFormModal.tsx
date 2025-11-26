"use client"
import React, { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"

import ExpenseForm from "@/components/entrance/form"
import axios from "axios"
import { toast } from "sonner"

export default function ExpenseFormDialog({
                                              open,
                                              onClose,
                                              onSaved,
                                              editing,
                                          }: any) {
    const [categories, setCategories] = useState([])

    useEffect(() => {
        axios.get("/data/categories")
            .then((r) => setCategories(Array.isArray(r.data) ? r.data : []))
            .catch(() => setCategories([]))
    }, [])

    const handleSave = async (payload: any) => {
        try {
            if (editing) {
                await axios.put(`/data/expenses/${editing.id}`, payload)
                toast.success("Expense updated successfully!")
            } else {
                await axios.post("/data/expenses", payload)
                toast.success("Expense created!")
            }

            onSaved?.()
            onClose?.()
        } catch (err) {
            toast.error("Failed to save expense.")
        }
    }

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>
                        {editing ? "Edit Expense" : "New Expense"}
                    </DialogTitle>
                    <DialogDescription>
                        Fill out the fields below to save your expense.
                    </DialogDescription>
                </DialogHeader>

                <ExpenseForm
                    categories={categories}
                    initial={editing ?? undefined}
                    onSave={handleSave}
                    onCancel={onClose}
                />

                <DialogFooter>
                    <p className="text-xs text-muted-foreground">
                        Powered by ECOHOST
                    </p>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
