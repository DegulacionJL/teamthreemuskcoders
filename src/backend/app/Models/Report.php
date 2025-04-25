<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class Report extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['user_id', 'reportable_id', 'reportable_type', 'reason', 'status'];

    /**
     * Get the reportable model (Post or Comment)
     */
    public function reportable()
    {
        return $this->morphTo();
    }

    /**
     * Get the user who made the report
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Log debug information for the report creation
     */
    public static function logReportCreation($report)
    {
        Log::debug('Report Created:', [
            'user_id' => $report->user_id,
            'reportable_id' => $report->reportable_id,
            'reportable_type' => $report->reportable_type,
            'reason' => $report->reason,
            'status' => $report->status,
        ]);
    }
}
