<?php

namespace App\Providers;

use App\Support\Content\ContentChanged;
use App\Support\Content\FlushPublicCache;
use App\Support\Media\RecordImageDimensions;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;
use Spatie\MediaLibrary\MediaCollections\Events\MediaHasBeenAddedEvent;
use Spatie\Translatable\Facades\Translatable;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // N+1 is a bug: fail loudly outside production instead of lazy loading.
        Model::preventLazyLoading(! $this->app->isProduction());

        // Text not written yet comes out as null, which the site shows as pending.
        Translatable::allowNullForTranslation();

        Event::listen(MediaHasBeenAddedEvent::class, RecordImageDimensions::class);

        // A dashboard write: the public API must stop serving what was just replaced.
        Event::listen(ContentChanged::class, FlushPublicCache::class);
    }
}
