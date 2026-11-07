<?php

namespace App\Modules\Site\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Translatable\HasTranslations;

class Faq extends Model
{
    use HasTranslations, SoftDeletes;

    protected $fillable = ['question', 'answer', 'is_visible', 'sort_order'];

    public array $translatable = ['question', 'answer'];

    /** What must have text in a language before the site shows this question in it. */
    public const REQUIRED_TEXT = ['question', 'answer'];

    protected function casts(): array
    {
        return ['is_visible' => 'boolean'];
    }

    public function scopeVisible(Builder $query): void
    {
        $query->where('is_visible', true);
    }
}
