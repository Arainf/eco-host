"use client"
import { Button } from "@/components/ui/button"

export default function PdfExportButton() {
    return (
        <Button onClick={() => window.open("/reports/export", "_blank")}>
            Export PDF
        </Button>
    )
}
