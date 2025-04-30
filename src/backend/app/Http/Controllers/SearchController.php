<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Post;
use App\Models\Hashtag;

class SearchController extends Controller
{
    public function search(Request $request)
{
    $query = $request->input('q');

    // Search Users (e.g., name or username)
    $users = User::where('name', 'LIKE', "%{$query}%")
        ->orWhere('username', 'LIKE', "%{$query}%")
        ->select('id', 'name', 'username', 'avatar') // restrict fields
        ->get();

    // Search Posts (captions)
    $posts = Post::where('caption', 'LIKE', "%{$query}%")
        ->with(['user:id,name,avatar']) // include user info
        ->get();

    // Search Hashtags (if you have a hashtags table)
    $hashtags = Hashtag::where('name', 'LIKE', "%{$query}%")->get();

    return response()->json([
        'users' => $users,
        'posts' => $posts,
        'hashtags' => $hashtags,
    ]);
}
}
