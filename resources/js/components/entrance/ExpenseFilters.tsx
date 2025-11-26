"use client"
import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from "@/components/ui/select"

export default function ExpenseFilters({
                                           query,
                                           setQuery,
                                           period,
                                           setPeriod,
                                           categoryFilter,
                                           setCategoryFilter,
                                           subcategoryFilter,
                                           setSubcategoryFilter,
                                           categories = [],
                                       }: any) {

    const normalizedCategory = categoryFilter || "__all__"
    const normalizedSubcategory = subcategoryFilter || "__all__"

    const selectedCategory =
        categories.find((c: any) => c.name === categoryFilter) || null

    return (
        <div className="flex flex-wrap items-center gap-3 w-full">

            {/* SEARCH */}
            <Input
                placeholder="Search expense, category, subcategory, remarks..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 min-w-[200px]"
            />

            {/* PERIOD FILTERS */}
            <div className="flex items-center gap-2">
                <Button
                    variant={period === "week" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPeriod("week")}
                >
                    Week
                </Button>
                <Button
                    variant={period === "month" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPeriod("month")}
                >
                    Month
                </Button>
                <Button
                    variant={period === "year" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPeriod("year")}
                >
                    Year
                </Button>
            </div>

            {/* CATEGORY FILTER */}
            <Select
                value={normalizedCategory}
                onValueChange={(v) => {
                    if (v === "__all__") {
                        setCategoryFilter("")
                        setSubcategoryFilter("")
                    } else {
                        setCategoryFilter(v)
                        setSubcategoryFilter("")
                    }
                }}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Categories" />
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="__all__">All Categories</SelectItem>
                    {categories.map((c: any) => (
                        <SelectItem key={c.id} value={c.name}>
                            {c.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* SUBCATEGORY FILTER */}
            <Select
                disabled={!selectedCategory}
                value={normalizedSubcategory}
                onValueChange={(v) => {
                    if (v === "__all__") {
                        setSubcategoryFilter("")
                    } else {
                        setSubcategoryFilter(v)
                    }
                }}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Subcategories" />
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="__all__">All Subcategories</SelectItem>

                    {selectedCategory?.subcategories?.map((s: any) => (
                        <SelectItem key={s.id} value={s.name}>
                            {s.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

        </div>
    )
}
