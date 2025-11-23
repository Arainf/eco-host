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
import { toast } from "sonner"


export default function EditCategoryDialog({
                                               open,
                                               onOpenChange,
                                               category,
                                               setData,
                                           }: any) {
    const [name, setName] = useState(category.name)
    const [description, setDescription] = useState(category.description)
    const [color, setColor] = useState(category.color)
    const [subcategories, setSubcategories] = useState(category.subcategories)

    const handleSave = async () => {
        try {
            const res = await axios.put(`/data/categories/${category.id}`, {
                name,
                description,
                color,
                subcategories,
            })

            setData((prev: any[]) =>
                prev.map((c: any) => (c.id === category.id ? res.data : c))
            )

            toast.success("Category updated!", {
                description: `${name} has been updated.`,
            })

            onOpenChange(false)
        } catch (error) {
            toast.error("Failed to update category", {
                description: error?.response?.data?.message || "Something went wrong.",
            })
        }
    }


    const addSub = () => {
        setSubcategories([...subcategories, { id: null, name: "" }])
    }

    const updateSub = (i: number, value: string) => {
        const updated = [...subcategories]
        updated[i].name = value
        setSubcategories(updated)
    }

    const removeSub = (i: number) => {
        const updated = subcategories.filter((_, idx) => idx !== i)
        setSubcategories(updated)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="border-green-200 dark:border-green-900 dark:bg-[#0f1a0f]">
                <DialogHeader>
                    <DialogTitle className="text-green-700 dark:text-green-300">
                        Edit Category
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-3">
                    <Input value={name} onChange={(e) => setName(e.target.value)} />
                    <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                    <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} />

                    <div className="space-y-2">
                        <p className="font-medium text-green-700 dark:text-green-300">Subcategories</p>

                        {subcategories.map((sub: any, i: number) => (
                            <div key={i} className="flex gap-2">
                                <Input value={sub.name} onChange={(e) => updateSub(i, e.target.value)} />
                                <Button variant="destructive" onClick={() => removeSub(i)}>
                                    Remove
                                </Button>
                            </div>
                        ))}

                        <Button
                            onClick={addSub}
                            className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                        >
                            + Add Subcategory
                        </Button>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                        onClick={handleSave}
                    >
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
