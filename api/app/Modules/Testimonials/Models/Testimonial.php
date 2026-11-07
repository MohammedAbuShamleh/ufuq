<?php

namespace App\Modules\Testimonials\Models;

use App\Support\Enums\PublishStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Translatable\HasTranslations;

class Testimonial extends Model
{
    use HasTranslations, SoftDeletes;

    // project_id points at Portfolio's projects; this module never queries that table.
    protected $fillable = ['project_id', 'quote', 'author_name', 'author_title', 'organization', 'status', 'sort_order'];

    public array $translatable = ['quote', 'author_name', 'author_title', 'organization'];

    /** What must have text in a language before the site shows this testimonial in it. */
    public const REQUIRED_TEXT = ['quote', 'author_name', 'author_title', 'organization'];

    protected function casts(): array
    {
        return ['status' => PublishStatus::class];
    }

    public function scopePublished(Builder $query): void
    {
        $query->where('status', PublishStatus::Published);
    }
}
