<?php

namespace App\Modules\Portfolio\Models;

use App\Modules\Portfolio\Enums\ScreenKind;
use App\Support\Media\HasWebpSizes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Translatable\HasTranslations;

class ProjectScreen extends Model implements HasMedia
{
    use HasTranslations, HasWebpSizes, InteractsWithMedia, SoftDeletes;

    protected $fillable = ['project_id', 'kind', 'label', 'alt', 'sort_order'];

    /** label: the text under a thumbnail, a phone's caption, a reel chip. */
    public array $translatable = ['label', 'alt'];

    protected function casts(): array
    {
        return ['kind' => ScreenKind::class];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('file')->singleFile();
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addWebpSizes($media, 'file');
    }
}
