"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"

export default function ActivityTimeline({ logs = [] }: any) {
    if (!logs.length) {
        return <p className="text-sm text-muted-foreground">No activity yet.</p>
    }

    return (
        <div className="space-y-4">
            {logs.map((log: any) => (
                <Card key={log.id} className="border-l-4 border-primary">
                    <CardContent className="p-4">
                        <div className="flex justify-between">
                            <b>{log.action.toUpperCase()}</b>
                            <span className="text-xs text-muted-foreground">
                                {format(new Date(log.created_at), "yyyy-MM-dd HH:mm")}
                            </span>
                        </div>

                        <p className="text-sm mt-1">
                            {log.entity} #{log.entity_id}
                        </p>

                        {log.changes && (
                            <pre className="text-xs bg-neutral-50 dark:bg-neutral-900 p-2 rounded mt-2 overflow-x-auto">
                                {JSON.stringify(log.changes, null, 2)}
                            </pre>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
