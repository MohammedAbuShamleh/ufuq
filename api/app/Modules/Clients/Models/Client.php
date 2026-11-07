<?php

namespace App\Modules\Clients\Models;

use App\Support\Media\HasWebpSizes;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Translatable\HasTranslations;

class Client extends Model implements HasMedia
{
    use HasTranslations, HasWebpSizes, InteractsWithMedia, SoftDeletes;

    protected $fillable = ['name', 'sector_label', 'location', 'is_visible', 'sort_order'];

    public array $translatable = ['name', 'sector_label', 'location'];

    /** What must have text in a language before the site shows this client in it. */
    public const REQUIRED_TEXT = ['name', 'sector_label', 'location'];

    protected function casts(): array
    {
        return ['is_visible' => 'boolean'];
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('logo')->singleFile();
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addWebpSizes($media, 'logo');
    }

    public function scopeVisible(Builder $query): void
    {
        $query->where('is_visible', true);
    }
}
