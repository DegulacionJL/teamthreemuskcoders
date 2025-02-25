<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class calculateResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     */
    public function toArray($request): array
    {
        return [
            'result' => $this->result,
        ];
    }
}
