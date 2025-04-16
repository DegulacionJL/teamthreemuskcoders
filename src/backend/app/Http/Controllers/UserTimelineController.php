<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\User;
use App\Models\Post;
use App\Models\Follow;
use App\Services\API\UserTimelineService;
use App\Http\Resources\UserProfileResource;
use App\Http\Resources\PostCollection;
use App\Http\Requests\UserProfileRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;


class UserTimelineController extends Controller
{
    protected $userTimelineService;
    // protected $response;

    public function __construct(UserTimelineService $userTimelineService)
    {
        $this->response = ['code' => 200]; // Initialize response first
        $this->userTimelineService = $userTimelineService;
        $this->middleware('auth:api')->except(['getUserProfile', 'getUserPosts', 'getFriends', 'getPhotos']);
    }

    /**
     * Get user profile data for timeline
     * 
     * @param int $userId
     * @return JsonResponse
     */
    public function getUserProfile($userId): JsonResponse
    {
        try {
            $profileData = $this->userTimelineService->getUserProfile($userId);
            return response()->json(['data' => new UserProfileResource($profileData)], 200);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get user posts for timeline
     * 
     * @param int $userId
     * @param Request $request
     * @return JsonResponse
     */
    public function getUserPosts($userId, Request $request): JsonResponse
    {
        try {
            $page = $request->query('page', 1);
            $posts = $this->userTimelineService->getUserPosts($userId, $page);
            return response()->json(['data' => $posts], 200);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Update user profile
     * 
     * @param UserProfileRequest $request
     * @param int $userId
     * @return JsonResponse
     */
    public function updateProfile(UserProfileRequest $request, $userId): JsonResponse
    {
        // Check if user is authorized to update this profile
        if (Auth::id() != $userId) {
            return response()->json(['error' => 'Unauthorized. You can only update your own profile.'], 403);
        }

        try {
            $validatedData = $request->validated();
            $profile = $this->userTimelineService->updateUserProfile($userId, $validatedData);
            return response()->json(['data' => new UserProfileResource($profile)], 200);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Upload user avatar
     * 
     * @param Request $request
     * @param int $userId
     * @return JsonResponse
     */
    public function uploadAvatar(Request $request, $userId): JsonResponse
    {
        // Check if user is authorized to update this profile
        if (Auth::id() != $userId) {
            return response()->json(['error' => 'Unauthorized. You can only update your own profile.'], 403);
        }

        try {
            $request->validate([
                'avatar' => 'required|image|max:2048',
            ]);

            $avatar = $this->userTimelineService->uploadUserAvatar($userId, $request->file('avatar'));
            return response()->json(['data' => $avatar], 200);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Upload user cover photo
     * 
     * @param Request $request
     * @param int $userId
     * @return JsonResponse
     */
    public function uploadCoverPhoto(Request $request, $userId): JsonResponse
    {
        // Check if user is authorized to update this profile
        if (Auth::id() != $userId) {
            return response()->json(['error' => 'Unauthorized. You can only update your own profile.'], 403);
        }

        try {
            $request->validate([
                'coverPhoto' => 'required|image|max:2048',
            ]);

            $coverPhoto = $this->userTimelineService->uploadCoverPhoto($userId, $request->file('coverPhoto'));
            return response()->json(['data' => $coverPhoto], 200);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get user friends/followers
     * 
     * @param int $userId
     * @return JsonResponse
     */
    public function getFriends($userId): JsonResponse
    {
        try {
            $friends = $this->userTimelineService->getUserFriends($userId);
            return response()->json(['data' => $friends], 200);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get user photos
     * 
     * @param int $userId
     * @return JsonResponse
     */
    public function getPhotos($userId): JsonResponse
    {
        try {
            $photos = $this->userTimelineService->getUserPhotos($userId);
            return response()->json(['data' => $photos], 200);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}