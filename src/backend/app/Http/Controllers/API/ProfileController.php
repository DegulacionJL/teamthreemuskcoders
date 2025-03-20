<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Services\API\UserService;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProfileResource;
use App\Http\Requests\API\UpdateProfileRequest;
use Exception;

/**
 * @group Profile Management
 */
class ProfileController extends Controller
{
    /** @var App\Services\API\UserService */
    protected $userService;

    /**
     * ProfileController constructor.
     *
     * @param App\Services\API\UserService $userService
     */
    public function __construct(UserService $userService)
    {
        parent::__construct();

        $this->userService = $userService;

        // enable api middleware
        $this->middleware('auth:api');
    }

    /**
     * User Profile
     *
     * Retrieves the information of the current user.
     *
     * @authenticated
     * @param Illuminate\Http\Request $request
     * @return Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {
            $user = $this->userService->findById((int) $request->user()->id);
            $this->response['data'] = new ProfileResource($user);
        } catch (Exception $e) {  // @codeCoverageIgnoreStart
            $this->response = [
                'error' => $e->getMessage(),
                'code' => 500,
            ];
        }  // @codeCoverageIgnoreEnd

        return response()->json($this->response, $this->response['code']);
    }

    /**
     * Profile Update
     *
     * Updates the current user information in the database.
     *
     * @authenticated
     * @param App\Http\Requests\API\UpdateProfileRequest $request
     * @return Illuminate\Http\Response
     */
    public function update(UpdateProfileRequest $request)
    {
        $request->validated();

        try {
            $formData = [
                'id' => $request->getId(),
                'first_name' => $request->getFirstName(),
                'last_name' => $request->getLastName(),
                'email' => $request->getEmail(),
                'password' => $request->getPassword(),
                'avatar' => $request->getAvatar(),
                'role' => $request->getRole(),
            ];

            $user = $this->userService->update($formData);
            $this->response['data'] = new ProfileResource($user);
        } catch (Exception $e) { // @codeCoverageIgnoreStart
            $this->response = [
                'error' => $e->getMessage(),
                'code' => 500,
            ];
        } // @codeCoverageIgnoreEnd

        return response()->json($this->response, $this->response['code']);
    }
}
