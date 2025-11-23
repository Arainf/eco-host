"use client"
import { useEffect, useState, useMemo } from "react"
import axios from "axios"
import { toast } from "sonner"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ExpenseNameInput } from '@/components/entrance/expense-name-input';
import { SubcategorySelect } from '@/components/entrance/subcategory-select';

export function EntranceForm({ refreshRecent }: any) {
    const [categories, setCategories] = useState([])
    const [allSubcategories, setAllSubcategories] = useState([])
    const [recent, setRecent] = useState([])

    const today = new Date().toISOString().split("T")[0]

    const [form, setForm] = useState({
        expense_name: "",
        subcategory_id: "",
        subcategory_name: "",
        category_name: "",
        category_color: "",
        description: "",
        amount: "",
        date: today,
        remarks: "",
    })

    // fetch categories + recent
    useEffect(() => {
        axios.get("/data/categories").then(res => setCategories(res.data))
        axios.get("/data/expenses").then(res => setRecent(res.data))
    }, [])

    // flatten category/subcategory structure
    useEffect(() => {
        const flattened = categories.flatMap((c: any) =>
            c.subcategories.map((s: any) => ({
                ...s,
                category_name: c.name,
                category_color: c.color
            }))
        )
        setAllSubcategories(flattened)
    }, [categories])

    const handleChange = (field: string, value: any) =>
        setForm(prev => ({ ...prev, [field]: value }))

    // ⭐ UNIQUE SUGGESTIONS (fix duplicates)
    const uniqueSuggestions = useMemo(() => {
        const map = new Map()
        recent.forEach((r: any) => {
            if (!map.has(r.expense_name)) {
                map.set(r.expense_name, r)
            }
        })
        return Array.from(map.values())
    }, [recent])

    const handleSave = async () => {
        try {
            await axios.post("/data/expenses", {
                expense_name: form.expense_name,
                subcategory_name: form.subcategory_name,
                category_name: form.category_name,
                category_color: form.category_color,
                description: form.description,
                amount: form.amount,
                date: form.date,
                remarks: form.remarks,
            })
            toast.success("Entry saved!")
            refreshRecent()
        } catch {
            toast.error("Failed")
        }
    }

    return (
        <Card className="border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
            <CardHeader>
                <CardTitle className="text-xl">New Expense</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">

                <ExpenseNameInput
                    value={form.expense_name}
                    onChange={(v, suggestion) => {
                        handleChange("expense_name", v)

                        if (suggestion) {
                            handleChange("subcategory_id", suggestion.id)
                            handleChange("subcategory_name", suggestion.name)
                            handleChange("category_name", suggestion.category_name)
                            handleChange("category_color", suggestion.category_color)
                        }
                    }}
                    suggestions={uniqueSuggestions} // ← FIX APPLIED HERE
                />

                <SubcategorySelect
                    allSubcategories={allSubcategories}
                    form={form}
                    setForm={setForm}
                />

                <div>
                    <Label>Description</Label>
                    <Textarea
                        className="mt-1"
                        value={form.description}
                        onChange={e => handleChange("description", e.target.value)}
                    />
                </div>

                <div>
                    <Label>Amount</Label>
                    <Input
                        type="number"
                        value={form.amount}
                        onChange={e => handleChange("amount", e.target.value)}
                    />
                </div>

                <div>
                    <Label>Date</Label>
                    <Input
                        type="date"
                        value={form.date}
                        onChange={e => handleChange("date", e.target.value)}
                    />
                </div>

                <div>
                    <Label>Remarks</Label>
                    <Textarea
                        value={form.remarks}
                        onChange={e => handleChange("remarks", e.target.value)}
                    />
                </div>

                <Button onClick={handleSave} className="w-full">
                    Save Entry
                </Button>
            </CardContent>
        </Card>
    )
}
