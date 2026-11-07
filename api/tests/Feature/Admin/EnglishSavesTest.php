<?php

namespace Tests\Feature\Admin;

use App\Enums\UserRole;
use App\Modules\Portfolio\Models\Project;
use App\Modules\Site\Enums\SettingKey;
use App\Modules\Site\Models\Faq;
use App\Modules\Site\Models\Setting;
use Database\Seeders\SiteSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\Concerns\BuildsPortfolio;
use Tests\Concerns\UsesDashboard;
use Tests\TestCase;

/** The dashboard's English tab: saved beside the Arabic, and whole or not at all. */
class EnglishSavesTest extends TestCase
{
    use BuildsPortfolio, RefreshDatabase, UsesDashboard;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');
        $this->signIn(UserRole::Editor);
    }

    public function test_a_project_saves_its_english_with_its_rows(): void
    {
        $this->postJson('/admin/v1/projects', $this->project([
            'title' => ['ar' => 'نظام المدرسة', 'en' => 'School system'],
            'client_name' => ['ar' => 'مدرسة شعاع', 'en' => 'Shuaa School'],
            'summary' => ['ar' => 'نظام واحد.', 'en' => 'One system.'],
            'tag' => ['ar' => 'نظام ERP', 'en' => 'ERP system'],
            'challenge' => ['ar' => null, 'en' => 'Paper files.'],
            'facts' => [['value' => '٣', 'label' => ['ar' => 'لوحات', 'en' => 'dashboards']]],
            'highlights' => [['text' => ['ar' => 'مسار كامل', 'en' => '']]],
        ]))
            ->assertCreated()
            ->assertJsonPath('data.locales', ['ar', 'en'])
            ->assertJsonPath('data.title', ['ar' => 'نظام المدرسة', 'en' => 'School system'])
            ->assertJsonPath('data.challenge', ['ar' => null, 'en' => 'Paper files.'])
            ->assertJsonPath('data.facts.0.label', ['ar' => 'لوحات', 'en' => 'dashboards']);

        $project = Project::where('slug', 'school-system')->sole();
        $this->assertSame('Shuaa School', $project->getTranslation('client_name', 'en'));
        $this->assertNull($project->highlights()->sole()->getTranslation('text', 'en', false));
    }

    public function test_half_an_english_project_is_refused_naming_the_missing_fields(): void
    {
        $this->postJson('/admin/v1/projects', $this->project([
            'title' => ['ar' => 'نظام المدرسة', 'en' => 'School system'],
        ]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'client_name.en' => 'اكتب اسم العميل بالإنجليزية: النص الإنجليزي يظهر في الموقع بعد أن تكتمل حقوله المطلوبة كلها.',
                'summary.en',
                'tag.en',
            ])
            ->assertJsonMissingValidationErrors(['title.en', 'challenge.en']);
    }

    public function test_english_text_has_the_arabic_length_limits(): void
    {
        $this->postJson('/admin/v1/faqs', [
            'question' => ['ar' => 'كم؟', 'en' => str_repeat('q', 201)],
            'answer' => ['ar' => 'حسب.', 'en' => 'It depends.'],
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['question.en' => 'يجب ألا يتجاوز طول السؤال بالإنجليزية 200 حرفاً.']);
    }

    public function test_arabic_alone_still_saves(): void
    {
        $this->postJson('/admin/v1/faqs', ['question' => ['ar' => 'كم؟'], 'answer' => ['ar' => 'حسب.']])->assertCreated()->assertJsonPath('data.locales', ['ar']);
        $this->postJson('/admin/v1/faqs', ['question' => ['ar' => 'متى؟', 'en' => ''], 'answer' => ['ar' => 'قريباً.', 'en' => null]])->assertCreated();

        $this->assertSame(2, Faq::count());
    }

    public function test_settings_keep_english_texts_and_policy(): void
    {
        $this->seed(SiteSeeder::class);
        $this->signIn();

        $this->putJson('/admin/v1/settings', [
            'hero_tagline' => ['ar' => 'أنظمة', 'en' => 'Systems'],
            'privacy_policy' => [
                'ar' => [['heading' => 'ما نجمعه', 'paragraphs' => ['الاسم.']]],
                'en' => [['heading' => 'What we collect', 'paragraphs' => ['Your name.']]],
            ],
        ])->assertOk();

        $this->assertSame(['ar' => 'أنظمة', 'en' => 'Systems'], Setting::where('key', SettingKey::HeroTagline)->sole()->value);
        $this->assertSame('What we collect', Setting::where('key', SettingKey::PrivacyPolicy)->sole()->value['en'][0]['heading']);

        $this->getJson('/v1/settings?lang=en')
            ->assertOk()
            ->assertJsonPath('data.hero_tagline', 'Systems')
            ->assertJsonPath('data.privacy_policy.0.paragraphs', ['Your name.']);
    }

    private function project(array $overrides = []): array
    {
        return [
            'slug' => 'school-system',
            'title' => ['ar' => 'نظام المدرسة'],
            'client_name' => ['ar' => 'مدرسة شعاع'],
            'summary' => ['ar' => 'نظام واحد.'],
            'tag' => ['ar' => 'نظام ERP'],
            'challenge' => ['ar' => null],
            'solution' => ['ar' => null],
            'results' => ['ar' => null],
            'type' => 'system',
            'sector' => 'education',
            'country' => 'PS',
            'tech_stack' => ['Laravel'],
            'status' => 'draft',
            'facts' => [],
            'highlights' => [],
            ...$overrides,
        ];
    }
}
