"use client"
import React, { useMemo } from "react"
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableCell,
    TableBody,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"

export default function ExpenseTable({
                                         expenses = [],
                                         loading = false,
                                         query = "",
                                         period = "month",
                                         categoryFilter = "",
                                         subcategoryFilter = "",
                                         onEdit,
                                         onDelete,
                                     }: any) {

    const filtered = useMemo(() => {
        const q = (query || "").toLowerCase()
        const now = new Date()

        function inRange(dStr: string) {
            if (!dStr) return false
            const d = new Date(dStr)

            if (period === "week") {
                const start = new Date()
                start.setDate(now.getDate() - 7)
                return d >= start && d <= now
            }
            if (period === "month") {
                return (
                    d.getMonth() === now.getMonth() &&
                    d.getFullYear() === now.getFullYear()
                )
            }
            if (period === "year") {
                return d.getFullYear() === now.getFullYear()
            }
            return true
        }

        return expenses.filter((e: any) => {

            // SEARCH FILTER
            if (q) {
                const hay = `${e.expense_name} ${e.category_name} ${e.subcategory_name} ${e.description} ${e.remarks}`.toLowerCase()
                if (!hay.includes(q)) return false
            }

            // DATE FILTER
            if (!inRange(e.date)) return false

            // CATEGORY FILTER
            if (categoryFilter && e.category_name !== categoryFilter) return false

            // SUBCATEGORY FILTER
            return !(subcategoryFilter && e.subcategory_name !== subcategoryFilter);


        })
    }, [expenses, query, period, categoryFilter, subcategoryFilter])

    if (loading) {
        return (
            <div className="rounded border p-4">
                <Skeleton className="h-8 w-full mb-2" />
                <Skeleton className="h-48 w-full" />
            </div>
        )
    }

    return (
        <div className="rounded border bg-white dark:bg-neutral-900 p-2 max-h-[70vh] overflow-hidden flex flex-col">

            {/* Sticky Header */}
            <div className="border-b bg-white dark:bg-neutral-900 sticky top-0 z-10">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[20%]">Expense</TableHead>
                            <TableHead className="w-[20%]" >Category</TableHead>
                            <TableHead className="w-[18%]">Subcategory</TableHead>
                            <TableHead className="w-[15%]">Amount</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                </Table>
            </div>

            {/* Scrollable rows */}
            <div className="overflow-y-auto flex-1 custom-scrollbar">
                <Table>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center p-6">
                                    No data
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((r: any) => (
                                <TableRow key={r.id}>
                                    <TableCell width="20%">
                                        <div className="font-small">{r.expense_name}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {r.description}
                                        </div>
                                    </TableCell>

                                    <TableCell width="20%">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: r.category_color }}
                                            />
                                            {r.category_name}
                                        </div>
                                    </TableCell>

                                    <TableCell width="18%">{r.subcategory_name}</TableCell>

                                    <TableCell width="15%">
                                        ₱{Number(r.amount).toFixed(2)}
                                    </TableCell>

                                    <TableCell>
                                        {r.date
                                            ? format(new Date(r.date), "yyyy-MM-dd")
                                            : "-"}
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => onEdit(r)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => onDelete(r.id)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

        </div>
    )
}
