"use client"

import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

export default function UsersTable({ users, loading, onEdit, onDelete }: any) {

    if (loading) {
        return <Skeleton className="h-48 w-full rounded-lg" />
    }

    return (
        <div className="border rounded-lg bg-white dark:bg-neutral-900 p-2">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {users.map((u: any) => (
                        <TableRow key={u.id}>
                            <TableCell>{u.name}</TableCell>
                            <TableCell>{u.email}</TableCell>
                            <TableCell>
                                {u.is_admin
                                    ? <span className="text-green-600 font-semibold">Admin</span>
                                    : <span className="text-neutral-500">User</span>
                                }
                            </TableCell>

                            <TableCell>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" onClick={() => onEdit(u)}>Edit</Button>
                                    {!u.is_admin &&
                                        <Button size="sm" variant="destructive" onClick={() => onDelete(u)}>
                                            Delete
                                        </Button>
                                    }
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
