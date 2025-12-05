// components/goals/GoalEditDialog.tsx
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Props {
    open: boolean;
    onClose: () => void;
    onSaved?: () => void;
    goal?: any;
    metricOptions?: { key: string; label: string }[];
}

export default function GoalEditDialog({ open, onClose, onSaved, goal, metricOptions = [] }: Props) {
    const [form, setForm] = useState({
        name: "",
        metric_key: "",
        target_min_pct: "",
        target_max_pct: "",
        target_amount: "",
        deadline: "",
        notes: "",
    });

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (open) {
            setForm({
                name: goal?.name ?? "",
                metric_key: goal?.metric_key ?? "",
                target_min_pct: goal?.target_min_pct != null ? String(goal.target_min_pct) : "",
                target_max_pct: goal?.target_max_pct != null ? String(goal.target_max_pct) : "",
                target_amount: goal?.target_amount != null ? String(goal.target_amount) : "",
                deadline: goal?.deadline ?? "",
                notes: goal?.notes ?? "",
            });
        }
    }, [open, goal]);

    function setField(field: string, value: any) {
        setForm(prev => ({ ...prev, [field]: value }));
    }

    async function save() {
        if (!form.name || !form.metric_key) {
            toast.error("Name and metric are required.");
            return;
        }

        if (!form.target_min_pct && !form.target_max_pct && !form.target_amount) {
            toast.error("Provide a target % range or an absolute target amount.");
            return;
        }

        setSaving(true);
        try {
            const payload = {
                name: form.name,
                metric_key: form.metric_key,
                target_min_pct: form.target_min_pct ? Number(form.target_min_pct) : null,
                target_max_pct: form.target_max_pct ? Number(form.target_max_pct) : null,
                target_amount: form.target_amount ? Number(form.target_amount) : null,
                deadline: form.deadline || null,
                notes: form.notes || null,
            };

            if (goal?.id) {
                await axios.put(`/data/goals/${goal.id}`, payload);
                toast.success("Goal updated");
            } else {
                await axios.post("/data/goals", payload);
                toast.success("Goal created");
            }

            onSaved?.();
            onClose();
        } catch (err: any) {
            toast.error(err?.response?.data?.message ?? "Failed to save");
        } finally {
            setSaving(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-[520px]">
                <DialogHeader>
                    <DialogTitle>{goal?.id ? "Edit Goal" : "Create Goal"}</DialogTitle>
                </DialogHeader>

                <div className="space-y-3">
                    <div>
                        <Label>Name</Label>
                        <Input value={form.name} onChange={e => setField("name", e.target.value)} />
                    </div>

                    <div>
                        <Label>Metric</Label>
                        <select
                            className="w-full border rounded p-2"
                            value={form.metric_key}
                            onChange={e => setField("metric_key", e.target.value)}
                        >
                            <option value="">Select metric</option>
                            {metricOptions.map(opt => (
                                <option key={opt.key} value={opt.key}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <Label>Target Min (%)</Label>
                            <Input value={form.target_min_pct} onChange={e => setField("target_min_pct", e.target.value)} />
                        </div>

                        <div>
                            <Label>Target Max (%)</Label>
                            <Input value={form.target_max_pct} onChange={e => setField("target_max_pct", e.target.value)} />
                        </div>
                    </div>

                    <div>
                        <Label>Deadline</Label>
                        <Input type="date" value={form.deadline} onChange={e => setField("deadline", e.target.value)} />
                    </div>

                    <div>
                        <Label>Notes</Label>
                        <textarea
                            className="w-full border rounded p-2"
                            value={form.notes}
                            onChange={e => setField("notes", e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
