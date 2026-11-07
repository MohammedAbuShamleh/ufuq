<?php

namespace App\Modules\Team\Models;

use App\Support\Media\HasWebpSizes;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Translatable\HasTranslations;

class TeamMember extends Model implements HasMedia
{
    use HasTranslations, HasWebpSizes, InteractsWithMedia, SoftDeletes;

    protected $fillable = ['name', 'role', 'bio', 'tech', 'is_founder', 'is_visible', 'sort_order'];

    public array $translatable = ['name', 'role', 'bio'];

    /** What must have text in a language before the site shows this member in it. */
    public const REQUIRED_TEXT = ['name', 'role'];

    protected function casts(): array
    {
        return ['is_founder' => 'boolean', 'is_visible' => 'boolean'];
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('photo')->singleFile();
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addWebpSizes($media, 'photo');
    }

    public function scopeVisible(Builder $query): void
    {
        $query->where('is_visible', true);
    }
}
