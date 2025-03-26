<?php

namespace App\Http\Controllers;

use Exception;

use App\Services\API\UserListService;
use App\Http\Controllers\Controller;

use App\Http\Requests\SearchUserListRequest;


class UserListController extends Controller
{
    protected $UserListService;
    public function __construct(UserListService $UserListService)
    {
        parent::__construct();

        $this->UserListService = $UserListService;
        $this->middleware(['auth:api']); // Remove 'role:System Admin' globally



    }
    public function index(SearchUserListRequest $request)
{
    $request->validated();

    try {
        $conditions = [
            'keyword' => $request->getKeyword(),
            'page' => $request->getPage(),
            'limit' => $request->getLimit(),
            'order' => $request->getOrder() ?? 'asc', // Default order
            'sort' => $request->getSort() ?? 'id', // Default sorting column
        ];

        $results = $this->UserListService->search($conditions);
        $this->response = array_merge($results, $this->response);
    } catch (Exception $e) { // @codeCoverageIgnoreStart
        $this->response = [
            'error' => $e->getMessage(),
            'code' => 500,
        ];
    } // @codeCoverageIgnoreEnd

    return response()->json($this->response, $this->response['code']);
}


}
