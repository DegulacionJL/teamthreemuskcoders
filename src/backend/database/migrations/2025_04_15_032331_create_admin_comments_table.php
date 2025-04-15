<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admin_comments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('post_id');
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->text('content');
            $table->string('status')->default('pending');
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('user_id')->references('id')->on('admin_users')->onDelete('cascade');
            $table->foreign('post_id')->references('id')->on('admin_memes')->onDelete('cascade');
            $table->foreign('parent_id')->references('id')->on('admin_comments')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admin_comments');
    }
};