<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ExpenseController;
use App\Models\Category;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

//  VIEWS
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('categories', function () {
        return Inertia::render('categories');
    })->name('categories');

    Route::get('entrance', function () {
        return Inertia::render('entrance');
    })->name('entrance');

//  CATEGORY
    Route::get('/data/categories', [CategoryController::class, 'index']);
    Route::post('/data/categories', [CategoryController::class, 'store']);
    Route::get('/data/categories/{id}', [CategoryController::class, 'show']);
    Route::put('/data/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/data/categories/{id}', [CategoryController::class, 'destroy']);

// EXPENSES
    Route::get('/data/expenses', [ExpenseController::class, 'index']);
    Route::post('/data/expenses', [ExpenseController::class, 'store']);
    Route::post('/data/expenses/import', [ExpenseController::class, 'import']);
    Route::delete('/data/expenses/{id}', [ExpenseController::class, 'destroy']);

});



require __DIR__.'/settings.php';
