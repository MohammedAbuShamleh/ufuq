<?php

namespace Tests\Feature\Admin;

use App\Modules\Site\Enums\SettingKey;
use App\Modules\Site\Models\Setting;
use Database\Seeders\SiteSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\Concerns\UsesDashboard;
use Tests\TestCase;

class SettingsTest extends TestCase
{
    use RefreshDatabase, UsesDashboard;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');
        $this->seed(SiteSeeder::class);
        $this->signIn();
    }

    public function test_the_form_has_every_field_with_all_locales(): void
    {
        $this->getJson('/admin/v1/settings')
            ->assertOk()
            ->assertJsonPath('data.whatsapp_number', null)
            ->assertJsonPath('data.contact_email', 'hello@ufuq.ps')
            ->assertJsonPath('data.social_links', ['linkedin' => null, 'x' => null, 'instagram' => null])
            ->assertJsonPath('data.profile_pdf', null)
            ->assertJsonPath('data.hero_tagline', ['ar' => 'أنظمة وبرمجيات للجمعيات والمدارس والشركات'])
            ->assertJsonPath('data.why_we_started', ['ar' => null])
            ->assertJsonPath('data.privacy_policy.ar.0.heading', 'ما نجمعه عبر هذا الموقع')
            ->assertJsonPath('data.privacy_is_draft', true);
    }

    public function test_a_save_changes_only_the_keys_sent(): void
    {
        $this->putJson('/admin/v1/settings', [
            'whatsapp_number' => '+970 599-123-456',
            'social_links' => ['linkedin' => 'https://linkedin.com/company/ufuq'],
            'why_we_started' => ['ar' => 'بدأنا لأن الجمعيات تستحق أنظمة تليق بعملها.'],
            'privacy_policy' => ['ar' => [
                ['heading' => 'ما نجمعه', 'paragraphs' => ['الاسم ووسيلة التواصل.', 'لا شيء غير ذلك.']],
            ]],
            'privacy_is_draft' => false,
        ])
            ->assertOk()
            ->assertJsonPath('data.whatsapp_number', '+970599123456')
            ->assertJsonPath('data.social_links', ['linkedin' => 'https://linkedin.com/company/ufuq', 'x' => null, 'instagram' => null])
            ->assertJsonPath('data.why_we_started', ['ar' => 'بدأنا لأن الجمعيات تستحق أنظمة تليق بعملها.'])
            ->assertJsonPath('data.privacy_policy.ar', [
                ['heading' => 'ما نجمعه', 'paragraphs' => ['الاسم ووسيلة التواصل.', 'لا شيء غير ذلك.']],
            ])
            ->assertJsonPath('data.privacy_is_draft', false)
            // Not sent, so untouched.
            ->assertJsonPath('data.contact_email', 'hello@ufuq.ps')
            ->assertJsonPath('data.hero_tagline.ar', 'أنظمة وبرمجيات للجمعيات والمدارس والشركات');

        // Stored the way SiteSeeder stores translatable values.
        $this->assertSame(
            ['ar' => 'بدأنا لأن الجمعيات تستحق أنظمة تليق بعملها.'],
            Setting::where('key', SettingKey::WhyWeStarted->value)->sole()->value,
        );

        // The public endpoint reads the new text in the request locale.
        $this->getJson('/v1/settings')->assertOk()->assertJsonPath('data.why_we_started', 'بدأنا لأن الجمعيات تستحق أنظمة تليق بعملها.');
    }

    public function test_invalid_settings_are_explained_in_arabic(): void
    {
        $this->putJson('/admin/v1/settings', [
            'whatsapp_number' => '12',
            'booking_url' => 'not a url',
            'privacy_policy' => ['ar' => [['heading' => '', 'paragraphs' => []]]],
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'whatsapp_number' => 'اكتب رقم واتساب بالصيغة الدولية: رمز الدولة ثم الرقم دون الصفر الأول، مثل 970599123456.',
                'booking_url' => 'يجب أن يكون حقل رابط حجز الجلسة رابطاً كاملاً يبدأ بـ https://.',
                'privacy_policy.ar.0.heading' => 'حقل عنوان القسم مطلوب.',
                'privacy_policy.ar.0.paragraphs',
            ]);
    }

    public function test_the_whatsapp_number_needs_its_country_code(): void
    {
        // A local number would make wa.me open the wrong chat.
        $this->putJson('/admin/v1/settings', ['whatsapp_number' => '0599 123 456'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['whatsapp_number' => 'اكتب رقم واتساب بالصيغة الدولية: رمز الدولة ثم الرقم دون الصفر الأول، مثل 970599123456.']);

        // The international "00" prefix is the same number as "+".
        $this->putJson('/admin/v1/settings', ['whatsapp_number' => '00970 599 123 456'])
            ->assertOk()
            ->assertJsonPath('data.whatsapp_number', '+970599123456');
    }

    public function test_the_profile_pdf_is_uploaded_and_removed(): void
    {
        $this->post('/admin/v1/settings/profile-pdf', ['file' => UploadedFile::fake()->create('ufuq-profile.pdf', 300, 'application/pdf')])
            ->assertOk()
            ->assertJsonPath('data.profile_pdf.url', fn (string $url) => str_ends_with($url, '/ufuq-profile.pdf'))
            ->assertJsonPath('data.profile_pdf.sizes', [])
            ->assertJsonPath('data.contact_email', 'hello@ufuq.ps');

        $this->deleteJson('/admin/v1/settings/profile-pdf')->assertOk()->assertJsonPath('data.profile_pdf', null);

        $this->postJson('/admin/v1/settings/profile-pdf', ['file' => $this->png()])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['file' => 'ملف البروفايل يجب أن يكون PDF.']);
    }
}
