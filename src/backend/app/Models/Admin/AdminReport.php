<?php

namespace App\Models\Admin;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class AdminReport extends Model
{
    use HasFactory;

    protected $table = 'admin_reports';

    protected $fillable = [
        'reporter_id',
        'reportable_type',
        'reportable_id',
        'reason',
        'status',
    ];

    /**
     * Get the parent reportable model (meme or comment).
     */
    public function reportable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Get the user who created the report.
     */
    public function reporter()
    {
        return $this->belongsTo(AdminUser::class, 'reporter_id');
    }
}