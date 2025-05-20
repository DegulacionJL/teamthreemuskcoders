<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\SearchRequestUsers;
use App\Http\Resources\SearchResultResource;
use App\Services\API\SearchService;
use Illuminate\Http\JsonResponse;

class SearchController extends Controller
{
    protected $searchService;

    public function __construct(SearchService $searchService)
    {
        $this->searchService = $searchService;
    }

    /**
     * Unified Search
     *
     * @param SearchRequest $request
     * @return JsonResponse
     */
    public function search(SearchRequestUsers $request): JsonResponse
    {
        $validated = $request->validated();

        $results = $this->searchService->unifiedSearch(
            $validated['keyword'],
            $validated['types'],
            $validated['limit'],
            $validated['page']
        );

        return response()->json(SearchResultResource::collection($results));
    }
}
