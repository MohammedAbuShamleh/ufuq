<?php

namespace App\Modules\Portfolio\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Translatable\HasTranslations;

class ProjectFact extends Model
{
    use HasTranslations, SoftDeletes;

    protected $fillable = ['project_id', 'value', 'label', 'sort_order'];

    public array $translatable = ['label'];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
