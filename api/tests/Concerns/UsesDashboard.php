<?php

namespace Tests\Concerns;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Http\UploadedFile;

/**
 * Dashboard test helpers. Uploads avoid UploadedFile::fake()->image(), which
 * needs GD: the PNG is real bytes, and the video only reports its type.
 */
trait UsesDashboard
{
    /** The dashboard's origin, so Sanctum treats the request as stateful (session + CSRF). */
    protected const DASHBOARD_ORIGIN = 'http://localhost:5173';

    /** A 1×1 PNG. */
    private const PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

    protected function signIn(UserRole $role = UserRole::Admin): User
    {
        $user = User::factory()->create(['role' => $role]);

        // The web guard is what Sanctum's SPA mode reads from the session.
        $this->actingAs($user, 'web');

        return $user;
    }

    protected function statefulDashboard(): static
    {
        config(['sanctum.stateful' => ['localhost:5173']]);

        return $this->withHeader('Origin', self::DASHBOARD_ORIGIN);
    }

    protected function png(string $name = 'shot.png'): UploadedFile
    {
        return UploadedFile::fake()->createWithContent($name, base64_decode(self::PNG));
    }

    protected function video(string $name = 'clip.mp4'): UploadedFile
    {
        return UploadedFile::fake()->create($name, 500, 'video/mp4');
    }
}
