<?php

namespace App\Modules\Site\Models;

use App\Modules\Site\Enums\SettingKey;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

/** One row per SettingKey; translatable values are stored as {"ar": …}. */
class Setting extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $fillable = ['key', 'value'];

    protected function casts(): array
    {
        return ['key' => SettingKey::class, 'value' => 'json'];
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('file')->singleFile();
    }
}
