<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateReportRequest;
use App\Http\Resources\ReportResource;
use App\Models\Report;
use Illuminate\Support\Facades\Log;

class ReportController extends Controller
{
    /**
     * Display a listing of the reports.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $reports = Report::with('user')->get();
            return ReportResource::collection($reports);
        } catch (\Exception $e) {
            Log::error('Error fetching reports: ' . $e->getMessage());
            return response()->json(['error' => 'Unable to fetch reports'], 500);
        }
    }

    /**
     * Store a newly created report in storage.
     *
     * @param  \App\Http\Requests\CreateReportRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function create(CreateReportRequest $request)
    {
        try {
            $data = $request->validated();
            $report = Report::create($data); // Directly create report
            Report::logReportCreation($report); // Optional logging
            return new ReportResource($report);
        } catch (\Exception $e) {
            Log::error('Error creating report: ' . $e->getMessage());
            return response()->json(['error' => 'Something went wrong'], 500);
        }
    }
}
