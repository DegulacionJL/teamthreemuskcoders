<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Exception;
use App\Models\User;
use App\Services\API\FollowService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class FollowController extends Controller
{
    protected $followService;

    public function __construct(FollowService $followService)
    {
        $this->response = ['code'=> 200];
        $this->followService = $followService;
        $this->middleware(['auth:api']);
    }

    public function follow(Request $request, $id)
    {
        try {
            Log::info("Follow API HIT — User ID: " . Auth::id() . ", Target ID: {$id}");
            $user = Auth::user();
            $message = $this->followService->follow($user, $id);

            return response()->json([
                'success' => true,
                'message' => $message
            ]);
        } catch (Exception $e) {
            Log::error("Follow API Error: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to follow user: ' . $e->getMessage()
            ], 500);
        }
    }

    public function unfollow(Request $request, $id)
    {
        try {
            Log::info("Unfollow API HIT — User ID: " . Auth::id() . ", Target ID: {$id}");
            $user = Auth::user();
            $message = $this->followService->unfollow($user, $id);

            return response()->json([
                'success' => true,
                'message' => $message
            ]);
        } catch (Exception $e) {
            Log::error("Unfollow API Error: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to unfollow user: ' . $e->getMessage()
            ], 500);
        }
    }

    public function isFollowing($id)
    {
        try {
            $user = Auth::user();
            $status = $this->followService->isFollowing($user, $id);

            return response()->json([
                'success' => true,
                'isFollowing' => $status
            ]);
        } catch (Exception $e) {
            Log::error("isFollowing API Error: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'isFollowing' => false,
                'message' => 'Failed to check following status: ' . $e->getMessage()
            ], 500);
        }
    }
}
