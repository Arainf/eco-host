// resources/js/components/activity/RawJsonDrawer.tsx
"use client"
import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function RawJsonDrawer({ log, onClose }: any) {
    return (
        <Dialog open={!!log} onOpenChange={(v) => { if (!v) onClose?.() }}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Activity JSON</DialogTitle>
                </DialogHeader>

                {log ? (
                    <div className="mt-2">
                        <div className="text-sm mb-2">
                            <strong>{log.action}</strong> • {log.entity} {log.entity_id ? `#${log.entity_id}` : ""} • {log.user?.name ?? "system"}
                        </div>

                        <pre className="bg-gray-100 dark:bg-neutral-800 p-4 rounded overflow-auto text-xs">
              {JSON.stringify(log, null, 2)}
            </pre>

                        <div className="mt-3 flex justify-end gap-2">
                            <Button variant="outline" onClick={() => { navigator.clipboard?.writeText(JSON.stringify(log, null, 2)); }}>Copy</Button>
                            <Button onClick={() => onClose?.()}>Close</Button>
                        </div>
                    </div>
                ) : null}
            </DialogContent>
        </Dialog>
    )
}
