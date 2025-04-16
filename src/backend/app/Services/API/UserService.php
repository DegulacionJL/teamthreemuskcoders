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
use App\Http\Resources\UserResource;
use App\Exceptions\UserNotFoundException;
use App\Exceptions\UserNotCreatedException;
use App\Exceptions\UserStatusNotFoundException;
use App\Exceptions\ActivationTokenNotFoundException;

class UserService
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
        // default to 1 if page not provided
        $page = 1;
        $limit = config('search.results_per_page');

        if (array_key_exists('page', $conditions) === true) {
            $page = $conditions['page'];
        }

        if (array_key_exists('limit', $conditions) === true) {
            $limit = $conditions['limit'];
        }

        $skip = ($page > 1) ? ($page * $limit - $limit) : 0;

        // initialize query
        $query = $this->user;

        // if keyword is provided
        if (array_key_exists('keyword', $conditions)) {
            $query = $query->where('first_name', 'LIKE', "%{$conditions['keyword']}%")
                        ->orWhere('last_name', 'LIKE', "%{$conditions['keyword']}%")
                        ->orWhere('email', 'LIKE', "%{$conditions['keyword']}%");
        }

        // perform user search
        $results = $query->skip($skip)
                        ->orderBy($conditions['sort'], $conditions['order'])
                        ->paginate($limit);

        $urlParams = ['keyword' => $conditions['keyword'], 'limit' => $limit];

        return paginated($results, UserResource::class, $page, $urlParams);
    }

    /**
     * Creates a new user in the database
     * type = signup  User Signup
     * type = invite  User Added via Dashboard
     *
     * @param array $params
     */
    public function create(array $params): User
    {
        DB::beginTransaction();

        try {
            $params['password'] = Hash::make($params['password']);
            $status = UserStatus::where('name', config('user.statuses.pending'))->firstOrFail();

            // get create type. set default to invite if not provided
            $type = array_key_exists('type', $params) ? $params['type'] : 'invite';
            unset($params['type']);

            // get role
            $role = $params['role'];
            unset($params['role']);

            $params['user_status_id'] = $status->id;
            $user = $this->user->create($params);
            $user->assignRole($role);
            $user->role = count($user->roles) > 0 ? $user->roles[0]->name : null;

            if (!($user instanceof User)) { // @codeCoverageIgnoreStart
                throw new UserNotCreatedException();
            } // @codeCoverageIgnoreEnd

            $token = Hash::make(time() . uniqid());

            $user->activationTokens()->save(new ActivationToken(['token' => $token]));

            // send email
            $template = ('signup' === $type) ? UserSignUp::class : InviteUser::class;
            Mail::to($user)->send(new $template($user, $token));

            DB::commit();
        } catch (Exception $e) {
            DB::rollback();

            throw $e;
        }

        return $user;
    }

    /**
     * Updates user in the database
     */
    public function update(array $params): User
    {
        // retrieve user information
        $user = $this->findById($params['id']);

        if (array_key_exists('password', $params)) {
            // update user password if provided in request or retain the current password
            $params['password'] = strlen($params['password']) > 0 ?
                                    Hash::make($params['password']) :
                                    $user->password;
        }

        // upload avatar if present
        if (array_key_exists('avatar', $params)) {
            $params['avatar'] = ($params['avatar'] instanceof UploadedFile) ?
                                config('app.storage_disk_url') . '/' . $this->uploadOne($params['avatar'], 'avatars') :
                                $user->avatar;
        }

        // get role
        $role = $params['role'];
        unset($params['role']);

        // perform update
        $user->update($params);
        $user->assignRole($role);

        return $user;
    }

    /**
     * Deletes the user in the database
     */
    public function delete(int $id): bool
    {
        // retrieve user
        $user = $this->findById($id);

        // perform delete
        $user->delete();

        return true;
    }

    /**
     * Delete multiple users in the database
     */
    public function bulkDelete(array $ids): bool
    {
        return $this->user->whereIn('id', $ids)->delete();
    }

    /**
     * Service function that activates the user account.
     */
    public function activate(array $data): User
    {
        $activationToken = ActivationToken::with('user.status')
                                        ->where('token', $data['token'])
                                        ->first();

        if (!($activationToken instanceof ActivationToken)) {
            throw new ActivationTokenNotFoundException();
        }

        $status = UserStatus::where('name', config('user.statuses.active'))->firstOrFail();

        $user = $activationToken->user;

        // set form data
        $formData = [
            'password' => Hash::make($data['password']),
            'user_status_id' => $status->id,
            'email_verified_at' => Carbon::now(),
        ];

        // update user details
        $user->update($formData);

        // retrieve updated user instance
        $user = User::with('status')->find($user->id);

        // revoke the token
        $activationToken->delete();

        return $user;
    }

    /**
     * Retrieves a user by email
     */
    public function findByEmail(string $email): User
    {
        // retrieve the user
        $user = $this->user
                    ->where('email', $email)
                    ->first();

        if (!($user instanceof User)) {
            throw new UserNotFoundException();
        }

        return $user;
    }

    /**
     * Retrieves a user by id
     */
    public function findById(int $id): User
    {
        // retrieve the user
        $user = $this->user->find($id);

        if (!($user instanceof User)) {
            throw new UserNotFoundException();
        }

        return $user;
    }
}
