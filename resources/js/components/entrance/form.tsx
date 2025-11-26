"use client"
import React, { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { format } from "date-fns"

export default function ExpenseForm({
                                        categories = [],
                                        onSave,
                                        initial,
                                        onCancel,
                                    }: any) {
    const today = new Date().toISOString().split("T")[0]
    const [form, setForm] = useState({
        expense_name: "",
        subcategory_name: "",
        category_name: "",
        category_color: "",
        description: "",
        amount: "",
        date: today,
        remarks: "",
    })

    useEffect(() => {
        if (initial) {
            setForm({
                expense_name: initial.expense_name || "",
                subcategory_name: initial.subcategory_name || "",
                category_name: initial.category_name || "",
                category_color: initial.category_color || "",
                description: initial.description || "",
                amount: initial.amount || "",
                date: initial.date ? format(new Date(initial.date), "yyyy-MM-dd") : today,
                remarks: initial.remarks || "",
            })
        }
    }, [initial])

    const allSub = categories.flatMap((c: any) =>
        (c.subcategories || []).map((s: any) => ({
            id: s.id,
            name: s.name,
            category_name: c.name,
            category_color: c.color,
        }))
    )

    const onSubChange = (val: string) => {
        const sub = allSub.find((a) => a.id.toString() === val)
        if (sub) {
            setForm((p) => ({ ...p, subcategory_name: sub.name, category_name: sub.category_name, category_color: sub.category_color }))
        } else {
            setForm((p) => ({ ...p, subcategory_name: "", category_name: "", category_color: "" }))
        }
    }

    const handleSave = () => {
        if (!form.expense_name || !form.subcategory_name || !form.amount) {
            toast.error("Name, subcategory and amount required")
            return
        }
        onSave(form)
    }

    return (
        <div className="space-y-3">
            <div>
                <Label>Expense Name</Label>
                <Input value={form.expense_name} onChange={(e) => setForm({ ...form, expense_name: e.target.value })} />
            </div>

            <div>
                <Label>Subcategory</Label>
                <Select value={allSub.find(s => s.name === form.subcategory_name)?.id?.toString() ?? ""} onValueChange={onSubChange}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select subcategory" /></SelectTrigger>
                    <SelectContent>
                        {allSub.map(s => (
                            <SelectItem key={s.id} value={s.id.toString()}>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.category_color }} />
                                    <div>{s.name} <small className="text-xs text-muted-foreground">({s.category_name})</small></div>
                                </div>
                            </SelectItem>
                        ))}
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label>Amount</Label>
                <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            </div>

            <div>
                <Label>Date</Label>
                <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>

            <div>
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>

            <div>
                <Label>Remarks</Label>
                <Textarea value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} />
            </div>

            <div className="flex gap-2 w-full">
                <Button onClick={handleSave} className="w-1/2" >Save</Button>
                <Button variant="outline" onClick={onCancel} className="w-1/2">Cancel</Button>
            </div>
        </div>
    )
}
