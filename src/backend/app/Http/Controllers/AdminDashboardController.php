<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Services\AdminDashboardService;
use App\Http\Resources\DashboardStatsResource;

class AdminDashboardController extends Controller
{
    protected $dashboardService;

    public function __construct(AdminDashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
        // You can add middleware here instead of using FormRequest
        // $this->middleware('role:admin');
    }

    /**
     * Get dashboard statistics
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getStats(Request $request)
    {
        Log::info('Fetching dashboard stats');

        try {
            // For testing/development, you can skip permission checks
            // In production, you should check permissions here or via middleware
            /*
            if (!$request->user() || !$request->user()->hasRole('admin')) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }
            */
            
            $stats = $this->dashboardService->getDashboardStats();
            
            Log::info('Dashboard stats:', $stats);
            
            return new DashboardStatsResource($stats);
        } catch (\Exception $e) {
            Log::error('Error fetching dashboard stats: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch stats: ' . $e->getMessage()], 500);
        }
    }
}