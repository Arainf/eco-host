"use client"

import React, { useEffect, useState, useCallback } from "react"
import AppLayout from "@/layouts/app-layout"
import { Head } from "@inertiajs/react"
import { entrance } from "@/routes"
import { BreadcrumbItem } from "@/types"
import axios from "axios"
import { toast } from "sonner"

// import { Grid } from "@/components/ui/grid" // optional helper or just use divs
import ExpenseFilters from "@/components/entrance/ExpenseFilters"
import ExpenseTable from "@/components/entrance/ExpenseTable"
import ExpenseFormModal from "@/components/entrance/ExpenseFormModal"
import CsvImportSection from '@/components/entrance/csv-import';
import ExportCsvButton from "@/components/entrance/ExportCsvButton"
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Data Entry", href: entrance().url },
]

export default function EntrancePage() {
    const [expenses, setExpenses] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [query, setQuery] = useState("")
    const [period, setPeriod] = useState<"week" | "month" | "year">("month")
    const [editing, setEditing] = useState<any | null>(null)
    const [openModal, setOpenModal] = useState(false)
    const [categoryFilter, setCategoryFilter] = useState("")
    const [subcategoryFilter, setSubcategoryFilter] = useState("")

    const load = useCallback(async () => {
        try {
            setLoading(true)
            const [g, c] = await Promise.all([
                axios.get("/data/expenses"),
                axios.get("/data/categories")
            ])
            setExpenses(Array.isArray(g.data) ? g.data : [])
            setCategories(Array.isArray(c.data) ? c.data : [])
        } catch (e) {
            toast.error("Failed to load expenses")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        load()
    }, [load])

    const onCreateClick = () => {
        setEditing(null)
        setOpenModal(true)
    }

    const onEdit = (row: any) => {
        setEditing(row)
        setOpenModal(true)
    }

    const onDelete = async (id: number) => {
        if (!confirm("Delete this expense?")) return
        try {
            await axios.delete(`/data/expenses/${id}`)
            setExpenses((prev) => prev.filter((p) => p.id !== id))
            toast.success("Deleted")
        } catch {
            toast.error("Delete failed")
        }
    }

    // refresh from child after create/import/update
    const refreshTable = async () => {
        await load()
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Entry" />

            <div className="p-6 max-w-[1500px] mx-auto space-y-6">
                <div className="flex items-center justify-between gap-4 w-full">
                    <div className="flex items-center gap-3 flex-2/3">
                        <ExpenseFilters
                            query={query}
                            setQuery={setQuery}
                            period={period}
                            setPeriod={setPeriod}
                            categoryFilter={categoryFilter}
                            setCategoryFilter={setCategoryFilter}
                            subcategoryFilter={subcategoryFilter}
                            setSubcategoryFilter={setSubcategoryFilter}
                            categories={categories}
                        />

                    </div>

                    <div className="flex items-center gap-2 flex-1/3">
                        <Button className="btn" onClick={onCreateClick}>+ Add Expense</Button>
                        <ExportCsvButton expenses={expenses} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* MAIN: table (span 2) */}
                    <div className="lg:col-span-2">
                        <ExpenseTable
                            expenses={expenses}
                            loading={loading}
                            query={query}
                            period={period}
                            categoryFilter={categoryFilter}
                            subcategoryFilter={subcategoryFilter}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />

                    </div>

                    {/* SIDE: import + helper */}
                    <div className="space-y-4">
                        <CsvImportSection refreshRecent={refreshTable} />
                        {/*<div className="p-4 border rounded-md bg-white dark:bg-neutral-900">*/}
                        {/*    <p className="text-sm text-muted-foreground">Sample CSV (download):</p>*/}
                        {/*    <a*/}
                        {/*        className="text-sm text-primary-600 hover:underline"*/}
                        {/*        href="/public/template/template.csv"*/}
                        {/*        // developer note: path from your uploaded file*/}
                        {/*        target="_blank"*/}
                        {/*        rel="noreferrer"*/}
                        {/*    >*/}
                        {/*        /mnt/data/previous_month_expenses.csv*/}
                        {/*    </a>*/}
                        {/*</div>*/}
                    </div>
                </div>

                {openModal && (
                    <ExpenseFormModal
                        open={openModal}
                        onClose={() => setOpenModal(false)}
                        onSaved={() => {
                            setOpenModal(false)
                            refreshTable()
                        }}
                        editing={editing}
                    />
                )}
            </div>
        </AppLayout>
    )
}
