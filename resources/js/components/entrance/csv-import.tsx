"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Papa from "papaparse"
import axios from "axios"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export function CsvImportSection({ refreshRecent }: any) {

    const [loading, setLoading] = useState(false)
    const [pendingImport, setPendingImport] = useState<any[]>([])
    const [skipped, setSkipped] = useState<any[]>([])
    const [showSummary, setShowSummary] = useState(false)

    const REQUIRED_COLUMNS = [
        "expense_name",
        "subcategory_name",
        "category_name",
        "category_color",
        "description",
        "amount",
        "date",
        "remarks",
    ]

    // ---------------------------------------------
    // STEP 1 — FILE UPLOAD & PRE-CHECK (NO IMPORT)
    // ---------------------------------------------
    const handleFile = (e: any) => {
        const file = e.target.files[0]
        if (!file) return

        setLoading(true)
        setShowSummary(false)

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,

            complete: async (result: any) => {
                const rows = result.data
                const columns = Object.keys(rows[0] || {})

                // 1. Missing Columns
                const missing = REQUIRED_COLUMNS.filter(c => !columns.includes(c))
                if (missing.length > 0) {
                    toast.error(`Missing column(s): ${missing.join(", ")}`)
                    setLoading(false)
                    return
                }

                // 2. Prepare Arrays
                const valid: any[] = []
                const invalid: any[] = []

                // Validate but DO NOT STOP
                rows.forEach((row: any) => {
                    const hasMissing =
                        REQUIRED_COLUMNS.some(col => !row[col] || row[col] === "")

                    const amountInvalid =
                        isNaN(Number(row.amount))

                    const dateInvalid =
                        isNaN(new Date(row.date).getTime())

                    if (hasMissing || amountInvalid || dateInvalid) {
                        invalid.push(row)
                    } else {
                        valid.push(row)
                    }
                })

                // 3. Check subcategory validity (soft)
                let categories = []
                try {
                    const res = await axios.get("/data/categories")
                    categories = res.data
                } catch {
                    toast.error("Cannot load categories.")
                    setLoading(false)
                    return
                }

                const subMap = new Map()
                categories.forEach((cat: any) => {
                    cat.subcategories.forEach((sub: any) => {
                        subMap.set(sub.name.toLowerCase(), true)
                    })
                })

                const filteredValid: any[] = []
                const invalidSubs: any[] = []

                valid.forEach(row => {
                    if (subMap.has(row.subcategory_name.toLowerCase())) {
                        filteredValid.push(row)
                    } else {
                        invalidSubs.push(row)
                    }
                })

                setPendingImport(filteredValid)
                setSkipped([...invalid, ...invalidSubs])
                setShowSummary(true)
                setLoading(false)
            },

            error: () => {
                toast.error("Error reading CSV file.")
                setLoading(false)
            },
        })
    }

    // -------------------------------------------------
    // STEP 2 — CONFIRMED IMPORT
    // -------------------------------------------------
    const confirmImport = async () => {
        if (pendingImport.length === 0) {
            toast.error("No valid rows to import.")
            return
        }

        setLoading(true)

        try {
            await axios.post("/data/expenses/import", {
                rows: pendingImport
            })
            toast.success(`Imported ${pendingImport.length} rows!`)
            refreshRecent()
        } catch {
            toast.error("Import failed.")
        }

        // reset
        setPendingImport([])
        setSkipped([])
        setShowSummary(false)
        setLoading(false)
    }

    return (
        <Card className="relative">
            {loading && (
                <div className="absolute inset-0 bg-white/70 dark:bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center rounded-md z-10">
                    <Loader2 className="animate-spin h-6 w-6 mb-2" />
                    <p className="text-sm">Processing CSV…</p>
                </div>
            )}

            <CardHeader>
                <CardTitle>Import CSV</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">

                {/* Upload */}
                <Input type="file" accept=".csv" onChange={handleFile} disabled={loading} />

                <p className="text-xs text-neutral-500">
                    Required columns: expense_name, subcategory_name, category_name, category_color, description, amount, date, remarks
                </p>

                {/* SUMMARY PANEL */}
                {showSummary && (
                    <div className="rounded-md border p-4 bg-neutral-50 dark:bg-neutral-900 mt-4 space-y-3">
                        <h3 className="font-semibold text-sm">CSV Summary</h3>

                        <p className="text-sm">
                            <span className="font-semibold">{pendingImport.length}</span> valid row(s) will be imported.
                        </p>

                        {skipped.length > 0 && (
                            <p className="text-sm text-orange-500">
                                ⚠ {skipped.length} row(s) skipped due to missing or invalid data.
                            </p>
                        )}

                        <Button onClick={confirmImport} className="w-full mt-2">
                            Import Now
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
