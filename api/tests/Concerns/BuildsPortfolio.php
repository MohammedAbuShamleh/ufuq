<?php

namespace Tests\Concerns;

use App\Modules\Portfolio\Enums\ProjectSector;
use App\Modules\Portfolio\Enums\ProjectType;
use App\Modules\Portfolio\Enums\ScreenKind;
use App\Modules\Portfolio\Models\Project;
use App\Support\Enums\PublishStatus;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

/** Minimal published projects for endpoint tests; call Storage::fake('public') before adding screens. */
trait BuildsPortfolio
{
    protected function makeProject(array $attributes = []): Project
    {
        $slug = $attributes['slug'] ?? 'project-'.Str::lower(Str::random(8));

        return Project::create([
            'slug' => $slug,
            'title' => ['ar' => "مشروع {$slug}"],
            'client_name' => ['ar' => 'عميل'],
            'tag' => ['ar' => 'منصة'],
            'summary' => ['ar' => 'وصف قصير.'],
            'type' => ProjectType::Platform,
            'sector' => ProjectSector::Charity,
            'country' => 'PS',
            'tech_stack' => ['Laravel'],
            'status' => PublishStatus::Published,
            'published_at' => now(),
            ...$attributes,
        ]);
    }

    /** A project with facts, highlights and screens, each screen carrying a file. */
    protected function makeFullProject(array $attributes = [], int $screens = 2): Project
    {
        $project = $this->makeProject($attributes);

        $project->facts()->create(['value' => '٣', 'label' => ['ar' => 'لوحات']]);
        $project->highlights()->create(['text' => ['ar' => 'ميزة']]);

        for ($i = 1; $i <= $screens; $i++) {
            $screen = $project->screens()->create([
                'kind' => ScreenKind::Video,
                'label' => ['ar' => "شاشة {$i}"],
                'alt' => ['ar' => "لقطة {$i}"],
                'sort_order' => $i,
            ]);

            // A video, not an image: no webp conversions, so no GD needed to run tests.
            $screen->addMedia(UploadedFile::fake()->create("shot-{$i}.mp4", 4, 'video/mp4'))
                ->toMediaCollection('file');
        }

        return $project;
    }
}
