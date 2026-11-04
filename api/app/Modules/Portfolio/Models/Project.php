<?php

namespace App\Modules\Portfolio\Models;

use App\Modules\Portfolio\Enums\CardTheme;
use App\Modules\Portfolio\Enums\ProjectSector;
use App\Modules\Portfolio\Enums\ProjectType;
use App\Support\Enums\PublishStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Translatable\HasTranslations;

class Project extends Model
{
    use HasTranslations, SoftDeletes;

    protected $fillable = [
        'slug', 'title', 'client_name', 'summary', 'tag', 'challenge', 'solution', 'results',
        'type', 'sector', 'country', 'tech_stack', 'is_featured', 'featured_order', 'card_theme',
        'has_demo_data', 'status', 'published_at', 'sort_order',
    ];

    public array $translatable = ['title', 'client_name', 'summary', 'tag', 'challenge', 'solution', 'results'];

    protected function casts(): array
    {
        return [
            'type' => ProjectType::class,
            'sector' => ProjectSector::class,
            'card_theme' => CardTheme::class,
            'status' => PublishStatus::class,
            'tech_stack' => 'array',
            'is_featured' => 'boolean',
            'has_demo_data' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    public function facts(): HasMany
    {
        return $this->hasMany(ProjectFact::class)->orderBy('sort_order');
    }

    public function highlights(): HasMany
    {
        return $this->hasMany(ProjectHighlight::class)->orderBy('sort_order');
    }

    public function screens(): HasMany
    {
        return $this->hasMany(ProjectScreen::class)->orderBy('sort_order');
    }

    /** The first screen: the image on cards that show a single shot. */
    public function cover(): HasOne
    {
        return $this->hasOne(ProjectScreen::class)->ofMany('sort_order', 'min');
    }

    public function scopePublished(Builder $query): void
    {
        $query->where('status', PublishStatus::Published);
    }
}
