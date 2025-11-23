"use client"

import { useState } from "react"
import axios from "axios"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from 'sonner';

export default function CreateCategoryDialog({ open, onOpenChange, setData }: any) {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [color, setColor] = useState("#4CAF50")

    const handleSubmit = async () => {
        try {
            const res = await axios.post("/data/categories", {
                name,
                description,
                color,
                subcategories: [],
            })

            setData((prev: any[]) => [...prev, res.data])

            toast.success("Category created!", {
                description: `${name} has been added.`,
            })

            onOpenChange(false)
        } catch (error) {
            toast.error("Failed to create category", {
                description: error?.response?.data?.message || "An error occurred.",
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="border-green-200 dark:border-green-900 dark:bg-[#0f1a0f]">
                <DialogHeader>
                    <DialogTitle className="text-green-700 dark:text-green-300">
                        Create Category
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-3">
                    <Input placeholder="Category name" value={name} onChange={(e) => setName(e.target.value)} />
                    <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
                </div>

                <DialogFooter>
                    <Button
                        onClick={handleSubmit}
                        className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                    >
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
