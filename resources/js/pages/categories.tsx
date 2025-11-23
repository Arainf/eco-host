"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import AppLayout from "@/layouts/app-layout"
import { Head } from "@inertiajs/react"
import { columns } from "@/components/categories/columns"
import { CategoryDataTable } from "@/components/categories/data-table"
import CreateCategoryDialog from '@/components/categories/create-category';
import { Button } from "@/components/ui/button"
import { type BreadcrumbItem } from '@/types';
import { categories } from '@/routes';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: categories().url,
    },
];
export default function CategoriesPage() {



    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [createOpen, setCreateOpen] = useState(false)

    const getData = async () => {
        try {
            const res = await axios.get("/data/categories")
            setData(res.data)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />

            <div className="p-6 space-y-4">
                <Button
                    onClick={() => setCreateOpen(true)}
                    className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                >
                    + Create Category
                </Button>

                {loading ? (
                    <p className="text-muted-foreground">Loading...</p>
                ) : (
                    <CategoryDataTable columns={columns} data={data} setData={setData} />
                )}

                <CreateCategoryDialog
                    open={createOpen}
                    onOpenChange={setCreateOpen}
                    setData={setData}
                />
            </div>
        </AppLayout>
    )
}
