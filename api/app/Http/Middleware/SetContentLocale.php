<?php

namespace App\Http\Middleware;

use App\Support\Translations;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Spatie\Translatable\Translatable;
use Symfony\Component\HttpFoundation\Response;

/**
 * The public API answers in the language the site asks for: `?lang=en`, Arabic
 * otherwise. In a second language a missing text reads as null, never as the
 * Arabic one: the site hides what is not translated instead of mixing languages.
 *
 * Both settings are made on every request, so one in English cannot leak into
 * the next (the app instance lives on between requests in tests).
 */
class SetContentLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        $asked = $request->query('lang');
        $locale = is_string($asked) && in_array($asked, Translations::LOCALES, true) ? $asked : Translations::PRIMARY;

        App::setLocale($locale);
        app(Translatable::class)->fallback(fallbackLocale: $locale === Translations::PRIMARY ? null : $locale);

        return $next($request);
    }
}
