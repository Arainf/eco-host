<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    /**
     * GET /api/expenses
     * List all expenses (for history or dashboard)
     */
    public function index()
    {
        return Expense::where('user_id', auth()->id())
            ->orderBy('date', 'desc')
            ->get();
    }

    /**
     * POST /api/expenses
     * Manual entry from the Data Entry page
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'expense_name'      => 'required|string|max:255',

            // Names instead of foreign keys
            'category_name'     => 'required|string|max:255',
            'category_color'    => 'nullable|string|max:20',
            'subcategory_name'  => 'nullable|string|max:255',

            'description'       => 'nullable|string',
            'amount'            => 'required|numeric|min:0',
            'date'              => 'required|date',
            'remarks'           => 'nullable|string',
        ]);

        // Attach user who added the record
        $validated['user_id'] = auth()->id();

        $expense = Expense::create($validated);

        return response()->json($expense, 201);
    }

    /**
     * POST /api/expenses/import
     * Bulk CSV import
     */
    public function import(Request $request)
    {
        $rows = $request->input('rows', []);

        foreach ($rows as $row) {
            Expense::create([
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

        $expense->delete();

        return response()->json([
            'message' => 'Expense deleted successfully'
        ]);
    }
}
