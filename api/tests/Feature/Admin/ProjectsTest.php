<?php

namespace Tests\Feature\Admin;

use App\Enums\UserRole;
use App\Modules\Portfolio\Models\Project;
use App\Modules\Portfolio\Models\ProjectFact;
use App\Support\Content\ContentChanged;
use App\Support\Enums\PublishStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Storage;
use Tests\Concerns\BuildsPortfolio;
use Tests\Concerns\UsesDashboard;
use Tests\TestCase;

class ProjectsTest extends TestCase
{
    use BuildsPortfolio, RefreshDatabase, UsesDashboard;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');
        $this->signIn(UserRole::Editor);
    }

    public function test_a_project_is_created_with_its_facts_and_highlights(): void
    {
        $this->makeProject(['slug' => 'existing', 'sort_order' => 4]);

        $this->postJson('/admin/v1/projects', $this->payload([
            'facts' => [
                ['value' => '١٤', 'label' => ['ar' => 'حالة لكل مشروع']],
                ['value' => '٥', 'label' => ['ar' => 'لوحات تحكم']],
            ],
            'highlights' => [['text' => ['ar' => 'مسار كامل للمشروع']]],
        ]))
            ->assertCreated()
            ->assertJsonPath('data.slug', 'school-system')
            ->assertJsonPath('data.title', ['ar' => 'نظام المدرسة'])
            ->assertJsonPath('data.frame_label', ['ar' => null])
            ->assertJsonPath('data.challenge', ['ar' => null])
            ->assertJsonPath('data.status', 'draft')
            ->assertJsonPath('data.published_at', null)
            ->assertJsonPath('data.is_featured', false)
            ->assertJsonPath('data.sort_order', 5)
            ->assertJsonPath('data.facts.1.value', '٥')
            ->assertJsonPath('data.facts.1.label', ['ar' => 'لوحات تحكم'])
            ->assertJsonPath('data.highlights.0.text', ['ar' => 'مسار كامل للمشروع'])
            ->assertJsonPath('data.screens', [])
            ->assertJsonStructure(['data' => ['id', 'facts' => [['id', 'value', 'label']], 'highlights' => [['id', 'text']]]]);

        $project = Project::where('slug', 'school-system')->sole();
        $this->assertSame(['ar' => 'نظام المدرسة'], $project->getTranslations('title'));
        $this->assertSame(2, $project->facts()->count());
    }

    public function test_an_update_replaces_the_lists_and_publishes_once(): void
    {
        $project = $this->makeProject(['slug' => 'school-system', 'status' => PublishStatus::Draft, 'published_at' => null]);
        $kept = $project->facts()->create(['value' => '١', 'label' => ['ar' => 'قديم'], 'sort_order' => 0]);
        $dropped = $project->facts()->create(['value' => '٢', 'label' => ['ar' => 'سيحذف'], 'sort_order' => 1]);

        Carbon::setTestNow('2026-11-04 10:00:00');

        $this->putJson("/admin/v1/projects/{$project->id}", $this->payload([
            'status' => 'published',
            'facts' => [
                ['value' => '٣', 'label' => ['ar' => 'جديد']],
                ['id' => $kept->id, 'value' => '١٠', 'label' => ['ar' => 'معدّل']],
            ],
            'highlights' => [],
        ]))
            ->assertOk()
            ->assertJsonCount(2, 'data.facts')
            ->assertJsonPath('data.facts.0.value', '٣')
            ->assertJsonPath('data.facts.1.id', $kept->id)
            ->assertJsonPath('data.facts.1.label.ar', 'معدّل')
            ->assertJsonPath('data.highlights', [])
            ->assertJsonPath('data.published_at', '2026-11-04T10:00:00+00:00');

        $this->assertSoftDeleted($dropped);
        $this->assertSame(1, ProjectFact::find($kept->id)->sort_order);

        // Back to draft and published again: the first publication date stays.
        Carbon::setTestNow('2026-12-01 10:00:00');
        $this->putJson("/admin/v1/projects/{$project->id}", $this->payload(['status' => 'draft']))->assertOk();
        $this->putJson("/admin/v1/projects/{$project->id}", $this->payload(['status' => 'published']))
            ->assertOk()
            ->assertJsonPath('data.published_at', '2026-11-04T10:00:00+00:00');
    }

    public function test_an_update_keeps_other_locales(): void
    {
        $project = $this->makeProject(['slug' => 'school-system', 'title' => ['ar' => 'قديم', 'en' => 'Old']]);

        $this->putJson("/admin/v1/projects/{$project->id}", $this->payload())
            ->assertOk()
            ->assertJsonPath('data.title', ['ar' => 'نظام المدرسة', 'en' => 'Old']);
    }

    public function test_a_slug_stays_taken_by_a_deleted_project(): void
    {
        $this->makeProject(['slug' => 'school-system'])->delete();

        $this->postJson('/admin/v1/projects', $this->payload())
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['slug' => 'هذا الرابط مستخدم لمشروع آخر، وقد يكون مشروعاً محذوفاً. اختر رابطاً غيره.']);
    }

    public function test_invalid_input_names_the_fields_in_arabic(): void
    {
        $this->postJson('/admin/v1/projects', $this->payload([
            'slug' => 'Not A Slug',
            'title' => ['ar' => ''],
            'type' => 'spaceship',
            'facts' => array_fill(0, 4, ['value' => '1', 'label' => ['ar' => 'x']]),
        ]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'title.ar' => 'حقل اسم المشروع مطلوب.',
                'type' => 'قيمة نوع المشروع غير معروفة.',
                'facts' => 'يجب ألا يحتوي حقل الأرقام على أكثر من 3 عناصر.',
                'slug',
            ]);
    }

    public function test_the_list_has_drafts_but_not_deleted_projects(): void
    {
        $this->makeFullProject(['slug' => 'with-screens', 'sort_order' => 2], screens: 2);
        $this->makeProject(['slug' => 'draft', 'status' => PublishStatus::Draft, 'sort_order' => 1]);
        $this->makeProject(['slug' => 'gone'])->delete();

        $this->getJson('/admin/v1/projects')
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.slug', 'draft')
            ->assertJsonPath('data.0.cover', null)
            ->assertJsonPath('data.0.screens_count', 0)
            ->assertJsonPath('data.1.screens_count', 2)
            ->assertJsonPath('data.1.cover.tab_key', 'tab-1')
            ->assertJsonPath('data.1.cover.alt', ['ar' => 'لقطة 1']);
    }

    public function test_delete_is_soft_and_reorder_sets_positions(): void
    {
        $a = $this->makeProject(['slug' => 'a']);
        $b = $this->makeProject(['slug' => 'b']);
        $c = $this->makeProject(['slug' => 'c']);

        $this->postJson('/admin/v1/projects/reorder', ['ids' => [$c->id, $a->id, $b->id]])->assertNoContent();
        $this->assertSame([$c->id, $a->id, $b->id], Project::orderBy('sort_order')->pluck('id')->all());

        $this->deleteJson("/admin/v1/projects/{$b->id}")->assertNoContent();
        $this->assertSoftDeleted($b);

        // A deleted (or unknown) id cannot be part of the order.
        $this->postJson('/admin/v1/projects/reorder', ['ids' => [$a->id, $b->id]])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('ids');
        $this->postJson('/admin/v1/projects/reorder', ['ids' => [$a->id, $a->id]])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('ids.0');
    }

    public function test_a_write_announces_the_pages_it_changed(): void
    {
        Event::fake([ContentChanged::class]);
        $project = $this->makeProject(['slug' => 'old-link']);

        $this->putJson("/admin/v1/projects/{$project->id}", $this->payload(['slug' => 'new-link']))->assertOk();

        Event::assertDispatched(ContentChanged::class, fn (ContentChanged $event) => $event->tags === [
            'home', 'projects', 'project:new-link', 'project:old-link',
        ]);
    }

    /** @return array<string, mixed> */
    private function payload(array $overrides = []): array
    {
        return [
            'slug' => 'school-system',
            'title' => ['ar' => 'نظام المدرسة'],
            'client_name' => ['ar' => 'مدرسة شعاع'],
            'summary' => ['ar' => 'نظام واحد للطلاب والرسوم.'],
            'tag' => ['ar' => 'نظام ERP'],
            'frame_label' => ['ar' => null],
            'challenge' => ['ar' => null],
            'solution' => ['ar' => null],
            'results' => ['ar' => null],
            'type' => 'system',
            'sector' => 'education',
            'country' => 'ps',
            'tech_stack' => ['Laravel', 'React'],
            'is_featured' => false,
            'featured_order' => 0,
            'card_theme' => null,
            'has_demo_data' => true,
            'status' => 'draft',
            'facts' => [],
            'highlights' => [],
            ...$overrides,
        ];
    }
}
