<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::dropIfExists('goals'); // recreate cleanly (BE CAREFUL in prod)

        Schema::create('goals', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('user_id');
            $table->string('name')->nullable(false);
            $table->text('description')->nullable();
            $table->string('category_name');        // from categories table name
            $table->string('category_color')->nullable();
            $table->decimal('target_amount', 14, 2); // target value (₱ or unit)
            $table->decimal('current_amount', 14, 2)->default(0); // computed from expenses
            $table->enum('status', ['pending','on_target','over_target','completed'])->default('pending');
            $table->date('deadline')->nullable();
            $table->text('notes')->nullable();

            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('goals');
    }
};
