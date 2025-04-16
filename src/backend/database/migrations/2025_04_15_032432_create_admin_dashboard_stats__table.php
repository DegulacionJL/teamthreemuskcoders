<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dashboard_stats', function (Blueprint $table) {
            $table->id();
            $table->date('stat_date');
            $table->unsignedInteger('total_users')->default(0);
            $table->unsignedInteger('new_users')->default(0);
            $table->unsignedInteger('active_users')->default(0);
            $table->unsignedInteger('banned_users')->default(0);
            $table->unsignedInteger('total_memes')->default(0);
            $table->unsignedInteger('reported_memes')->default(0);
            $table->unsignedInteger('reported_comments')->default(0);
            $table->unsignedInteger('active_users_today')->default(0);
            $table->unsignedInteger('new_memes_today')->default(0);
            $table->unsignedInteger('reported_content_today')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dashboard_stats');
    }
};