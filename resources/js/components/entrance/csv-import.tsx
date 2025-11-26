"use client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Papa from "papaparse"
import axios from "axios"
import { toast } from "sonner"
import { useState } from "react"
import { Loader2 } from "lucide-react"

export default function CsvImportSection({ refreshRecent }: any) {
    const [loading, setLoading] = useState(false)
    const [parsed, setParsed] = useState<any[]>([])
    const [validRows, setValidRows] = useState<any[]>([])
    const [errors, setErrors] = useState<string[]>([])
    const [warnings, setWarnings] = useState<string[]>([])

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

    const importCsv = (e: any) => {
        const f = e.target.files[0]
        if (!f) return

        setLoading(true)
        setErrors([])
        setWarnings([])
        setParsed([])
        setValidRows([])

        Papa.parse(f, {
            header: true,
            skipEmptyLines: true,
            complete: async (res: any) => {
                const rows = res.data
                setParsed(rows)

                const cols = Object.keys(rows[0] || {})
                const missing = REQUIRED_COLUMNS.filter(c => !cols.includes(c))

                if (missing.length) {
                    setErrors(prev => [...prev, `Missing required columns: ${missing.join(", ")}`])
                    setLoading(false)
                    return
                }

                // validate rows
                const valids: any[] = []
                let invalidCount = 0

                rows.forEach((r: any, idx: number) => {
                    const rowErrors = []

                    if (!r.expense_name) rowErrors.push("Missing expense_name")
                    if (!r.subcategory_name) rowErrors.push("Missing subcategory_name")

                    if (r.amount && isNaN(Number(r.amount))) {
                        rowErrors.push("Amount must be numeric")
                    }

                    if (r.date && isNaN(new Date(r.date).getTime())) {
                        rowErrors.push("Invalid date format (must be YYYY-MM-DD)")
                    }

                    if (rowErrors.length) {
                        invalidCount++
                    } else {
                        valids.push(r)
                    }
                })

                if (invalidCount > 0) {
                    setWarnings(prev => [...prev, `${invalidCount} row(s) were skipped due to errors.`])
                }

                setValidRows(valids)
                setLoading(false)

                e.target.value = ""
            },
            error: () => {
                toast.error("Failed to read CSV")
                setLoading(false)
            },
        })
    }

    const confirmImport = async () => {
        try {
            setLoading(true)
            await axios.post("/data/expenses/import", { rows: validRows })
            toast.success(`Successfully imported ${validRows.length} row(s)`)
            refreshRecent?.()

            setParsed([])
            setValidRows([])
            setErrors([])
            setWarnings([])
        } catch (err) {
            toast.error("Import failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Import CSV</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* UPLOAD INPUT */}
                <Input type="file" accept=".csv" onChange={importCsv} disabled={loading} />

                {loading && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="animate-spin" /> Processing…
                    </div>
                )}

                {/* ERRORS */}
                {errors.length > 0 && (
                    <div className="p-3 text-sm text-red-600 bg-red-100 rounded">
                        <strong>Errors:</strong>
                        <ul className="ml-4 list-disc">
                            {errors.map((e, i) => <li key={i}>{e}</li>)}
                        </ul>
                    </div>
                )}

                {/* WARNINGS */}
                {warnings.length > 0 && (
                    <div className="p-3 text-sm text-yellow-700 bg-yellow-100 rounded">
                        <strong>Warnings:</strong>
                        <ul className="ml-4 list-disc">
                            {warnings.map((w, i) => <li key={i}>{w}</li>)}
                        </ul>
                    </div>
                )}

                {/* VALIDATION SUMMARY */}
                {parsed.length > 0 && validRows.length > 0 && (
                    <div className="p-3 text-sm bg-neutral-100 dark:bg-neutral-800 rounded">
                        Loaded: <strong>{parsed.length}</strong> rows
                        <br />
                        Valid to import: <strong>{validRows.length}</strong>
                    </div>
                )}

                {/* CONFIRM BUTTON */}
                {validRows.length > 0 && (
                    <Button
                        className="w-full"
                        disabled={loading}
                        onClick={confirmImport}
                    >
                        Import {validRows.length} row(s)
                    </Button>
                )}

                <p className="text-xs text-neutral-500">
                    Required: expense_name, subcategory_name, category_name, category_color, description, amount, date, remarks
                </p>
            </CardContent>
        </Card>
    )
}
