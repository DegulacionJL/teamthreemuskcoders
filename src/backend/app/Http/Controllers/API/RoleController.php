<?php

namespace App\Http\Controllers\API;

use Exception;
use Illuminate\Http\Request;
use App\Services\API\RoleService;
use App\Http\Controllers\Controller;
use App\Http\Resources\RoleResource;
use App\Http\Requests\API\Role\CreateRequest;
use App\Http\Requests\API\Role\SearchRequest;
use App\Http\Requests\API\Role\UpdateRequest;

class RoleController extends Controller
{
    /** @var App\Services\API\RoleService */
    protected $roleService;

    public function __construct(RoleService $roleService)
    {
        parent::__construct();

        $this->roleService = $roleService;

        $this->middleware(['auth:api', 'role:System Admin']);
       
    }

    public function index(SearchRequest $request)
    {
        $request->validated();

        try {
            $conditions = [
                'keyword' => $request->getKeyword(),
                'page' => $request->getPage(),
                'limit' => $request->getLimit(),
                'order' => $request->getOrder(),
                'sort' => $request->getSort(),
            ];

            $results = $this->roleService->search($conditions);
            $this->response = array_merge($results, $this->response);
        } catch (Exception $e) { // @codeCoverageIgnoreStart
            $this->response = [
                'error' => $e->getMessage(),
                'code' => 500,
            ];
        } // @codeCoverageIgnoreEnd

        return response()->json($this->response, $this->response['code']);
    }

    public function create(CreateRequest $request)
    {
        $request->validated();

        try {
            $formData = [
                'name' => $request->getName(),
                'permissions' => $request->getPermissions(),
            ];
            $role = $this->roleService->create($formData);
            $this->response['data'] = new RoleResource($role);
        } catch (Exception $e) { // @codeCoverageIgnoreStart
            $this->response = [
                'error' => $e->getMessage(),
                'code' => 500,
            ];
        } // @codeCoverageIgnoreEnd

        return response()->json($this->response, $this->response['code']);
    }

    public function read($id)
    {
        try {
            $user = $this->roleService->findById((int) $id);
            $this->response['data'] = new RoleResource($user);
        } catch (Exception $e) {
            $this->response = [
                'error' => $e->getMessage(),
                'code' => 500,
            ];
        }

        return response()->json($this->response, $this->response['code']);
    }

    public function update(UpdateRequest $request)
    {
        $request->validated();

        try {
            $formData = [
                'id' => $request->getId(),
                'name' => $request->getName(),
                'permissions' => $request->getPermissions(),
            ];
            $role = $this->roleService->update($formData);
            $this->response['data'] = new RoleResource($role);
        } catch (Exception $e) { // @codeCoverageIgnoreStart
            $this->response = [
                'error' => $e->getMessage(),
                'code' => 500,
            ];
        } // @codeCoverageIgnoreEnd

        return response()->json($this->response, $this->response['code']);
    }

    public function delete($id)
    {
        try {
            // perform user delete
            $this->response['deleted'] = $this->roleService->delete((int) $id);
        } catch (Exception $e) {
            $this->response = [
                'error' => $e->getMessage(),
                'code' => 500,
            ];
        }

        return response()->json($this->response, $this->response['code']);
    }
}