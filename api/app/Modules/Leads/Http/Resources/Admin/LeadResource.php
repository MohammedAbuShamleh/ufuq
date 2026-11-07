<?php

namespace App\Modules\Leads\Http\Resources\Admin;

use App\Modules\Leads\Models\Lead;
use App\Modules\Leads\Services\WhatsappLink;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * ip_hash stays private: it exists to spot abuse, not to show.
 *
 * @mixin Lead
 */
class LeadResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'contact' => $this->contact,
            'project_type' => $this->project_type,
            'message' => $this->message,
            'source_page' => $this->source_page,
            'locale' => $this->locale,
            'status' => $this->status->value,
            'next_status' => $this->status->next()?->value,
            'created_at' => $this->created_at?->toIso8601String(),
            'whatsapp_url' => WhatsappLink::forContact($this->contact),
        ];
    }
}
