"use client"

import { Goal, Category } from "./types"
import GoalEditDialog from '@/components/goals/GoalEditDialog';
import GoalDeleteDialog from '@/components/goals/GoalDeleteDialog';

export default function GoalItem({
                                     goal,
                                     categories,
                                     onChanged,
                                 }: {
    goal: Goal
    categories: Category[]
    onChanged: () => void
}) {
    const cat = categories.find((c) => c.name === goal.category_name)

    const pct =
        goal.target_pct === 0
            ? 0
            : Math.min(100, Math.round((goal.current_pct / goal.target_pct) * 100))

    return (
        <div className="border rounded-lg p-3 flex items-center justify-between bg-white dark:bg-neutral-900">
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: cat?.color || "#4caf50" }}
                    />

                    <strong>{goal.category_name}</strong>
                </div>

                <p className="text-xs text-neutral-500">
                    Target: {goal.target_pct}% • Now: {goal.current_pct}%
                </p>

                <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded">
                    <div
                        className="h-2 rounded"
                        style={{
                            width: `${pct}%`,
                            backgroundColor: cat?.color || "#4caf50",
                        }}
                    ></div>
                </div>
            </div>

            <div className="flex gap-2">
                <GoalEditDialog goal={goal} categories={categories} onSuccess={onChanged} />
                <GoalDeleteDialog id={goal.id} onSuccess={onChanged} />
            </div>
        </div>
    )
}
