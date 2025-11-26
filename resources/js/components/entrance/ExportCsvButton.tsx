"use client"
import React from "react"
import { Button } from "@/components/ui/button"

function toCSV(rows: any[]) {
    if (!rows || rows.length === 0) return ""
    const keys = Object.keys(rows[0])
    const lines = [keys.join(",")]
    rows.forEach(r => {
        const vals = keys.map(k => {
            const v = r[k] ?? ""
            // escape quotes
            return `"${String(v).replace(/"/g, '""')}"`
        })
        lines.push(vals.join(","))
    })
    return lines.join("\n")
}

export default function ExportCsvButton({ expenses = [] }: any) {
    const exportNow = () => {
        const csv = toCSV(expenses)
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `expenses_export_${new Date().toISOString().slice(0,10)}.csv`
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="flex items-center gap-2">
            <Button size="sm" onClick={exportNow}>Export CSV</Button>
            {/* sample file path from your uploaded files (dev note): */}
        </div>
    )
}
