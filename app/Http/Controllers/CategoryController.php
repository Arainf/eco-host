<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Subcategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    /**
     * GET /api/categories
     */
    public function index()
    {
        return Category::with('subcategories')->get();
    }

    /**
     * POST /api/categories
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'color'       => 'nullable|string|max:20',
            'subcategories' => 'array',
            'subcategories.*.name' => 'string|nullable'
        ]);

        $category = Category::create([
            'name'        => $validated['name'],
            'slug'        => Str::slug($validated['name']),
            'description' => $validated['description'] ?? null,
            'color'       => $validated['color'] ?? '#4CAF50',
        ]);

        // Create Subcategories
        if (!empty($validated['subcategories'])) {
            foreach ($validated['subcategories'] as $sub) {
                if (!empty($sub['name'])) {
                    Subcategory::create([
                        'category_id' => $category->id,
                        'name'        => $sub['name'],
                        'slug'        => Str::slug($sub['name']),
                    ]);
                }
            }
        }

        return response()->json($category->load('subcategories'), 201);
    }

    /**
     * GET /api/categories/{id}
     */
    public function show($id)
    {
        return Category::with('subcategories')->findOrFail($id);
    }

    /**
     * PUT /api/categories/{id}
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'color'       => 'nullable|string|max:20',
            'subcategories' => 'array',
            'subcategories.*.id'   => 'nullable|integer',
            'subcategories.*.name' => 'nullable|string',
        ]);

        $category = Category::findOrFail($id);

        // Update main fields
        $category->update([
            'name'        => $validated['name'],
            'slug'        => Str::slug($validated['name']),
            'description' => $validated['description'],
            'color'       => $validated['color'],
        ]);

        // Handle subcategories sync
        $newSubs = collect($validated['subcategories'] ?? []);

        // Delete removed subcategories
        $existingIds = $newSubs->pluck('id')->filter();
        Subcategory::where('category_id', $category->id)
            ->whereNotIn('id', $existingIds)
            ->delete();

        // Upsert & Create
        foreach ($newSubs as $sub) {
            if (!empty($sub['id'])) {
                // Update existing
                Subcategory::where('id', $sub['id'])->update([
                    'name' => $sub['name'],
                    'slug' => Str::slug($sub['name']),
                ]);
            } else {
                // Create new subcategory
                if (!empty($sub['name'])) {
                    Subcategory::create([
                        'category_id' => $category->id,
                        'name'        => $sub['name'],
                        'slug'        => Str::slug($sub['name']),
                    ]);
                }
            }
        }

        return response()->json($category->load('subcategories'));
    }

    /**
     * DELETE /api/categories/{id}
     */
    public function destroy($id)
    {
        $category = Category::findOrFail($id);

        // Cascade delete subcategories
        $category->subcategories()->delete();

        $category->delete();

        return response()->json(['message' => 'Category deleted.']);
    }
}
