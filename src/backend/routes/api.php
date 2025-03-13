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
use Laravel\Passport\Http\Controllers\AccessTokenController;
use App\Http\Controllers\PostController;

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
        Route::delete('/{post}', [PostController::class, 'deletePost']);
        Route::post('/{post}/image', [PostController::class, 'updatePostImage'])->middleware('auth:api');

    
        
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

Route::get('permissions', [PermissionController::class, 'index']);

Route::get('notifications', [NotificationController::class, 'index']);
Route::put('notifications/{id}/seen', [NotificationController::class, 'seen']);
// DEMO PURPOSES ONLY. REMOVE ON ACTUAL PROJECT
Route::post('notifications/test', [NotificationController::class, 'create']);
