<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Subcategory;
use Illuminate\Database\Seeder;
use Str;

class CategorySeeder extends Seeder
{
    public function run()
    {
        $data = [
            [
                'name' => 'Energy Consumption',
                'color' => '#FF4D4D',
                'description' => 'Tracks all energy-related costs to monitor efficiency and detect high-consumption areas.',
                'subcategories' => [
                    'Electricity',
                    'Fuel',
                ],
            ],
            [
                'name' => 'Water Usage',
                'color' => '#4DA6FF',
                'description' => 'Records all expenses related to water procurement, consumption, and treatment.',
                'subcategories' => [
                    'Tap Water',
                    'Drinking Water',
                    'Waste Water Services',
                ],
            ],
            [
                'name' => 'Waste Management',
                'color' => '#33CC66',
                'description' => 'Captures expenses related to waste handling, recycling, and disposal.',
                'subcategories' => [
                    'Solid Waste Disposal',
                    'Recycling Initiatives',
                    'Hazardous Waste',
                ],
            ],
            [
                'name' => 'Sustainable Procurement',
                'color' => '#FFEB3B',
                'description' => 'Monitors sustainable sourcing and eco-friendly purchases.',
                'subcategories' => [
                    'Eco-friendly Materials',
                    'Energy-efficient Devices',
                    'Green Vendors',
                ],
            ],
            [
                'name' => 'Miscellaneous Eco-Expenses',
                'color' => '#BDBDBD',
                'description' => 'Covers other eco-related expenses not listed above.',
                'subcategories' => [
                    'Tree-planting',
                    'Community Drives',
                ],
            ],
            [
                'name' => 'Other Costs',
                'color' => '#000000',
                'description' => 'Represents general operational and financial expenditures not related to environmental activities.',
                'subcategories' => [
                    'Rent and Utilities',
                    'Salaries and Wages',
                    'Supplies and Inventory',
                    'Marketing and Advertising',
                    'Transportation and Delivery',
                    'Equipment Maintenance',
                    'Taxes and Fees',
                    'Miscellaneous Business Costs',
                ],
            ],
        ];


        foreach ($data as $cat) {
            $category = Category::create([
                'name' => $cat['name'],
                'slug' => Str::slug($cat['name']),
                'color' => $cat['color'],
                'description' => $cat['description'],
            ]);

            foreach ($cat['subcategories'] as $sub) {
                Subcategory::create([
                    'category_id' => $category->id,
                    'name' => $sub,
                    'slug' => Str::slug($sub),
                ]);
            }
        }
    }
}
