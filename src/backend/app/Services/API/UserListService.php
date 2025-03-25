<?php

namespace App\Services\API;

use DB;
use Hash;
use Mail;
use Exception;
use Carbon\Carbon;
use App\Models\User;
use App\Mail\InviteUser;
use App\Mail\UserSignUp;
use App\Models\UserStatus;
use App\Traits\Uploadable;
use App\Models\ActivationToken;
use Illuminate\Http\UploadedFile;
use App\Http\Resources\UserListResource;
use App\Exceptions\UserNotFoundException;
use App\Exceptions\UserNotCreatedException;
use App\Exceptions\UserStatusNotFoundException;
use App\Exceptions\ActivationTokenNotFoundException;

class UserListService
{
    use Uploadable;

    /**
     * @var App\Models\User
     */
    protected $user;

    /**
     * UserService constructor.
     *
     * @param App\Models\User $user
     */
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * List users by conditions
     */

     public function search(array $conditions): array
{
    // Default values
    $page = $conditions['page'] ?? 1;
    $limit = $conditions['limit'] ?? config('search.results_per_page');
    $sort = $conditions['sort'] ?? 'id'; // Default sort column
    $order = $conditions['order'] ?? 'asc'; // Default order
    $keyword = $conditions['keyword'] ?? null; // Ensure keyword is safe

    $skip = ($page > 1) ? ($page * $limit - $limit) : 0;

    // Initialize query properly
    $query = User::query(); // Ensure it queries the User model

    // Apply keyword filtering only if it exists
    if (!empty($keyword)) {
        $query->where('first_name', 'LIKE', "%{$keyword}%")
              ->orWhere('last_name', 'LIKE', "%{$keyword}%")
              ->orWhere('email', 'LIKE', "%{$keyword}%");
    }

    // Apply sorting and pagination
    $results = $query->orderBy($sort, $order)
                     ->skip($skip)
                     ->paginate($limit);

    $urlParams = ['keyword' => $keyword, 'limit' => $limit, 'sort' => $sort, 'order' => $order];

    // Ensure you are using the correct resource (UserListResource instead of UserResource)
    return paginated($results, UserListResource::class, $page, $urlParams);
}

     
    
}
