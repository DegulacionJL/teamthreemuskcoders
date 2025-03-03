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
        Schema::create('comments', function (Blueprint $table) {
            $table->id(); // This will create an unsignedBigInteger primary key
            $table->string('content');
            $table->unsignedBigInteger('users_id');
            $table->unsignedBigInteger('posts_id');
            $table->timestamps();

            $table->foreign('users_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

            $table->foreign('posts_id')
                ->references('id')
                ->on('posts')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};