<?php

namespace App\Modules\Portfolio\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Translatable\HasTranslations;

class ProjectHighlight extends Model
{
    use HasTranslations, SoftDeletes;

    protected $fillable = ['project_id', 'text', 'sort_order'];

    public array $translatable = ['text'];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
