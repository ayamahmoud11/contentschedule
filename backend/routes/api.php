<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\PlatformController;
use App\Models\ActivityLog;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/posts', [PostController::class, 'index']);
    Route::post('/posts', [PostController::class, 'store']);
    Route::get('/posts/{id}', [PostController::class, 'show']);
    Route::put('/posts/{id}', [PostController::class, 'update']);
    Route::delete('/posts/{id}', [PostController::class, 'destroy']);

    Route::get('/platforms', [PlatformController::class, 'index']);

    Route::get('/analytics', [PostController::class, 'analytics']);

    Route::get('/logs', function () {
        $user = Auth::user();

        return response()->json([
            'user_id' => Auth::id(),
            'user_name' => $user->name,
            'logs' => ActivityLog::where('user_id', Auth::id())->latest()->get(),
        ]);   
     });
});
