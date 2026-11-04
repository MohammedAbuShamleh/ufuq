<?php

namespace Tests\Feature\Media;

use App\Modules\Portfolio\Enums\ScreenKind;
use App\Modules\Portfolio\Http\Resources\ProjectScreenResource;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\Concerns\BuildsPortfolio;
use Tests\TestCase;

/** Needs GD or Imagick, as production has; skipped on machines without either. */
class WebpSizesTest extends TestCase
{
    use BuildsPortfolio, RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        if (! extension_loaded('gd') && ! extension_loaded('imagick')) {
            $this->markTestSkipped('Image conversions need the GD or Imagick extension.');
        }

        Storage::fake('public');
    }

    public function test_an_uploaded_shot_gets_three_webp_widths_and_its_size(): void
    {
        $screen = $this->makeProject()->screens()->create(['kind' => ScreenKind::Desktop, 'alt' => ['ar' => 'لقطة']]);

        $screen->addMedia(UploadedFile::fake()->image('shot.png', 2000, 1250))->toMediaCollection('file');

        $file = ProjectScreenResource::make($screen->load('media'))->resolve()['file']->resolve();

        $this->assertSame(2000, $file['width']);
        $this->assertSame(1250, $file['height']);
        $this->assertSame([480, 960, 1600], array_column($file['sizes'], 'width'));
        $this->assertStringEndsWith('.webp', $file['sizes'][0]['url']);
    }
}
