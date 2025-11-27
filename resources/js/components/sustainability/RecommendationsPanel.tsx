// components/sustainability/RecommendationsPanel.tsx
"use client";

import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";

export default function RecommendationsPanel({ goals = [], categories = [], expenses = [], onAction }: any) {
    // find top spending category
    const byCategory = useMemo(() => {
        const map = new Map<string, number>();
        (expenses || []).forEach((e: any) => {
            const cat = e.category_name ?? "Uncategorized";
            map.set(cat, (map.get(cat) || 0) + Number(e.amount ?? 0));
        });
        return Array.from(map.entries()).map(([k, v]) => ({ name: k, amount: v })).sort((a, b) => b.amount - a.amount);
    }, [expenses]);

    const top = byCategory[0];

    function suggestAction() {
        if (!top) {
            toast("No spending yet to suggest actions");
            return;
        }
        // quick suggestion: create a goal for top category
        const payload = {
            name: `Reduce ${top.name} spending by 5%`,
            description: `Suggestion: reduce ${top.name} by 5% from recent average.`,
            category: top.name,
            target_percent: 5,
            completed: false,
            deadline: null,
        };

        axios.post("/data/goals", payload)
            .then(() => {
                toast.success("Suggested goal created");
                onAction?.();
            })
            .catch(() => toast.error("Suggestion failed"));
    }

    return (
        <div>
            <div className="text-sm text-neutral-600">
                Suggestions based on recent spending
            </div>

            {top ? (
                <div className="mt-2">
                    <div className="text-sm font-medium">{top.name}</div>
                    <div className="text-xs text-neutral-500">Total: ₱{Number(top.amount).toLocaleString()}</div>
                    <div className="mt-3 flex gap-2">
                        <Button size="sm" onClick={suggestAction}>Create suggested goal</Button>
                        <Button size="sm" variant="outline" onClick={() => { navigator.clipboard?.writeText(`Reduce ${top.name} usage`); toast.success("Copied"); }}>Copy suggestion</Button>
                    </div>
                </div>
            ) : (
                <div className="text-sm text-neutral-500 mt-2">No spending data yet</div>
            )}
        </div>
    );
}
