"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export function ExpenseNameInput({ value, onChange, suggestions }: any) {
    const [show, setShow] = useState(false)
    const [list, setList] = useState<any[]>([])

    function filter(v: string) {
        onChange(v)

        if (!v.trim()) {
            setShow(false)
            return
        }

        const found = suggestions.filter((s: any) =>
            String(s.expense_name).toLowerCase().includes(v.toLowerCase())
        )

        setList(found)
        setShow(found.length > 0)
    }

    return (
        <div className="relative">
            <Label>Expense Name</Label>
            <Input
                className="mt-1"
                placeholder="Ex. Electricity Bill"
                value={value}
                onChange={(e) => filter(e.target.value)}
            />

            {show && (
                <div className="absolute mt-1 z-20 w-full bg-white dark:bg-neutral-800 border rounded shadow">
                    {list.map((item: any) => (
                        <div
                            key={item.id}
                            className="px-3 py-2 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700"
                            onClick={() =>
                                onChange(
                                    item.expense_name,
                                    item // send subcategory suggestion
                                )
                            }
                        >
                            {item.expense_name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
