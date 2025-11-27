"use client"

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";

export default function GoalCard({ goal, categories = [], expenses = [], onUpdated }: any) {

    const handleDelete = async () => {
        if (!confirm('Delete this goal?')) return;
        try {
            await axios.delete(`/data/goals/${goal.id}`);
            toast.success('Deleted goal');
            onUpdated?.();
        } catch (err) {
            toast.error('Delete failed');
        }
    }

    const pct = goal.progress_pct ?? (goal.current_amount && goal.target_amount ? (goal.current_amount/goal.target_amount)*100 : 0)

    return (
        <div className="p-3 border rounded-md">
            <div className="flex items-center justify-between">
                <div>
                    <div className="font-medium">{goal.name}</div>
                    <div className="text-xs text-neutral-500">{goal.description}</div>
                </div>
                <div className="text-sm">
                    <div className="text-xs text-neutral-500">Target</div>
                    <div className="font-semibold">₱{Number(goal.target_amount ?? 0).toLocaleString()}</div>
                </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
                <div className="text-sm text-neutral-500">Current: ₱{Number(goal.current_amount ?? 0).toLocaleString()}</div>
                <div className="text-sm font-medium">{pct ? `${Number(pct).toFixed(1)}%` : '—'}</div>
            </div>

            <div className="mt-3 flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => {
                    // open edit dialog - implement GoalEditDialog similar to create if you want
                    toast('Edit not implemented in this snippet')
                }}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={handleDelete}>Delete</Button>
            </div>
        </div>
    )
}
