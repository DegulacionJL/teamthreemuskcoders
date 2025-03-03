<?php

namespace App\Models;

<<<<<<< HEAD

=======
>>>>>>> 0453751b7e208afb25599fb18a420e9b197df56e
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
<<<<<<< HEAD
use App\Models\Image;
use App\Models\User;
use App\Models\Like;
use App\Models\Comment;
=======
>>>>>>> 0453751b7e208afb25599fb18a420e9b197df56e

class Post extends Model
{
    use HasFactory;

<<<<<<< HEAD

    protected $fillable = ['caption', 'user_id'];

    public function image(): BelongsTo
    {
        return $this->belongsTo(Image::class);
    }

    public function user():BelongsTo
=======
    protected array $fillable = [
        'caption',
    ];

    public function user(): BelongsTo
>>>>>>> 0453751b7e208afb25599fb18a420e9b197df56e
    {
        return $this->belongsTo(User::class);
    }

<<<<<<< HEAD
    public function likes():HasMany
    {
        return $this->hasMany(Like::class);
    }

    public function comments():HasMany
    {
        return $this->hasMany(Comment::class);
    }
=======
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function reactions(): HasMany
    {
        return $this->hasMany(Reaction::class);
    }
>>>>>>> 0453751b7e208afb25599fb18a420e9b197df56e
}
