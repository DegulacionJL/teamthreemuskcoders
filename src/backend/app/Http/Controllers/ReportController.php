<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateReportRequest;
use App\Http\Resources\ReportResource;
use App\Services\ReportService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ReportController extends Controller
{
    protected $reportService;

    /**
     * ReportController constructor.
     *
     * @param ReportService $reportService
     */
    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
    }

    /**
     * Handle the report creation.
     *
     * @param CreateReportRequest $request
     * @return \Illuminate\Http\Response
     */
    public function create(CreateReportRequest $request)
    {
        try {
            // Extract validated data from the request
            $data = $request->validated();

            // Call the service to create the report
            $report = $this->reportService->createReport($data);

            // Return the response with the created report
            return new ReportResource($report);

        } catch (\Exception $e) {
            Log::error('Error creating report: ' . $e->getMessage());
            return response()->json(['error' => 'Something went wrong'], 500);
        }
    }
}
