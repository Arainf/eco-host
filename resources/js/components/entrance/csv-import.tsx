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

    // Coming Soon switch (turn false later)
    const is_comingSoon = true

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

    const handleFile = (e: any) => {
        if (is_comingSoon) return            // Disable feature
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

                const missing = REQUIRED_COLUMNS.filter(c => !columns.includes(c))
                if (missing.length > 0) {
                    toast.error(`Missing column(s): ${missing.join(", ")}`)
                    setLoading(false)
                    return
                }

                const valid: any[] = []
                const invalid: any[] = []

                rows.forEach((row: any) => {
                    const hasMissing =
                        REQUIRED_COLUMNS.some(col => !row[col] || row[col] === "")

                    const amountInvalid = isNaN(Number(row.amount))
                    const dateInvalid = isNaN(new Date(row.date).getTime())

                    if (hasMissing || amountInvalid || dateInvalid) {
                        invalid.push(row)
                    } else {
                        valid.push(row)
                    }
                })

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

    const confirmImport = async () => {
        if (is_comingSoon) return            // Disable feature

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

        setPendingImport([])
        setSkipped([])
        setShowSummary(false)
        setLoading(false)
    }

    return (
        <Card className="relative">

            {/* Coming Soon Overlay */}
            {is_comingSoon && (
                <div className="absolute inset-0 bg-white/80 dark:bg-black/70 backdrop-blur-sm z-10
                                flex flex-col items-center justify-center rounded-md">
                    <p className="text-lg font-semibold">CSV Import</p>
                    <p className="text-sm text-neutral-500">Coming Soon 🚧</p>
                </div>
            )}

            {loading && (
                <div className="absolute inset-0 bg-white/70 dark:bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center rounded-md z-20">
                    <Loader2 className="animate-spin h-6 w-6 mb-2" />
                    <p className="text-sm">Processing CSV…</p>
                </div>
            )}

            <CardHeader>
                <CardTitle>Import CSV</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">

                <Input
                    type="file"
                    accept=".csv"
                    onChange={handleFile}
                    disabled={loading || is_comingSoon}
                    placeholder={is_comingSoon ? "Coming Soon..." : ""}
                />

                <p className="text-xs text-neutral-500">
                    Required columns: expense_name, subcategory_name, category_name, category_color,
                    description, amount, date, remarks
                </p>

                {showSummary && (
                    <div className={`rounded-md border p-4 bg-neutral-50 dark:bg-neutral-900 mt-4 space-y-3 ${is_comingSoon ? "opacity-50" : ""}`}>

                        <h3 className="font-semibold text-sm">CSV Summary</h3>

                        <p className="text-sm">
                            <span className="font-semibold">{pendingImport.length}</span> valid row(s).
                        </p>

                        {skipped.length > 0 && (
                            <p className="text-sm text-orange-500">
                                ⚠ {skipped.length} row(s) skipped.
                            </p>
                        )}

                        <Button
                            onClick={confirmImport}
                            className="w-full mt-2"
                            disabled={is_comingSoon}
                        >
                            {is_comingSoon ? "Coming Soon 🚧" : "Import Now"}
                        </Button>
                    </div>
                )}

            </CardContent>
        </Card>
    )
}
