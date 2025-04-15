<?php

namespace App\Services;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Post;
use App\Models\Comment;
use App\Models\Report;
use Illuminate\Support\Facades\DB;

class AdminDashboardService
{
    /**
     * Get all dashboard statistics
     *
     * @return array
     */
    public function getDashboardStats()
    {
        $today = Carbon::today();
        
        return [
            // User statistics
            'total_users' => User::count(),
            'new_users' => User::whereDate('created_at', $today)->count(),
            'active_users' => User::where('user_status_id', 1)->count(), // Assuming 1 is active status
            'banned_users' => User::where('user_status_id', 2)->count(), // Assuming 2 is banned status
            'active_users_today' => $this->getActiveUsersToday(),
            
            // Meme (Post) statistics
            'total_memes' => Post::count(),
            'new_memes_today' => Post::whereDate('created_at', $today)->count(),
            
            // Report statistics
            'reported_memes' => Report::where('reportable_type', Post::class)->count(),
            'reported_comments' => Report::where('reportable_type', Comment::class)->count(),
            'reported_content_today' => Report::whereDate('created_at', $today)->count(),
        ];
    }
    
    /**
     * Get count of users active today (with activity)
     * 
     * @return int
     */
    private function getActiveUsersToday()
    {
        $today = Carbon::today();
        
        // Get unique users who created posts or comments today
        $activeUserIds = DB::table(function ($query) use ($today) {
            $query->select('user_id')
                ->from('posts')
                ->whereDate('created_at', $today)
                ->union(
                    DB::table('comments')
                        ->select('user_id')
                        ->whereDate('created_at', $today)
                );
        }, 'active_users')->distinct()->count('user_id');
        
        return $activeUserIds;
    }
}