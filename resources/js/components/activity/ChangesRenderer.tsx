// resources/js/components/activity/ChangesRenderer.tsx
"use client"
import React from "react"

function prettyFieldName(key: string) {
    return key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
}

export default function ChangesRenderer({ changes }: { changes: any }) {
    if (!changes) return <div className="text-sm text-muted-foreground">No details</div>

    // CREATED
    if (changes.new && !changes.old) {
        const n = changes.new
        return (
            <div className="text-sm">
                <div><strong>{n.expense_name ?? n.name ?? "Item Created"}</strong></div>
                <div className="text-xs text-muted-foreground">
                    {n.category_name ? `Category: ${n.category_name}` : null}
                    {n.amount ? ` • ₱${Number(n.amount).toFixed(2)}` : null}
                </div>
            </div>
        )
    }

    // DELETED
    if (changes.deleted) {
        const d = changes.deleted
        return (
            <div className="text-sm">
                <div><strong className="line-through text-red-600">{d.expense_name ?? d.name ?? "Deleted"}</strong></div>
                <div className="text-xs text-muted-foreground">Removed</div>
            </div>
        )
    }

    // UPDATED
    if (changes.old && changes.new) {
        const old = changes.old
        const n = changes.new
        // list changed fields
        const changed = Object.keys(n).filter(k => {
            const a = (old[k] ?? "") + ""
            const b = (n[k] ?? "") + ""
            return a !== b
        }).slice(0, 4) // show top 4 changes
        if (changed.length === 0) return <div className="text-sm text-muted-foreground">No visible changes</div>

        return (
            <div className="text-sm space-y-1">
                {changed.map((k) => (
                    <div key={k} className="flex items-baseline gap-2">
                        <div className="text-xs text-muted-foreground w-32">{prettyFieldName(k)}</div>
                        <div className="text-xs line-through text-red-600">{String(old[k] ?? "—")}</div>
                        <div className="text-xs text-green-600">→ {String(n[k] ?? "—")}</div>
                    </div>
                ))}
                {Object.keys(n).length > 4 && <div className="text-xs text-muted-foreground">…</div>}
            </div>
        )
    }

    // fallback show summarized key/value
    return <div className="text-sm text-muted-foreground">Changes available — expand to view.</div>
}
