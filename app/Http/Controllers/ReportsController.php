<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Expense;
use PDF;
use Carbon\Carbon;

class ReportsController extends Controller
{
    /**
     * GET /data/reports/semester
     * query params: year (int), semester (1 or 2)
     */
    public function semester(Request $request)
    {
        $userId = auth()->id();

        $year = (int)$request->query('year', date('Y'));
        $semester = (int)$request->query('semester', $this->semesterFromMonth(date('n')));

        // compute date range
        [$start, $end] = $this->rangeForSemester($year, $semester);

        // load expenses for user in range
        $expenses = Expense::where('user_id', $userId)
            ->whereBetween('date', [$start->toDateString(), $end->toDateString()])
            ->orderBy('date', 'asc')
            ->get();

        // total & count
        $total = $expenses->sum(fn($e) => (float)$e->amount);
        $count = $expenses->count();

        // breakdown by category
        $byCategory = $expenses
            ->groupBy('category_name')
            ->map(function($group, $k) {
                return [
                    'name' => $k,
                    'amount' => $group->sum(fn($e) => (float)$e->amount),
                    'color' => optional($group->first())->category_color,
                ];
            })->values();

        // monthly breakdown inside semester
        $monthly = [];
        $cursor = $start->copy();
        while ($cursor->lte($end)) {
            $label = $cursor->format('Y-m');
            $monthly[$label] = 0;
            $cursor->addMonth();
        }

        foreach ($expenses as $e) {
            $k = Carbon::parse($e->date)->format('Y-m');
            if (isset($monthly[$k])) {
                $monthly[$k] += (float)$e->amount;
            }
        }

        $monthlyArr = collect($monthly)->map(function($amt, $k) {
            $d = Carbon::createFromFormat('Y-m', $k);
            return ['label' => $d->format('M Y'), 'amount' => $amt];
        })->values();

        // top subcategories
        $bySub = $expenses->groupBy('subcategory_name')
            ->map(fn($g, $k) => [
                'name' => $k ?: 'Unknown',
                'amount' => $g->sum(fn($e) => (float)$e->amount)
            ])
            ->values()
            ->sortByDesc('amount')
            ->take(10)
            ->values();

        // CO₂ calculations
        $multipliers = [
            'Energy Consumption' => 0.6,
            'Water Usage' => 0.02,
            'Waste Management' => 0.3,
            'Sustainable Procurement' => 0.1,
        ];

        $co2ByCategory = $byCategory->map(function($c) use ($multipliers) {
            $m = $multipliers[$c['name']] ?? 0.1;
            return [
                'name' => $c['name'],
                'kg_co2' => round($c['amount'] * $m, 2),
            ];
        })->values();

        $co2Total = $co2ByCategory->sum('kg_co2');

        return response()->json([
            'meta' => [
                'year' => $year,
                'semester' => $semester,
                'start' => $start->toDateString(),
                'end' => $end->toDateString(),
            ],
            'summary' => [
                'total_amount' => round($total, 2),
                'entries' => $count,
                'highest_category' => $byCategory->sortByDesc('amount')->first()['name'] ?? null,
            ],
            'by_category' => $byCategory,
            'monthly' => $monthlyArr,
            'top_subcategories' => $bySub,
            'co2' => [
                'by_category' => $co2ByCategory,
                'total_kg' => round($co2Total, 2),
            ],
            'expenses' => $expenses,
        ]);
    }

    /**
     * POST /data/reports/export
     * body: { year, semester }
     * returns PDF response
     */
    public function export(Request $request)
    {
        $year = (int)$request->input('year', date('Y'));
        $semester = (int)$request->input('semester', $this->semesterFromMonth(date('n')));

        // reuse semester() logic
        $sRequest = $request->duplicate($request->query->all() + [
                'year' => $year,
                'semester' => $semester
            ]);

        $dataResponse = $this->semester($sRequest);
        $data = $dataResponse->getData(true);

        // load pdf view
        $html = view('reports.pdf', compact('data'))->render();

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadHTML($html);
        $filename = "report_sem{$semester}_{$year}.pdf";

        return $pdf->download($filename);
    }



    // --------------------------------------------------
    // NEW SEMESTER HELPERS
    // --------------------------------------------------
    private function semesterFromMonth(int $month)
    {
        // 1st Semester: Aug–Dec
        if ($month >= 8 && $month <= 12) return 1;

        // 2nd Semester: Jan–May
        if ($month >= 1 && $month <= 5) return 2;

        // If June–July, default to upcoming 1st sem
        return 1;
    }

    private function rangeForSemester(int $year, int $semester)
    {
        if ($semester == 1) {
            // 1st Semester: Aug–Dec (same year)
            $start = Carbon::create($year, 8, 1)->startOfDay();
            $end   = Carbon::create($year, 12, 31)->endOfDay();
        } else {
            // 2nd Semester: Jan–May (same year)
            $start = Carbon::create($year, 1, 1)->startOfDay();
            $end   = Carbon::create($year, 5, 31)->endOfDay();
        }

        return [$start, $end];
    }
}
