"use client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function SpendingPatterns({ insights = {}, loading = false }: any) {

    const avgDaily = Number(insights.avgDaily ?? 0)
    const topDay = insights.topDay ?? "—"
    const topCategory = insights.topCategory ?? "—"

    return (
        <Card>
            <CardHeader>
                <CardTitle>Spending Patterns</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2 text-sm">
                <p>
                    <strong>Most Expensive Day:</strong> {loading ? "Loading..." : topDay}
                </p>

                <p>
                    <strong>Average Daily Spending:</strong>{" "}
                    {loading ? (
                        "Loading..."
                    ) : (
                        `₱${avgDaily.toLocaleString()}`
                    )}
                </p>

                <p>
                    <strong>Most Used Category:</strong> {loading ? "Loading..." : topCategory}
                </p>
            </CardContent>
        </Card>
    )
}
