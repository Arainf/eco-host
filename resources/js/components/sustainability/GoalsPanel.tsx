"use client";

import React from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import GoalCard from "./GoalCard";

export default function GoalsPanel({ goals = [], categories = [], expenses = [], loading = false, onChange }: any) {
    const active = (goals || []).filter((g: any) => g.status !== 'completed' && g.status !== 'on_target');
    const completed = (goals || []).filter((g: any) => g.status === 'on_target' || g.status === 'completed');

    async function createQuickGoal() {
        try {
            // Quick suggestion: pick top expense category and create a target 10% lower than current month spend
            const userGoals = goals ?? [];

            // fallback: pick first category
            const suggestedCategory = categories?.[0]?.name ?? 'Energy';
            const suggestedColor = categories?.[0]?.color ?? '#f97316';

            // fetch current month expense for that category
            const res = await axios.get("/data/expenses");
            const expensesAll = res.data || [];

            const now = new Date();
            const monthKey = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;

            const currentSum = expensesAll
                .filter((e: any) => e.category_name === suggestedCategory && new Date(e.date).getFullYear() === now.getFullYear() && new Date(e.date).getMonth() === now.getMonth())
                .reduce((s: number, r: any) => s + Number(r.amount || 0), 0);

            // set target 10% lower OR a minimum default
            const target = Math.max(1, Math.round(currentSum * 0.9 * 100) / 100) || 15000;

            const payload = {
                name: `Limit ${suggestedCategory} to ${target}`,
                description: `Auto-suggested target for ${suggestedCategory}`,
                category_name: suggestedCategory,
                category_color: suggestedColor,
                target_amount: target,
                deadline: null,
                notes: 'Auto-generated quick goal'
            };

            await axios.post("/data/goals", payload);
            toast.success("Quick goal created");
            onChange?.();
        } catch (err: any) {
            console.error(err);
            toast.error(err?.response?.data?.message ?? "Failed to create goal");
        }
    }

    return (
        <Card>
            <CardHeader className="flex items-center justify-between">
                <CardTitle>Goals</CardTitle>
                <div className="flex items-center gap-2">
                    <Button size="sm" onClick={createQuickGoal} variant="outline">
                        <Plus className="w-4 h-4" /> Quick goal
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div>
                    <div className="text-sm text-neutral-500 mb-2">Active goals</div>
                    {loading ? (
                        <div>Loading…</div>
                    ) : active.length === 0 ? (
                        <div className="text-sm text-neutral-500">No active goals — create one or use quick goal</div>
                    ) : (
                        <div className="space-y-3">
                            {active.map((g: any) => (
                                <GoalCard key={g.id} goal={g} categories={categories} expenses={expenses} onUpdated={() => onChange?.()} />
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <div className="text-sm text-neutral-500 mb-2">Completed / On-target</div>
                    {completed.length === 0 ? (
                        <div className="text-sm text-neutral-500">No completed goals yet</div>
                    ) : (
                        <div className="space-y-2">
                            {completed.map((g: any) => (
                                <div key={g.id} className="p-3 border rounded-md">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="font-medium">{g.name}</div>
                                            <div className="text-xs text-neutral-500">{g.description}</div>
                                        </div>
                                        <div className="text-sm text-emerald-600 font-semibold">On target</div>
                                    </div>

                                    <div className="mt-3">
                                        <div className="text-xs text-neutral-500 mb-1">Suggested next steps</div>
                                        <ul className="list-disc ml-5 text-sm">
                                            <li>Set a maintenance check for {g.category_name} changes</li>
                                            <li>Monitor the category for 30 days</li>
                                            <li>Create a new stretch goal (lower target)</li>
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
