<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
<<<<<<< HEAD
use App\Models\User;
use App\Models\Post;    
=======
>>>>>>> 0453751b7e208afb25599fb18a420e9b197df56e

class Comment extends Model
{
    use HasFactory;

<<<<<<< HEAD

    protected $fillable = [
        'content',
=======
    protected array $fillable = [
        'user_id',
        'post_id',
        'comment'
>>>>>>> 0453751b7e208afb25599fb18a420e9b197df56e
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
<<<<<<< HEAD

=======
>>>>>>> 0453751b7e208afb25599fb18a420e9b197df56e
    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }
<<<<<<< HEAD



=======
>>>>>>> 0453751b7e208afb25599fb18a420e9b197df56e
}
