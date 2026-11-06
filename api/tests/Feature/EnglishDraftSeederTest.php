<?php

namespace Tests\Feature;

use App\Modules\Clients\Models\Client;
use App\Modules\Portfolio\Models\Project;
use App\Modules\Site\Enums\SettingKey;
use App\Modules\Site\Models\Setting;
use Database\Seeders\ClientSeeder;
use Database\Seeders\EnglishDraftSeeder;
use Database\Seeders\ProjectSeeder;
use Database\Seeders\SiteSeeder;
use Database\Seeders\TeamSeeder;
use Database\Seeders\TestimonialSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\PendingCommand;
use Tests\TestCase;

/** The English drafts cover everything the seeders write, and never replace English someone wrote. */
class EnglishDraftSeederTest extends TestCase
{
    use RefreshDatabase;

    /** Arabic letters; Arabic-Indic digits in fact values are the site's to convert. */
    private const ARABIC = '/[\x{0621}-\x{064A}]/u';

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed([ProjectSeeder::class, ClientSeeder::class, TeamSeeder::class, TestimonialSeeder::class, SiteSeeder::class]);
    }

    public function test_every_seeded_item_gets_english(): void
    {
        $this->drafts()->doesntExpectOutputToContain('No draft')->assertSuccessful()->run();

        $arabic = $this->getJson('/v1/home')->assertOk()->json('data');
        $english = $this->getJson('/v1/home?lang=en')->assertOk()->json('data');

        foreach (['featured', 'projects', 'clients', 'team', 'testimonials', 'faqs'] as $list) {
            $this->assertCount(count($arabic[$list]), $english[$list], $list);
        }

        $this->assertSame('Systems and software for charities, schools and companies', $english['settings']['hero_tagline']);

        // A member's tech line is not translated text: the pending «[التقنيات]» is the site's to label.
        foreach ($english['team'] as $i => $member) {
            unset($english['team'][$i]['tech']);
        }

        $this->assertDoesNotMatchRegularExpression(self::ARABIC, json_encode($english, JSON_UNESCAPED_UNICODE));

        $policy = $this->getJson('/v1/settings?lang=en')->assertOk()->json('data.privacy_policy');
        $this->assertCount(4, $policy);
        $this->assertSame('What we collect through this site', $policy[0]['heading']);

        $this->getJson('/v1/projects/saiid?lang=en')
            ->assertOk()
            ->assertJsonPath('data.title', 'Saaed')
            ->assertJsonPath('data.featured_facts.0.label', 'statuses per project')
            ->assertJsonCount(3, 'data.facts')
            ->assertJsonCount(3, 'data.highlights');
    }

    public function test_running_again_changes_nothing_and_keeps_written_english(): void
    {
        $client = Client::firstWhere('name->ar', 'ساعد');
        $client->setTranslation('name', 'en', 'Saaed Society')->save();

        $this->drafts()->assertSuccessful()->run();
        $this->drafts()->expectsOutputToContain('English drafts written to 0 items.')->assertSuccessful()->run();

        $client->refresh();
        $this->assertSame('Saaed Society', $client->getTranslation('name', 'en'));
        $this->assertSame('Charity', $client->getTranslation('sector_label', 'en'));
    }

    public function test_arabic_edited_since_gets_no_half_translation(): void
    {
        $project = Project::firstWhere('slug', 'rashid');
        $project->setTranslation('summary', 'ar', 'نص كتبه الفريق بعد البذر.')->save();

        $this->drafts()->expectsOutputToContain('نص كتبه الفريق بعد البذر.')->assertSuccessful()->run();

        $project->refresh();
        $this->assertFalse(filled($project->getTranslation('title', 'en', false)));
        $this->getJson('/v1/projects/rashid?lang=en')->assertNotFound();

        $this->assertNotNull(Setting::firstWhere('key', SettingKey::PrivacyPolicy)->value['en'] ?? null);
    }

    private function drafts(): PendingCommand
    {
        return $this->artisan('db:seed', ['--class' => EnglishDraftSeeder::class]);
    }
}
