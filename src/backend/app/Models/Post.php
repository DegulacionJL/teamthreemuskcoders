<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use App\Models\Image;
use App\Models\User;
use App\Models\Like;
use App\Models\Comment;

class Post extends Model
{
    use HasFactory;


    protected $fillable = ['caption', 'user_id'];

    public function user():BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function image(): HasOne
{
    return $this->hasOne(Image::class);
}

    public function likes():HasMany
    {
        return $this->hasMany(Like::class);
    }

    public function comments():HasMany
    {
        return $this->hasMany(Comment::class);
    }
}
