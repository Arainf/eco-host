<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\GoalController;
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

    Route::get('sustainability', function () {
        return Inertia::render('sustainability');
    })->name('sustainability');

    Route::get('activity', function () {
        return Inertia::render('activity');
    })->name('activity');

//  CATEGORY
    Route::get('/data/categories', [CategoryController::class, 'index']);
    Route::post('/data/categories', [CategoryController::class, 'store']);
    Route::get('/data/categories/{id}', [CategoryController::class, 'show']);
    Route::put('/data/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/data/categories/{id}', [CategoryController::class, 'destroy']);

// EXPENSES
    Route::get('/data/expenses', [ExpenseController::class, 'index']);
    Route::post('/data/expenses', [ExpenseController::class, 'store']);
    Route::put('/data/expenses/{id}', [ExpenseController::class, 'update']);
    Route::post('/data/expenses/import', [ExpenseController::class, 'import']);
    Route::delete('/data/expenses/{id}', [ExpenseController::class, 'destroy']);

    // SUSTAINABILITY GOALS
// GOALS API
    Route::get('/data/goals', [GoalController::class, 'index']);
    Route::post('/data/goals', [GoalController::class, 'store']);
    Route::put('/data/goals/{id}', [GoalController::class, 'update']);
    Route::delete('/data/goals/{id}', [GoalController::class, 'destroy']);

    Route::get('/data/activity', [ActivityController::class, 'index']);


});



require __DIR__.'/settings.php';
