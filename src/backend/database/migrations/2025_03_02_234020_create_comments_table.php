<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('comments', function (Blueprint $table) {
             $table->id();
        $table->foreignId('post_id')->constrained('posts')->onDelete('cascade');
        $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
        $table->foreignId('parent_id')->nullable()->constrained('comments')->onDelete('cascade');
        $table->text('text');
        $table->string('image')->nullable(); // Add this line for image support
        $table->timestamps();
            
        });
    }

    public function down()
    {
        Schema::dropIfExists('comments');
    }
};