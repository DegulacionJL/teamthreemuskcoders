<?php

namespace App\Services;

use App\Models\Report;
use Illuminate\Support\Facades\Log;

class ReportService
{
    /**
     * Create a new report.
     *
     * @param array $data
     * @return \App\Models\Report
     */
    public function createReport(array $data)
    {
        try {
            // Create a report
            $report = Report::create($data);

            // Log report creation details
            Log::info('Report successfully created for post.', ['report_id' => $report->id]);

            return $report;

        } catch (\Exception $e) {
            Log::error('Error creating report: ' . $e->getMessage());
            throw new \Exception('Error creating report.');
        }
    }
}
