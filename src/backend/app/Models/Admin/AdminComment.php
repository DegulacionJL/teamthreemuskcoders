<?php

namespace App\Models\Admin;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class AdminComment extends Model
{
    use HasFactory;

    protected $table = 'admin_comments';

    protected $fillable = [
        'original_id',
        'user_id',
        'post_id',
        'parent_id',
        'content',
        'status',
    ];

    /**
     * Get the user who authored the comment.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(AdminUser::class, 'user_id');
    }

    /**
     * Get the post that the comment belongs to.
     */
    public function post(): BelongsTo
    {
        return $this->belongsTo(AdminMeme::class, 'post_id');
    }

    /**
     * Get the parent comment.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(AdminComment::class, 'parent_id');
    }

    /**
     * Get all of the comment's reports.
     */
    public function reports(): MorphMany
    {
        return $this->morphMany(AdminReport::class, 'reportable');
    }
}