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
        return $this->progressService->calculateForUser($userId);
    }

    // CREATE goal
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_name' => 'required|string',
            'target_pct' => 'required|numeric|min:1',
            'deadline' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $validated['user_id'] = auth()->id();
        $validated['current_pct'] = 0;

        $goal = Goal::create($validated);

        return response()->json([
            'message' => 'Goal created successfully.',
            'goal' => $goal
        ]);
    }

    // UPDATE goal
    public function update(Request $request, $id)
    {
        $goal = Goal::findOrFail($id);
        $goal->update($request->only('category_name', 'target_pct', 'deadline', 'notes'));

        return response()->json(['message' => 'Goal updated.']);
    }

    // DELETE goal
    public function destroy($id)
    {
        Goal::findOrFail($id)->delete();
        return response()->json(['message' => 'Goal removed.']);
    }
}
