<?php

namespace App\Services;

use App\Models\Expense;
use App\Models\Goal;
use Carbon\Carbon;

class GoalProgressService
{
    public function calculateForUser($userId)
    {
        $goals = Goal::where('user_id', $userId)->get();
        $expenses = Expense::where('user_id', $userId)->get();

        // Group by category + yyyy-mm
        $grouped = $expenses->groupBy(function ($ex) {
            return $ex->category_name . '|' . date('Y-m', strtotime($ex->date));
        });

        foreach ($goals as $goal) {

            $category = $goal->category_name;

            $thisMonth = Carbon::now()->format('Y-m');
            $lastMonth = Carbon::now()->subMonth()->format('Y-m');

            $keyThis = $category . '|' . $thisMonth;
            $keyPrev = $category . '|' . $lastMonth;

            $prevTotal = isset($grouped[$keyPrev]) ? $grouped[$keyPrev]->sum('amount') : 0;
            $thisTotal = isset($grouped[$keyThis]) ? $grouped[$keyThis]->sum('amount') : 0;

            if ($prevTotal == 0) {
                $goal->current_pct = 0;
            } else {
                $goal->current_pct = round((($prevTotal - $thisTotal) / $prevTotal) * 100, 2);
            }
        }

        return $goals;
    }
}
