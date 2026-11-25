<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cars', function (Blueprint $table) {
            $table->id();
            $table->string('brand', 30);
            $table->string('model', 30);
            $table->unsignedInteger('price_per_day');
            $table->string('image')->default('');
            $table->timestamps();
        });

        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('car_id')->constrained()->cascadeOnDelete();
            $table->string('name', 80);
            $table->string('email', 120);
            $table->string('phone', 20);
            $table->string('address', 160);
            // calendar days as "YYYY-MM-DD", both included
            $table->date('from_date');
            $table->date('to_date');
            $table->unsignedInteger('days');
            $table->unsignedBigInteger('price');
            $table->timestamps();

            $table->index(['car_id', 'from_date', 'to_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
        Schema::dropIfExists('cars');
    }
};
