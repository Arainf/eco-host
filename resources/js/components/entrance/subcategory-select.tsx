"use client"

import {
    Select, SelectTrigger, SelectContent, SelectItem, SelectValue
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export function SubcategorySelect({ allSubcategories, form, setForm }: any) {

    const handle = (id: string) => {
        setForm((prev: any) => ({ ...prev, subcategory_id: id }))
        if (id === "other") {
            setForm((prev: any) => ({
                ...prev,
                subcategory_name: "",
                category_name: "",
                category_color: "",
            }))
            return
        }
        const s = allSubcategories.find((x: any) => x.id == id)
        if (s) {
            setForm((prev: any) => ({
                ...prev,
                subcategory_name: s.name,
                category_name: s.category_name,
                category_color: s.category_color,
            }))
        }
    }

    return (
        <div>
            <Label>Category</Label>

            <Select value={form.subcategory_id} onValueChange={handle}>
                <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>

                <SelectContent>
                    {allSubcategories.map((s: any) => (
                        <SelectItem key={s.id} value={s.id.toString()}>
                            <div className="flex items-center gap-2">
                <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: s.category_color }}
                />
                                {s.name}
                                <span className="text-xs opacity-60 ml-1">({s.category_name})</span>
                            </div>
                        </SelectItem>
                    ))}

                    <SelectItem value="other">Other (Specify)</SelectItem>
                </SelectContent>
            </Select>

            {form.subcategory_id === "other" && (
                <input
                    className="mt-2 p-2 border rounded w-full"
                    placeholder="Custom subcategory"
                    value={form.subcategory_name}
                    onChange={(e) =>
                        setForm((prev: any) => ({
                            ...prev,
                            subcategory_name: e.target.value,
                        }))
                    }
                />
            )}
        </div>
    )
}
