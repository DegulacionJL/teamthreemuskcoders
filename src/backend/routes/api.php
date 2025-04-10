<?php

use Laravel\Passport\Passport;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\HomeController;
use App\Http\Controllers\API\RoleController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\InquiryController;
use App\Http\Controllers\API\ProfileController;
use App\Http\Controllers\API\Auth\TokenController;
use App\Http\Controllers\API\PermissionController;
use App\Http\Controllers\API\NotificationController;
use App\Http\Controllers\API\Auth\PasswordController;
use App\Http\Controllers\calculateController;
use App\Http\Controllers\CommentController;
use Laravel\Passport\Http\Controllers\AccessTokenController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserListController;
use App\Http\Controllers\FollowController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
Route::post('/oauth/token', [AccessTokenController::class, 'issueToken'])->middleware('throttle')->name('passport.auth');

// Default API Homepage
Route::get('/', [HomeController::class, '__invoke']);

// Profile
Route::get('/profile', [ProfileController::class, 'index']);
Route::put('/profile', [ProfileController::class, 'update']);

Route::prefix('posts')
    ->group(function () {
        Route::get('/', [PostController::class, 'index']);
        Route::post('/', [PostController::class, 'createMemePost'])->middleware('auth:api');
        Route::put('/{post}', [PostController::class, 'updatePost'])->middleware('auth:api');
        Route::delete('/{post}', [PostController::class, 'deletePost'])->middleware('auth:api');
        Route::post('/{post}/image', [PostController::class, 'updatePostImage'])->middleware('auth:api');
    });

    Route::prefix('likes')->group(function() {
        Route::post('/{post}', [PostController::class, 'likePost'])->middleware('auth:api');
        Route::post('/{post}/unlike', [PostController::class, 'unlikePost'])->middleware('auth:api');
        Route::get('/{post}/likes', [PostController::class, 'getLikes'])->middleware('auth:api');
    });
    
    
// user logout
Route::delete('oauth/token', [TokenController::class, 'delete'])->middleware('auth:api');
Route::get('/token/verify', [TokenController::class, 'verify']);

Route::post('register', [UserController::class, 'register']);

Route::post('activate', [UserController::class, 'activate']);

// Routes for Forget and Reset Password
Route::post('password/forgot', [PasswordController::class, 'forgot']);
Route::post('password/reset', [PasswordController::class, 'reset']);

// users route
Route::prefix('users')
    ->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::post('/', [UserController::class, 'create']);
        Route::get('{id}', [UserController::class, 'read']);
        Route::put('{id}', [UserController::class, 'update']);
        Route::delete('bulk-delete', [UserController::class, 'bulkDelete']);
        Route::delete('{id}', [UserController::class, 'delete']);
    });
    Route::prefix('userlist')
    ->group(function () {
        Route::get('/', [UserListController::class, 'index'])->middleware('auth:api');
        Route::post('/', [UserController::class, 'create']);
        Route::get('{id}', [UserController::class, 'read']);
        Route::put('{id}', [UserController::class, 'update']);
        Route::delete('bulk-delete', [UserController::class, 'bulkDelete']);
        Route::delete('{id}', [UserController::class, 'delete']);
    });

    // Follow routes - update to use auth:api middleware to match your frontend
Route::middleware('auth:api')->group(function () {
    Route::post('/follow/{id}', [FollowController::class, 'follow']);
    Route::post('/follow/{id}/unfollow', [FollowController::class, 'unfollow']);
    Route::get('/is-following/{id}', [FollowController::class, 'isFollowing']);
});

Route::post('/inquiries', [InquiryController::class, 'create']);

// roles route
Route::prefix('roles')
    ->group(function () {
        Route::get('/', [RoleController::class, 'index']);
        Route::post('/', [RoleController::class, 'create']);
        Route::get('{id}', [RoleController::class, 'read']);
        Route::put('{id}', [RoleController::class, 'update']);
        Route::delete('{id}', [RoleController::class, 'delete']);
    });
    
Route::post('/add', [calculateController::class, 'addition']);
Route::post('/sub', [calculateController::class, 'subtraction']);
Route::post('/mul', [calculateController::class, 'multiplication']);
Route::post('/div', [calculateController::class, 'division']);


// comments route
Route::prefix('posts/{postId}/comments')->group(function () {
    Route::get('/', [CommentController::class, 'index']); // ✅ Get comments
    Route::post('/', [CommentController::class, 'store'])->middleware('auth:api'); // ✅ Add comment
    Route::put('/{commentId}', [CommentController::class, 'update'])->middleware('auth:api'); // ✅ Update comment
    Route::delete('/{commentId}', [CommentController::class, 'destroy'])->middleware('auth:api');
});

Route::get('permissions', [PermissionController::class, 'index']);

Route::get('notifications', [NotificationController::class, 'index']);
Route::put('notifications/{id}/seen', [NotificationController::class, 'seen']);
// DEMO PURPOSES ONLY. REMOVE ON ACTUAL PROJECT
Route::post('notifications/test', [NotificationController::class, 'create']);
