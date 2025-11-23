"use client"

import { useState } from "react"
import axios from "axios"
import EditCategoryDialog from "./edit-category-dialog"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"


export default function CategoryActions({ category, setData }: any) {
    const [editOpen, setEditOpen] = useState(false)

    const handleDelete = async () => {
        if (!confirm("Delete this category? This cannot be undone.")) return

        try {
            await axios.delete(`/data/categories/${category.id}`)

            setData((prev: any[]) => prev.filter((c) => c.id !== category.id))

            toast.success("Category deleted", {
                description: `${category.name} was removed.`,
            })
        } catch (error) {
            toast.error("Failed to delete category", {
                description: error?.response?.data?.message || "An error occurred.",
            })
        }
    }


    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-green-700 dark:text-green-300">
                        <MoreHorizontal size={18} />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setEditOpen(true)}>
                        <Edit className="w-4 h-4 mr-2" /> Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <EditCategoryDialog
                open={editOpen}
                onOpenChange={setEditOpen}
                category={category}
                setData={setData}
            />
        </>
    )
}
