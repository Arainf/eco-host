<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;
use App\Helpers\LogActivity;

class ExpenseController extends Controller
{
    /**
     * GET /api/expenses
     */
    public function index()
    {
        return Expense::where('user_id', auth()->id())
            ->orderBy('date', 'desc')
            ->get();
    }

    /**
     * POST /api/expenses
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'expense_name'      => 'required|string|max:255',
            'category_name'     => 'required|string|max:255',
            'category_color'    => 'nullable|string|max:20',
            'subcategory_name'  => 'nullable|string|max:255',
            'description'       => 'nullable|string',
            'amount'            => 'required|numeric|min:0',
            'date'              => 'required|date',
            'remarks'           => 'nullable|string',
        ]);

        $validated['user_id'] = auth()->id();

        $expense = Expense::create($validated);

        // 🔵 LOG ACTION — CREATED
        LogActivity::add(
            "created",
            "expense",
            $expense->id,
            ["new" => $expense]
        );

        return response()->json($expense, 201);
    }

    /**
     * PUT /data/expenses/{id}
     */
    public function update(Request $request, $id)
    {
        $expense = Expense::where('user_id', auth()->id())
            ->findOrFail($id);

        $validated = $request->validate([
            'expense_name'      => 'required|string|max:255',
            'category_name'     => 'required|string|max:255',
            'category_color'    => 'nullable|string|max:20',
            'subcategory_name'  => 'nullable|string|max:255',
            'description'       => 'nullable|string',
            'amount'            => 'required|numeric|min:0',
            'date'              => 'required|date',
            'remarks'           => 'nullable|string',
        ]);

        $before = $expense->toArray(); // snapshot before update

        $expense->update($validated);

        // 🔵 LOG ACTION — UPDATED
        LogActivity::add(
            "updated",
            "expense",
            $expense->id,
            [
                "before" => $before,
                "after" => $expense->toArray()
            ]
        );

        return response()->json([
            'message' => 'Expense updated successfully',
            'expense' => $expense,
        ]);
    }

    /**
     * POST /api/expenses/import
     */
    public function import(Request $request)
    {
        $rows = $request->input('rows', []);

        foreach ($rows as $row) {
            $expense = Expense::create([
                'user_id'          => auth()->id(),
                'expense_name'     => $row['expense_name'] ?? 'Untitled',
                'category_name'    => $row['category_name'] ?? 'Unknown',
                'category_color'   => $row['category_color'] ?? null,
                'subcategory_name' => $row['subcategory_name'] ?? null,
                'description'      => $row['description'] ?? null,
                'amount'           => $row['amount'] ?? 0,
                'date'             => $row['date'] ?? now(),
                'remarks'          => $row['remarks'] ?? null,
            ]);

            // 🔵 LOG EACH IMPORTED ENTRY
            LogActivity::add(
                "created",
                "expense",
                $expense->id,
                ["new" => $expense]
            );
        }

        return response()->json(['message' => 'CSV imported successfully']);
    }

    /**
     * DELETE /api/expenses/{id}
     */
    public function destroy($id)
    {
        $expense = Expense::where('user_id', auth()->id())
            ->findOrFail($id);

        $deletedBackup = $expense->toArray();

        $expense->delete();

        // 🔵 LOG ACTION — DELETED
        LogActivity::add(
            "deleted",
            "expense",
            $id,
            ["deleted" => $deletedBackup]
        );

        return response()->json([
            'message' => 'Expense deleted successfully'
        ]);
    }
}
