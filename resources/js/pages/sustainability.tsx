"use client";

import { useEffect, useState } from "react";
import axios from "axios";

// Layout + Head
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { type BreadcrumbItem } from "@/types";

// Components
import KPIMetricCard from '@/components/sustainability/KpiMetricCard';
import GoalEditDialog from "@/components/goals/GoalEditDialog";

// UI
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Sustainability", href: "/sustainability" },
];

export default function SustainabilityPage() {
    const [loading, setLoading] = useState(true);
    const [payload, setPayload] = useState<any>(null); // { goals, kpis, meta }
    const [categories, setCategories] = useState<any[]>([]);
    const [editingGoal, setEditingGoal] = useState<any>(null); // goal currently being edited
    const [showEditDialog, setShowEditDialog] = useState(false);

    async function load() {
        try {
            setLoading(true);

            const [gRes, cRes] = await Promise.all([
                axios.get("/data/goals"),
                axios.get("/data/categories"),
            ]);

            setPayload({
                goals: gRes.data.goals ?? [],
                kpis: gRes.data.kpis ?? {},
                meta: gRes.data.meta ?? {},
            });

            setCategories(Array.isArray(cRes.data) ? cRes.data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load() }, []);

    const kpival = (key: string) => payload?.kpis?.[key] ?? null;

    const METRICS: any = [
        { key: "energy_pct_change", label: "Reduction in Energy Cost", unit: "%"},
        { key: "water_pct_change", label: "Reduction in Water Cost", unit: "%"},
        { key: "sustainable_purchases_pct", label: "Sustainable Purchases Increase", unit: "%"},
        { key: "total_savings_pct", label: "Cost Savings", unit: "%"},
    ];

    function findGoalFor(metricKey: string) {
        return payload?.goals?.find((g: any) => g.metric_key === metricKey) ?? null;
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sustainability (V3)" />

            {/* EDIT DIALOG */}
            {showEditDialog && (
                <GoalEditDialog
                    open={showEditDialog}
                    goal={editingGoal}
                    metricOptions={METRICS.map(m => ({ key: m.key, label: m.label }))}
                    onClose={() => setShowEditDialog(false)}
                    onSaved={() => {
                        setShowEditDialog(false);
                        load();
                    }}
                />
            )}

            <div className="p-4 mx-auto w-full space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Sustainability KPIs</h2>

                    <Button onClick={() => {
                        setEditingGoal(null);
                        setShowEditDialog(true);
                    }}>
                        New Goal
                    </Button>
                </div>


                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {loading ? (
                        [...Array(4)].map((_, i) => (
                            <Card key={i} className="p-4">
                                <Skeleton className="h-36" />
                            </Card>
                        ))
                    ) : (
                        METRICS.map((m: any) => {
                            const goal = findGoalFor(m.key);
                            const kpiValue = kpival(m.key);

                            return (
                                <KPIMetricCard
                                    key={m.key}
                                    label={m.label}
                                    value={kpiValue}
                                    targetMin={goal?.target_min_pct ?? null}
                                    targetMax={goal?.target_max_pct ?? null}
                                    unitLabel={m.unit}
                                    color={goal?.category_color ?? "#16a34a"}
                                />
                            );
                        })
                    )}
                </div>

                {/* Monthly Table */}
                <Card className="p-0">
                    <div className="p-4">
                        <h3 className="font-medium">Monthly Summary</h3>
                        <p className="text-sm text-neutral-500">
                            KPI values and compliance for the current month
                        </p>
                    </div>

                    <div className="p-4">
                        <table className="w-full text-sm">
                            <thead>
                            <tr className="text-left text-neutral-500">
                                <th>Metric</th>
                                <th>Current</th>
                                <th>Target</th>
                                <th>Status</th>
                                <th className="text-right">Action</th>
                            </tr>
                            </thead>

                            <tbody>
                            {METRICS.map((m: any) => {
                                const goal = findGoalFor(m.key);
                                const val = kpival(m.key);

                                let status = "No target";
                                if (goal && val != null) {
                                    if (val >= goal.target_min_pct && val <= goal.target_max_pct)
                                        status = "On track";
                                    else if (val > goal.target_max_pct)
                                        status = "Exceeded";
                                    else
                                        status = "Below target";
                                }

                                return (
                                    <tr key={m.key} className="border-t">
                                        <td className="py-2">{m.label}</td>
                                        <td className="py-2">{val == null ? "—" : `${val.toFixed(1)}%`}</td>
                                        <td className="py-2">
                                            {goal
                                                ? `${goal.target_min_pct}% – ${goal.target_max_pct}%`
                                                : "Not set"}
                                        </td>
                                        <td className="py-2">{status}</td>

                                        {/* EDIT BUTTON */}
                                        <td className="py-2 text-right">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    setEditingGoal(goal || { metric_key: m.key });
                                                    setShowEditDialog(true);
                                                }}
                                            >
                                                Edit
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </Card>

            </div>
        </AppLayout>
    );
}
