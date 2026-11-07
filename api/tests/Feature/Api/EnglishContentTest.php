<?php

namespace Tests\Feature\Api;

use App\Modules\Clients\Models\Client;
use App\Modules\Site\Enums\SettingKey;
use App\Modules\Site\Models\Faq;
use App\Modules\Site\Models\Setting;
use App\Modules\Team\Models\TeamMember;
use App\Modules\Testimonials\Models\Testimonial;
use App\Support\Enums\PublishStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\Concerns\BuildsPortfolio;
use Tests\TestCase;

/** `?lang=en`: English only, never Arabic in its place, and nothing half translated. */
class EnglishContentTest extends TestCase
{
    use BuildsPortfolio, RefreshDatabase;

    private const ENGLISH = [
        'title' => ['ar' => 'نظام المدرسة', 'en' => 'School system'],
        'client_name' => ['ar' => 'مدرسة شعاع', 'en' => 'Shuaa School'],
        'summary' => ['ar' => 'نظام واحد.', 'en' => 'One system.'],
        'tag' => ['ar' => 'نظام ERP', 'en' => 'ERP system'],
    ];

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');
    }

    public function test_projects_without_english_are_hidden_in_english_only(): void
    {
        $this->makeProject(['slug' => 'both', ...self::ENGLISH]);
        $this->makeProject(['slug' => 'arabic-only']);
        $this->makeProject(['slug' => 'half', 'title' => ['ar' => 'نصف', 'en' => 'Half']]);

        $this->getJson('/v1/projects')->assertOk()->assertJsonCount(3, 'data');

        $this->getJson('/v1/projects?lang=en')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', 'both')
            ->assertJsonPath('data.0.title', 'School system')
            ->assertJsonPath('data.0.locales', ['ar', 'en']);
    }

    public function test_an_untranslated_project_page_does_not_exist_in_english(): void
    {
        $this->makeProject(['slug' => 'arabic-only']);

        $this->getJson('/v1/projects/arabic-only')->assertOk()->assertJsonPath('data.locales', ['ar']);
        $this->getJson('/v1/projects/arabic-only?lang=en')->assertNotFound();
    }

    public function test_english_never_falls_back_to_arabic(): void
    {
        $project = $this->makeFullProject(['slug' => 'both', ...self::ENGLISH, 'challenge' => ['ar' => 'التحدي'],
            'featured_facts' => [['value' => '١٤', 'label' => ['ar' => 'حالة']], ['value' => '٥', 'label' => ['ar' => 'لوحات', 'en' => 'dashboards']]],
        ], screens: 1);
        $project->facts()->create(['value' => '٢', 'label' => ['ar' => 'تطبيقان', 'en' => 'apps']]);

        $this->getJson('/v1/projects/both?lang=en')
            ->assertOk()
            ->assertJsonPath('data.challenge', null)
            // The Arabic-only fact and highlight are left out; the translated fact stays.
            ->assertJsonCount(1, 'data.facts')
            ->assertJsonPath('data.facts.0.label', 'apps')
            ->assertJsonCount(0, 'data.highlights')
            ->assertJsonPath('data.featured_facts', [['value' => '٥', 'label' => 'dashboards']])
            // Screens are images: they stay, with no text rather than Arabic text.
            ->assertJsonCount(1, 'data.screens')
            ->assertJsonPath('data.screens.0.alt', null);

        $this->getJson('/v1/projects/both')
            ->assertOk()
            ->assertJsonPath('data.challenge', 'التحدي')
            ->assertJsonCount(2, 'data.facts')
            ->assertJsonCount(2, 'data.featured_facts');
    }

    public function test_the_home_page_shows_only_what_has_english(): void
    {
        $this->makeProject(['slug' => 'both', ...self::ENGLISH, 'is_featured' => true]);
        $this->makeProject(['slug' => 'arabic-only', 'is_featured' => true]);
        Client::create(['name' => ['ar' => 'أثر', 'en' => 'Athar'], 'sector_label' => ['ar' => 'خيري', 'en' => 'Charity'], 'location' => ['ar' => 'غزة', 'en' => 'Gaza'], 'is_visible' => true]);
        Client::create(['name' => ['ar' => 'رشيد'], 'sector_label' => ['ar' => 'خيري'], 'location' => ['ar' => 'غزة'], 'is_visible' => true]);
        TeamMember::create(['name' => ['ar' => 'محمد', 'en' => 'Mohammed'], 'role' => ['ar' => 'تطوير', 'en' => 'Engineering'], 'is_visible' => true]);
        TeamMember::create(['name' => ['ar' => 'سارة'], 'role' => ['ar' => 'تصميم'], 'is_visible' => true]);
        Testimonial::create(['quote' => ['ar' => 'رائع'], 'author_name' => ['ar' => 'أحمد'], 'author_title' => ['ar' => 'مدير'], 'organization' => ['ar' => 'ساعد'], 'status' => PublishStatus::Published]);
        Faq::create(['question' => ['ar' => 'كم؟', 'en' => 'How much?'], 'answer' => ['ar' => 'حسب.', 'en' => 'It depends.'], 'is_visible' => true]);
        Faq::create(['question' => ['ar' => 'متى؟'], 'answer' => ['ar' => 'قريباً.'], 'is_visible' => true]);
        Setting::create(['key' => SettingKey::HeroTagline, 'value' => ['ar' => 'أنظمة']]);

        $this->getJson('/v1/home?lang=en')
            ->assertOk()
            ->assertJsonCount(1, 'data.featured')
            ->assertJsonCount(1, 'data.clients')
            ->assertJsonPath('data.clients.0.name', 'Athar')
            ->assertJsonCount(1, 'data.team')
            ->assertJsonPath('data.team.0.role', 'Engineering')
            ->assertJsonCount(0, 'data.testimonials')
            ->assertJsonCount(1, 'data.faqs')
            ->assertJsonPath('data.faqs.0.question', 'How much?')
            ->assertJsonPath('data.settings.hero_tagline', null);

        $this->getJson('/v1/home')
            ->assertOk()
            ->assertJsonCount(2, 'data.featured')
            ->assertJsonCount(2, 'data.clients')
            ->assertJsonCount(1, 'data.testimonials')
            ->assertJsonPath('data.settings.hero_tagline', 'أنظمة');
    }

    public function test_each_language_is_cached_on_its_own(): void
    {
        $this->makeProject(['slug' => 'both', ...self::ENGLISH]);

        $this->getJson('/v1/projects/both?lang=en')->assertJsonPath('data.title', 'School system');
        $this->getJson('/v1/projects/both')->assertJsonPath('data.title', 'نظام المدرسة');
        $this->getJson('/v1/projects/both?lang=en')->assertJsonPath('data.title', 'School system');
    }

    public function test_an_unknown_language_is_arabic(): void
    {
        $this->makeProject(['slug' => 'both', ...self::ENGLISH]);

        $this->getJson('/v1/projects/both?lang=fr')->assertOk()->assertJsonPath('data.title', 'نظام المدرسة');
    }

    public function test_an_english_testimonial_is_quoted_on_the_english_project_page(): void
    {
        $project = $this->makeProject(['slug' => 'both', ...self::ENGLISH]);
        Testimonial::create([
            'project_id' => $project->id,
            'quote' => ['ar' => 'غيّرت عملنا.', 'en' => 'It changed our work.'],
            'author_name' => ['ar' => 'أحمد', 'en' => 'Ahmad'],
            'author_title' => ['ar' => 'مدير', 'en' => 'Director'],
            'organization' => ['ar' => 'ساعد', 'en' => 'Saiid'],
            'status' => PublishStatus::Published,
        ]);

        $this->getJson('/v1/projects/both?lang=en')
            ->assertOk()
            ->assertJsonPath('data.testimonial.quote', 'It changed our work.');
    }
}
