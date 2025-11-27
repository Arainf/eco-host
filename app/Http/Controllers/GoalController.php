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
        $validated = $request->validate([
            'name'            => 'required|string|max:255',
            'description'     => 'nullable|string',
            'category_name'   => 'required|string|max:255',
            'category_color'  => 'nullable|string|max:20',
            'target_amount'   => 'required|numeric|min:0.01',
            'deadline'        => 'nullable|date',
            'notes'           => 'nullable|string',
        ]);

        $validated['user_id'] = auth()->id();
        $validated['current_amount'] = 0;

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

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'category_name' => 'sometimes|string|max:255',
            'category_color' => 'nullable|string|max:20',
            'target_amount' => 'sometimes|numeric|min:0.01',
            'deadline' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $goal->update($validated);

        return response()->json(['message' => 'Goal updated.']);
    }

    // DELETE goal
    public function destroy($id)
    {
        $goal = Goal::where('user_id', auth()->id())->findOrFail($id);
        $goal->delete();
        return response()->json(['message' => 'Goal removed.']);
    }
}
