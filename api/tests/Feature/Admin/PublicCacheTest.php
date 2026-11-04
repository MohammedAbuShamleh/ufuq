<?php

namespace Tests\Feature\Admin;

use App\Enums\UserRole;
use App\Modules\Site\Models\Faq;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\Concerns\BuildsPortfolio;
use Tests\Concerns\UsesDashboard;
use Tests\TestCase;

/** The public API caches for five minutes; a dashboard write must show up at once. */
class PublicCacheTest extends TestCase
{
    use BuildsPortfolio, RefreshDatabase, UsesDashboard;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');
        $this->seed();
        $this->signIn(UserRole::Editor);
    }

    public function test_a_content_write_replaces_the_cached_page(): void
    {
        $faq = Faq::orderBy('sort_order')->first();
        $this->getJson('/v1/home')->assertOk()->assertJsonPath('data.faqs.0.question', 'كم يكلف النظام؟');

        // Written behind the API's back: the cached page must not notice.
        $faq->update(['question' => ['ar' => 'تعديل مباشر']]);
        $this->getJson('/v1/home')->assertJsonPath('data.faqs.0.question', 'كم يكلف النظام؟');

        $this->putJson("/admin/v1/faqs/{$faq->id}", ['question' => ['ar' => 'ما تكلفة النظام؟'], 'answer' => ['ar' => 'حسب ما يُبنى.']])
            ->assertOk();

        $this->getJson('/v1/home')->assertOk()->assertJsonPath('data.faqs.0.question', 'ما تكلفة النظام؟');
    }

    public function test_a_project_edit_reaches_its_public_page(): void
    {
        $project = $this->makeProject(['slug' => 'quiet', 'summary' => ['ar' => 'قديم']]);
        $this->getJson('/v1/projects/quiet')->assertOk()->assertJsonPath('data.summary', 'قديم');

        $this->post("/admin/v1/projects/{$project->id}/screens", [
            'file' => $this->video(),
            'kind' => 'video',
            'alt' => ['ar' => 'جولة'],
        ])->assertCreated();

        $this->getJson('/v1/projects/quiet')->assertOk()->assertJsonCount(1, 'data.screens');
    }
}
