"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import CategoryActions from "./category-actions"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: any[]
    setData: (callback: any) => void
}

export function CategoryDataTable<TData, TValue>({
                                                     columns,
                                                     data,
                                                     setData,
                                                 }: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div
            className="
    rounded-xl
    border border-neutral-200
    bg-white shadow-sm
    overflow-hidden

    dark:border-neutral-800
    dark:bg-neutral-900
    dark:shadow-none
  "
        >

            <Table>
                <TableHeader className="bg-neutral-50 dark:bg-neutral-800/60">

                {table.getHeaderGroups().map((hg) => (
                        <TableRow key={hg.id}>
                            {hg.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    className="text-xs font-semibold uppercase tracking-wider text-green-700 dark:text-green-300"
                                >
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                            <TableHead className="text-xs font-semibold uppercase tracking-wider text-green-700 dark:text-green-300">
                                Actions
                            </TableHead>
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {data.length ? (
                        data.map((row: any) => (
                            <TableRow key={row.id} className="hover:bg-green-50/60 dark:hover:bg-green-900/40 transition">
                                {columns.map((col) => (
                                    <TableCell key={col.accessorKey as string}>
                                        {flexRender(col.cell, { row: { original: row }, getValue: () => row[col.accessorKey as string] })}
                                    </TableCell>
                                ))}

                                {/* 👇 Pass setData to actions */}
                                <TableCell>
                                    <CategoryActions category={row} setData={setData} />
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length + 1} className="text-center py-6 text-green-600 dark:text-green-300">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
