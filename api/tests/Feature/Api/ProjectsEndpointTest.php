<?php

namespace Tests\Feature\Api;

use App\Modules\Portfolio\Enums\ProjectSector;
use App\Modules\Portfolio\Enums\ProjectType;
use App\Modules\Testimonials\Models\Testimonial;
use App\Support\Enums\PublishStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\Concerns\BuildsPortfolio;
use Tests\TestCase;

class ProjectsEndpointTest extends TestCase
{
    use BuildsPortfolio, RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');
    }

    public function test_index_lists_published_projects_featured_first(): void
    {
        $this->makeProject(['slug' => 'other', 'sort_order' => 1]);
        $this->makeProject(['slug' => 'star', 'is_featured' => true, 'featured_order' => 1]);
        $this->makeProject(['slug' => 'draft', 'status' => PublishStatus::Draft]);
        $this->makeProject(['slug' => 'gone'])->delete();

        $this->getJson('/v1/projects')
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.slug', 'star')
            ->assertJsonPath('data.1.slug', 'other');
    }

    public function test_index_filters_by_type_and_sector(): void
    {
        $this->makeProject(['slug' => 'school', 'type' => ProjectType::System, 'sector' => ProjectSector::Education]);
        $this->makeProject(['slug' => 'charity-system', 'type' => ProjectType::System, 'sector' => ProjectSector::Charity]);
        $this->makeProject(['slug' => 'site', 'type' => ProjectType::Website, 'sector' => ProjectSector::Business]);

        $this->getJson('/v1/projects?type=system')
            ->assertOk()
            ->assertJsonCount(2, 'data');

        $this->getJson('/v1/projects?type=system&sector=education')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', 'school');
    }

    public function test_index_rejects_an_unknown_filter(): void
    {
        $this->getJson('/v1/projects?type=spaceship')
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['type' => 'نوع المشروع غير معروف.']);
    }

    public function test_show_returns_the_full_project_with_its_testimonial(): void
    {
        $project = $this->makeFullProject(['slug' => 'saiid'], screens: 2);
        Testimonial::create([
            'project_id' => $project->id,
            'quote' => ['ar' => 'غيّرت المنصة عملنا.'],
            'author_name' => ['ar' => 'أحمد'],
            'author_title' => ['ar' => 'مدير'],
            'organization' => ['ar' => 'ساعد'],
            'status' => PublishStatus::Published,
        ]);

        $this->getJson('/v1/projects/saiid')
            ->assertOk()
            ->assertJsonPath('data.slug', 'saiid')
            ->assertJsonCount(1, 'data.facts')
            ->assertJsonCount(1, 'data.highlights')
            ->assertJsonCount(2, 'data.screens')
            ->assertJsonPath('data.screens.0.label', 'شاشة 1')
            ->assertJsonPath('data.screens.0.file.url', fn (string $url) => str_ends_with($url, '/shot-1.mp4'))
            ->assertJsonPath('data.screens.0.file.sizes', [])
            ->assertJsonPath('data.challenge', null)
            ->assertJsonPath('data.testimonial.quote', 'غيّرت المنصة عملنا.');
    }

    public function test_show_has_null_testimonial_when_none_is_published(): void
    {
        $project = $this->makeProject(['slug' => 'quiet']);
        Testimonial::create([
            'project_id' => $project->id,
            'quote' => ['ar' => 'مسودة'],
            'author_name' => ['ar' => 'س'],
            'author_title' => ['ar' => 'م'],
            'organization' => ['ar' => 'ج'],
            'status' => PublishStatus::Draft,
        ]);

        $this->getJson('/v1/projects/quiet')
            ->assertOk()
            ->assertJsonPath('data.testimonial', null);
    }

    public function test_show_hides_drafts_and_deleted_projects(): void
    {
        $this->makeProject(['slug' => 'draft', 'status' => PublishStatus::Draft]);
        $this->makeProject(['slug' => 'gone'])->delete();

        $this->getJson('/v1/projects/draft')->assertNotFound()->assertExactJson(['message' => 'Not found.']);
        $this->getJson('/v1/projects/gone')->assertNotFound();
        $this->getJson('/v1/projects/missing')->assertNotFound();
    }
}
