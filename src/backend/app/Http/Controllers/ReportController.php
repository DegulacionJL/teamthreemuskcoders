<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ReportController extends Controller
{
    /**
     * Handle a POST request to report a post.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Post  $post
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(Request $request, Post $post)
    {
        $validated = $request->validate([
            'reason' => 'nullable|string|max:255',
        ]);

        Report::create([
            'reportable_id' => $post->id,
            'reportable_type' => Post::class,
            'user_id' => auth()->id(),
            'reason' => $validated['reason'] ?? 'No reason provided',
            'status' => 'Pending',
        ]);

        return response()->json([
            'message' => 'Report submitted successfully.'
        ], 201);
    }

    /**
     * Display a listing of the reports.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $reports = Report::with('user', 'reportable')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($report) {
                $type = class_basename($report->reportable_type);
                if ($type === 'Post') {
                    $type = 'Meme'; // Map Post model to Meme for frontend
                }

                return [
                    'id' => $report->id,
                    'reported_by' => $report->user->first_name ?? 'Unknown',
                    'reason' => $report->reason,
                    'date' => $report->created_at->format('Y-m-d'),
                    'status' => $report->status,
                    'type' => $type,
                ];
            });

        Log::info($reports);
        return response()->json($reports);
    }

    /**
     * Mark a report as resolved.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function resolve($id)
    {
        $report = Report::findOrFail($id);
        $report->status = 'Resolved';
        $report->save();

        return response()->json(['message' => 'Report marked as resolved.'], 200);
    }
}
