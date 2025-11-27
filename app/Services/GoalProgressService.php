<?php

namespace App\Services;

use App\Models\Goal;
use App\Models\Expense;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class GoalProgressService
{
    /**
     * Return goals for a user with computed current_amount and status.
     * Also returns KPI bundle used by frontend.
     */
    public function calculateForUser(int $userId): array
    {
        $goals = Goal::where('user_id', $userId)->get();

        // Pull expenses for the user (last 2 months for KPI comparison)
        $expenses = Expense::where('user_id', $userId)
            ->orderBy('date', 'desc')
            ->get();

        // group by month (YYYY-MM)
        $byMonth = $expenses->groupBy(function ($e) {
            $d = \Carbon\Carbon::parse($e->date);
            return $d->format('Y-m');
        });

        // compute KPIs (previous month vs current month)
        $months = $byMonth->keys()->slice(0, 2); // most recent two months if available

        $currentMonthKey = $months->get(0) ?? null;
        $previousMonthKey = $months->get(1) ?? null;

        $sumByCategory = function(?string $monthKey, ?string $categoryName) use ($byMonth) {
            if (!$monthKey) return 0;
            $rows = $byMonth->get($monthKey) ?? collect();
            return $rows->where('category_name', $categoryName)->sum(function($r){ return (float) $r->amount; });
        };

        $kpis = [
            'energy_pct_change' => null,
            'water_pct_change' => null,
            'sustainable_purchases_pct' => null,
            'total_savings_pct' => null,
        ];

        // Helper totals
        $sumMonth = fn($k) => $byMonth->get($k)?->sum(fn($r) => (float)$r->amount) ?? 0;

        $currTotal = $currentMonthKey ? $sumMonth($currentMonthKey) : 0;
        $prevTotal = $previousMonthKey ? $sumMonth($previousMonthKey) : 0;

        if ($prevTotal > 0) {
            $kpis['total_savings_pct'] = (($prevTotal - $currTotal) / $prevTotal) * 100;
        }

        // energy (categories named like 'Energy' or 'Electricity' - we try both)
        $energyNames = ['Energy', 'Electricity', 'Energy Consumption', 'Electricity Expense'];
        $waterNames = ['Water', 'Water Usage'];

        $currEnergy = array_sum(array_map(fn($n) => $sumByCategory($currentMonthKey, $n), $energyNames));
        $prevEnergy = array_sum(array_map(fn($n) => $sumByCategory($previousMonthKey, $n), $energyNames));

        if ($prevEnergy > 0) $kpis['energy_pct_change'] = (($prevEnergy - $currEnergy) / $prevEnergy) * 100;

        $currWater = array_sum(array_map(fn($n) => $sumByCategory($currentMonthKey, $n), $waterNames));
        $prevWater = array_sum(array_map(fn($n) => $sumByCategory($previousMonthKey, $n), $waterNames));
        if ($prevWater > 0) $kpis['water_pct_change'] = (($prevWater - $currWater) / $prevWater) * 100;

        // sustainable purchases: assume categories flagged earlier: we try to compute proportion
        // For simplicity: if categories table has 'is_sustainable' flag it's ideal.
        // Without that, fallback: any category named 'Eco', 'Sustainable', 'Green' counts.
        $sustainableKeywords = ['Eco','Sustainable','Green','Biodegradable','Organic'];

        $currSustainable = 0;
        $prevSustainable = 0;

        foreach ($byMonth as $k => $rows) {
            if ($k !== $currentMonthKey && $k !== $previousMonthKey) continue;
            $sum = $rows->filter(function($r) use ($sustainableKeywords) {
                foreach ($sustainableKeywords as $kw) {
                    if (stripos($r->category_name, $kw) !== false) return true;
                }
                return false;
            })->sum(fn($r) => (float)$r->amount);

            if ($k === $currentMonthKey) $currSustainable = $sum;
            if ($k === $previousMonthKey) $prevSustainable = $sum;
        }

        if ($prevSustainable > 0) {
            $kpis['sustainable_purchases_pct'] = (($currSustainable - $prevSustainable) / $prevSustainable) * 100;
        }

        // compute current_amount for each goal (sum of category for current month)
        $computedGoals = $goals->map(function($g) use ($byMonth, $currentMonthKey) {

            $currentSum = 0;
            if ($currentMonthKey) {
                $rows = $byMonth->get($currentMonthKey) ?? collect();
                $currentSum = $rows->where('category_name', $g->category_name)->sum(fn($r) => (float)$r->amount);
            }

            $status = 'pending';
            if ($currentSum <= $g->target_amount) $status = 'on_target';
            if ($currentSum > $g->target_amount) $status = 'over_target';
            if ($g->target_amount == 0) $status = 'pending';

            return array_merge($g->toArray(), [
                'current_amount' => round($currentSum, 2),
                'status' => $status,
                'progress_pct' => $g->target_amount > 0 ? round(($currentSum / $g->target_amount) * 100, 2) : null,
            ]);
        });

        return [
            'goals' => $computedGoals,
            'kpis' => $kpis,
            'meta' => [
                'current_month' => $currentMonthKey,
                'previous_month' => $previousMonthKey,
            ],
        ];
    }
}
