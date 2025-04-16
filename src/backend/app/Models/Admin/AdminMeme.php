<?php

namespace App\Models\Admin;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class AdminMeme extends Model
{
    use HasFactory;

    protected $table = 'admin_memes';

    protected $fillable = [
        'original_id',
        'user_id',
        'post_id',
        'image_path',
        'description',
        'status',
    ];

    /**
     * Get the user that owns the meme.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(AdminUser::class, 'user_id');
    }

    /**
     * Get all of the meme's reports.
     */
    public function reports(): MorphMany
    {
        return $this->morphMany(AdminReport::class, 'reportable');
    }
}