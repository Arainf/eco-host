"use client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function TopCategories({ items }: any) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Top Categories</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {items.map((c: any, i: number) => (
                    <div key={i} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }}></span>
                            <span className="font-medium">{c.name}</span>
                        </div>
                        <span className="text-sm font-semibold">
                            ₱{c.amount.toLocaleString()}
                        </span>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
