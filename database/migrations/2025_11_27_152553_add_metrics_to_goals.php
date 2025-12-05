<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('goals', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('user_id');

            // KPI metric identifier
            // Allowed: energy_cost, water_cost, sustainable_purchases, savings
            $table->string('metric_key');

            // Human-readable name (ex: "Energy Cost Reduction Goal")
            $table->string('name');

            // Optional: description
            $table->text('description')->nullable();

            // Range goal (Ex: 5–10% reduction target)
            $table->unsignedTinyInteger('target_min_pct')->nullable();
            $table->unsignedTinyInteger('target_max_pct')->nullable();

            // Unit (optional): "%", "₱", "kWh", "L", etc.
            $table->string('unit', 10)->nullable();

            // Optional deadline
            $table->date('deadline')->nullable();

            // Completion status
            $table->boolean('completed')->default(false);

            $table->timestamps();

            // Foreign key
            $table->foreign('user_id')
                ->references('id')->on('users')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('goals');
    }
};
