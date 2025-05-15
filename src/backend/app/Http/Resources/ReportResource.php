<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ReportResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
{
    return [
        'id' => $this->id,
        'reportable_type' => $this->reportable_type,
        'reportable_id' => $this->reportable_id,
        'reported_by' => $this->user?->name ?? 'Unknown',
        'reason' => $this->reason,
        'status' => $this->status,
        'date' => $this->created_at->toDateString(),
    ];
}

}
