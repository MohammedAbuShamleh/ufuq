<?php

namespace App\Modules\Leads\Models;

use App\Modules\Leads\Enums\LeadStatus;
use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    // status is deliberately not fillable: it changes only through LeadStatusService.
    protected $fillable = ['name', 'contact', 'project_type', 'message', 'source_page', 'locale', 'ip_hash'];

    protected $attributes = ['status' => 'new', 'locale' => 'ar'];

    protected function casts(): array
    {
        return ['status' => LeadStatus::class];
    }
}
