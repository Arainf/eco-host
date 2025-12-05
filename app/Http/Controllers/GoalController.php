<?php

namespace App\Http\Controllers;

use App\Models\Goal;
use App\Services\GoalProgressService;
use Illuminate\Http\Request;

class GoalController extends Controller
{
    protected $progressService;

    public function __construct(GoalProgressService $service)
    {
        $this->progressService = $service;
    }

    // FETCH goals + computed progress
    public function index()
    {
        $userId = auth()->id();
        return response()->json($this->progressService->calculateForUser($userId));
    }

    // CREATE goal (value-based)
    public function store(Request $request)
    {
        // inside store validation
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'metric_key' => 'required|string',
            'target_min_pct' => 'nullable|integer|min:0|max:100',
            'target_max_pct' => 'nullable|integer|min:0|max:100',
            'deadline' => 'nullable|date',
            'unit' => 'nullable|string|max:10',
        ]);

        $validated['user_id'] = auth()->id();
        $goal = Goal::create($validated);


        return response()->json([
            'message' => 'Goal created successfully.',
            'goal' => $goal
        ], 201);
    }

    // UPDATE goal
    public function update(Request $request, $id)
    {
        $goal = Goal::where('user_id', auth()->id())->findOrFail($id);


        $goal->update($request->only([
            'name',
            'description',
            'metric_key',
            'target_min_pct',
            'target_max_pct',
            'deadline',
            'unit'
        ]));

        return response()->json(['message' => 'Goal updated.', 'goal' => $goal]);
    }

    // DELETE goal
    public function destroy($id)
    {
        $goal = Goal::where('user_id', auth()->id())->findOrFail($id);
        $goal->delete();
        return response()->json(['message' => 'Goal removed.']);
    }
}
