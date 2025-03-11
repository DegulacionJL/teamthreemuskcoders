<?php

namespace App\Services\API;
use App\Models\Like;
use App\Models\Comment;
use App\Models\Post;
use Illuminate\Support\Facades\Storage;
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

    $imagePath = null;

    // Store the image if provided
    if ($image) {
        $imagePath = env('STORAGE_DISK_URL').'/'.$image->store('images', 'public'); // Saves to storage/app/public/images
        // $imagePath = str_replace('public/', 'storage/', $imagePath); 
    }

    // Create the post with the image path
    $post = Post::create([
        'caption' => $caption,
        'user_id' => $user_id,
        'image' => $imagePath,
         // Save the image path in the database
    ]);
    // dump($imagePath);

    if (!$post) {
        return response()->json(['error' => 'Failed to create post'], 500);
    }

    return $post;
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

    public function updatePost($postId, $caption, $user_id)
    {
        $post = Post::findOrFail($postId);
    
        $post->caption = $caption;
        $post->user_id = $user_id;  
    
        $post->save();
    
        return $post;
    }
    
    public function updatePostImage($postId, $image)
    {
        $post = Post::findOrFail($postId);
    
        // ✅ Delete old image (Ensure correct path)
        if ($post->image) {
            $oldImagePath = str_replace(url('/storage/'), '', $post->image);
            if (Storage::disk('public')->exists($oldImagePath)) {
                Storage::disk('public')->delete($oldImagePath);
            }
        }
    
        // ✅ If image is base64, decode and store
        if (preg_match('/^data:image\/(\w+);base64,/', $image, $matches)) {
            $imageType = $matches[1];
            $image = substr($image, strpos($image, ',') + 1);
            $image = base64_decode($image);
    
            $imageName = 'post_' . time() . '.' . $imageType;
            $imagePath = "posts/{$imageName}";  // ✅ Save in public disk
    
            // ✅ Store in `storage/app/public/posts/`
            Storage::disk('public')->put($imagePath, $image);
    
            // ✅ Save only the relative path (not full URL)
            $post->image = $imagePath;
            $post->save();
        }
    
        // ✅ Return the correct URL
        return response()->json([
            'code' => 200,
            'data' => [
                'id' => $post->id,
                'image' => asset("storage/{$post->image}")  // Correct URL
            ]
        ]);
    }
    
    


    public function commentPost(int $post_id, int $user_id, string $content)
    {
       
        $comment = Comment::create([
            'post_id' => $post_id,
            'user_id' => $user_id,
            'content' => $content,
        ]);

        return $comment;
    }

    public function getPost($post_id)
    {
        $post = Post::find($post_id);

        if (!$post) {
            throw new Exception('Post not found');
        }

        return $post;
    }

    public function getPosts()
    {
        $posts = Post::all();

        return $posts;
    }

    public function getPostLikes($post_id)
    {
        $post = Post::find($post_id);

        if (!$post) {
            throw new Exception('Post not found');
        }

        $likes = $post->likes;

        return $likes;
    }

    public function getPostComments($post_id)
    {
        $post = Post::find($post_id);

        if (!$post) {
            throw new Exception('Post not found');
        }

        $comments = $post->comments;

        return $comments;
    }
}