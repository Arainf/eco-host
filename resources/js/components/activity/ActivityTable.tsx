// resources/js/components/activity/ActivityTable.tsx
"use client"
import React, { useMemo, useState } from "react"
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import ChangesRenderer from '@/components/activity/ChangesRenderer';
import RawJsonDrawer from '@/components/activity/RawJsonDrawer';

export default function ActivityTable({
                                          logs = [],
                                          query = "",
                                          setQuery = (_: string) => {},
                                          onLoadMore = () => {},
                                      }: any) {
    const [openJson, setOpenJson] = useState<any>(null)

    const filtered = useMemo(() => {
        const q = (query || "").toLowerCase()
        if (!q) return logs
        return logs.filter((l: any) => {
            const hay = `${l.action} ${l.entity} ${l.entity_id} ${l.user?.name ?? ""} ${JSON.stringify(l.changes ?? {})}`.toLowerCase()
            return hay.includes(q)
        })
    }, [logs, query])

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <Input placeholder="Search action, entity, user..." value={query} onChange={(e) => setQuery(e.target.value)} />
                <Button variant="outline" onClick={() => { setQuery(""); }}>Clear</Button>
            </div>

            <div className="rounded border bg-white dark:bg-neutral-900 p-2 max-h-[60vh] overflow-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Action</TableHead>
                            <TableHead>Entity</TableHead>
                            <TableHead>Summary</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Details</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center p-6">No activity yet.</TableCell>
                            </TableRow>
                        ) : filtered.map((log: any) => (
                            <TableRow key={log.id}>
                                <TableCell className="capitalize font-medium">{log.action}</TableCell>

                                <TableCell>
                                    {log.entity} {log.entity_id ? `#${log.entity_id}` : ""}
                                    <div className="text-xs text-muted-foreground">{log.user?.name ?? "system"}</div>
                                </TableCell>

                                <TableCell>
                                    <ChangesRenderer changes={log.changes} />
                                </TableCell>

                                <TableCell>
                                    {format(new Date(log.created_at), "yyyy-MM-dd HH:mm")}
                                </TableCell>

                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="ghost" onClick={() => setOpenJson(log)}>View JSON</Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="text-center">
                <Button variant="outline" onClick={onLoadMore}>Load more</Button>
            </div>

            <RawJsonDrawer log={openJson} onClose={() => setOpenJson(null)} />
        </div>
    )
}
