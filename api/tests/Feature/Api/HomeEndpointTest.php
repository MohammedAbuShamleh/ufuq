<?php

namespace Tests\Feature\Api;

use App\Modules\Clients\Models\Client;
use App\Modules\Team\Models\TeamMember;
use App\Modules\Testimonials\Models\Testimonial;
use App\Support\Enums\PublishStatus;
use App\Support\PublicCache;
use Closure;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Tests\Concerns\BuildsPortfolio;
use Tests\TestCase;

class HomeEndpointTest extends TestCase
{
    use BuildsPortfolio, RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');
        $this->seed();
    }

    public function test_it_returns_all_home_content_from_the_seed(): void
    {
        $this->getJson('/v1/home')
            ->assertOk()
            ->assertJsonCount(4, 'data.featured')
            ->assertJsonCount(8, 'data.projects')
            ->assertJsonCount(8, 'data.clients')
            ->assertJsonCount(3, 'data.testimonials')
            ->assertJsonCount(5, 'data.team')
            ->assertJsonCount(5, 'data.faqs')
            ->assertJsonPath('data.featured.0.slug', 'saiid')
            ->assertJsonPath('data.featured.0.facts.0.value', '١٤')
            ->assertJsonPath('data.featured.*.slug', ['saiid', 'dar-al-itqan', 'rasras', 'nexabridge'])
            ->assertJsonPath('data.featured.*.featured_layout', ['showcase', 'phones', 'sheet', 'reel'])
            ->assertJsonPath('data.featured.0.featured_facts', [
                ['value' => '١٤', 'label' => 'حالة لكل مشروع'],
                ['value' => '٥', 'label' => 'لوحات تحكم'],
            ])
            ->assertJsonPath('data.featured.1.featured_facts', [])
            ->assertJsonPath('data.projects.0.featured_layout', null)
            ->assertJsonPath('data.projects.0.slug', 'school-management')
            ->assertJsonPath('data.projects.0.cover', null)
            ->assertJsonPath('data.team.0.name', 'م. محمد أبو شمله')
            ->assertJsonPath('data.settings.contact_email', 'hello@ufuq.ps')
            ->assertJsonPath('data.settings.hero_tagline', 'أنظمة وبرمجيات للجمعيات والمدارس والشركات')
            ->assertJsonPath('data.settings.why_we_started', null)
            ->assertJsonStructure(['data' => [
                'featured' => [['slug', 'title', 'tag', 'summary', 'featured_layout', 'featured_facts', 'facts', 'highlights', 'screens']],
                'projects' => [['slug', 'title', 'tag', 'summary', 'cover']],
                'clients' => [['name', 'sector_label', 'location', 'logo']],
                'testimonials' => [['quote', 'author_name', 'author_title', 'organization']],
                'team' => [['name', 'role', 'tech', 'is_founder', 'photo']],
                'faqs' => [['question', 'answer']],
                'settings' => ['whatsapp_number', 'booking_url', 'social_links', 'privacy_policy', 'privacy_is_draft'],
            ]]);
    }

    public function test_query_count_stays_flat_as_content_grows(): void
    {
        // Baseline already holds screens with files, so every eager load is exercised once.
        $this->makeFullProject(['is_featured' => true, 'featured_order' => 9]);
        $this->makeFullProject();

        $baseline = $this->countQueries(fn () => $this->getJson('/v1/home')->assertOk());

        foreach (range(1, 3) as $i) {
            $this->makeFullProject(['is_featured' => true, 'featured_order' => 10 + $i], screens: 3);
            $this->makeFullProject(screens: 2);
            $this->makeTeamMemberWithPhoto();
            $this->makeClientWithLogo();
        }
        app(PublicCache::class)->flush();

        $grown = $this->countQueries(fn () => $this->getJson('/v1/home')->assertOk()->assertJsonCount(8, 'data.featured'));

        $this->assertSame($baseline, $grown, 'GET /v1/home must not run more queries as content grows (N+1).');
    }

    public function test_a_cached_response_runs_no_queries(): void
    {
        $this->getJson('/v1/home')->assertOk();

        $this->assertSame(0, $this->countQueries(fn () => $this->getJson('/v1/home')->assertOk()));
    }

    public function test_hidden_and_draft_content_stays_off_the_page(): void
    {
        $this->makeProject(['slug' => 'secret', 'status' => PublishStatus::Draft]);
        TeamMember::create(['name' => ['ar' => 'مخفي'], 'role' => ['ar' => 'دور'], 'is_visible' => false]);
        Client::create(['name' => ['ar' => 'مخفي'], 'sector_label' => ['ar' => 'قطاع'], 'location' => ['ar' => 'غزة'], 'is_visible' => false]);
        Testimonial::create(['quote' => ['ar' => 'مسودة'], 'author_name' => ['ar' => 'س'], 'author_title' => ['ar' => 'م'], 'organization' => ['ar' => 'ج']]);
        app(PublicCache::class)->flush();

        $response = $this->getJson('/v1/home')
            ->assertOk()
            ->assertJsonCount(8, 'data.projects')
            ->assertJsonCount(5, 'data.team')
            ->assertJsonCount(8, 'data.clients')
            ->assertJsonCount(3, 'data.testimonials');

        $this->assertStringNotContainsString('secret', $response->getContent());
    }

    private function makeTeamMemberWithPhoto(): void
    {
        TeamMember::create(['name' => ['ar' => 'عضو'], 'role' => ['ar' => 'دور'], 'is_visible' => true])
            ->addMedia(UploadedFile::fake()->create('photo.mp4', 4, 'video/mp4'))
            ->toMediaCollection('photo');
    }

    private function makeClientWithLogo(): void
    {
        Client::create(['name' => ['ar' => 'عميل'], 'sector_label' => ['ar' => 'قطاع'], 'location' => ['ar' => 'غزة'], 'is_visible' => true])
            ->addMedia(UploadedFile::fake()->create('logo.mp4', 4, 'video/mp4'))
            ->toMediaCollection('logo');
    }

    private function countQueries(Closure $callback): int
    {
        DB::flushQueryLog();
        DB::enableQueryLog();
        $callback();
        $count = count(DB::getQueryLog());
        DB::disableQueryLog();

        return $count;
    }
}
