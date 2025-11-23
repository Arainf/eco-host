<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();

            // User who created the entry
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Core fields
            $table->string('expense_name');
            $table->string('category_name');
            $table->string('category_color')->nullable();
            $table->string('subcategory_name')->nullable();
            $table->text('description')->nullable();

            $table->decimal('amount', 10, 2);
            $table->date('date');

            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};
