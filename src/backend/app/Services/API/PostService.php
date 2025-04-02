<?php

namespace App\Services\API;

use App\Models\Post;
use App\Models\Like;
use App\Models\Comment;
use App\Models\Image;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Exception;

class PostService
{

    protected $post;

    public function __construct(Post $post)
    {
        $this->post = $post;
    }

    public function createMemePost(string $caption, $image, int $user_id)
    {
        if (!$user_id) {
            throw new Exception('User ID is missing');
        }

        try {
            // Create the post first
            $post = Post::create([
                'caption' => $caption,
                'user_id' => $user_id
            ]);

            // Handle image if provided
            if ($image) {
                $imagePath = env('STORAGE_DISK_URL').'/'.$image->store('images', 'public');

                Image::create([
                    'post_id' => $post->id,
                    'user_id' => $user_id,  
                    'image_path' => $imagePath
                ]);
            }

            return $post->load('image'); // Eager load image relationship
        } catch (\Exception $e) {
            throw new Exception("Error creating post: " . $e->getMessage());
        }
    }
    public function likePost(int $post_id, int $user_id)
    {
        // Create the like
        $like = Like::create([
            'post_id' => $post_id,
            'user_id' => $user_id,
        ]);

        return $like;
    }

    public function updatePost(Post $post, $caption)
    {
        if ($post->user_id !== Auth::id()){
            throw new Exception ("Unauthorized. You can only edit your own posts.");
        }
        $post->update(['caption' => $caption]);
        return $post->load('image');
    }

    public function updatePostImage(Post $post, $imageFile)
{
    $userId = auth()->id();
    if ($post->user_id !== $userId) {
        throw new Exception("Unauthorized. You can only edit your own posts.");
    }

    // Ensure $imageFile is a valid uploaded file
    if (!$imageFile || !$imageFile->isValid()) {
        return response()->json([
            'id' => $post->id,
            'caption' => $post->caption,
            'image' => [
                'image_path' => $imageFile->image_path . '?t=' . time(),
            ],
        ]);
    }

    // Check if post already has an associated image
    $image = $post->image ?? new Image([
        'post_id' => $post->id,
        'user_id' => $userId,
    ]);

    // Delete the old image if it exists
    if ($image->image_path) {
        Storage::disk('public')->delete(str_replace(env('STORAGE_DISK_URL') . '/', '', $image->image_path));
    }

    // Store the new image in 'storage/app/public/images'
    $imagePath = $imageFile->store('images', 'public');

    // Save the image path in the database (use full URL)
    $image->image_path = env('STORAGE_DISK_URL') . '/' . $imagePath;
    $image->save();

    return $post->load('image');
}

public function getPosts($page = 1)
    {
        // Fetch posts with pagination, including related user and image data
        $posts = Post::with('user', 'image')
            ->latest()
            ->paginate(10, ['*'], 'page', $page);

        // Return data with pagination information
        return [
            'posts' => $posts->items(),
            'currentPage' => $posts->currentPage(),
            'lastPage' => $posts->lastPage(),
            'total' => $posts->total(),
            'currentUser' => auth()->user(),
        ];
    }
}