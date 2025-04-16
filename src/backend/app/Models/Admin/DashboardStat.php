<?php

namespace App\Models\Admin;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DashboardStat extends Model
{
    use HasFactory;

    protected $table = 'dashboard_stats';

    protected $fillable = [
        'stat_date',
        'total_users',
        'new_users',
        'active_users',
        'banned_users',
        'total_memes',
        'reported_memes',
        'reported_comments',
        'active_users_today',
        'new_memes_today',
        'reported_content_today',
    ];

    protected $casts = [
        'stat_date' => 'date',
    ];
}