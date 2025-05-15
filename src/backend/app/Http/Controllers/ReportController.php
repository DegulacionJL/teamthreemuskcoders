<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\Post;
use Illuminate\Http\Request;
use App\Http\Resources\ReportResource;

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
            'reason' => 'required|string|max:255',
        ]);

        $report = Report::create([
            'reportable_id' => $post->id,
            'reportable_type' => Post::class,
            'user_id' => auth()->id(),
            'reason' => $validated['reason'],
            'status' => 'Pending',
        ]);

        Report::logReportCreation($report); // Optional debug log

        return response()->json(['message' => 'Report submitted successfully.'], 201);
    }

    /**
     * Display a listing of the reports.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        return ReportResource::collection(
            Report::with('user') // Updated to match model's `user()` method
                ->orderBy('created_at', 'desc')
                ->get()
        );
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
