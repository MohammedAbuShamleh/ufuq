<?php

namespace Tests\Feature\Admin;

use App\Enums\UserRole;
use App\Modules\Clients\Models\Client;
use App\Modules\Site\Models\Faq;
use App\Modules\Team\Models\TeamMember;
use App\Modules\Testimonials\Models\Testimonial;
use App\Support\Content\ContentChanged;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Storage;
use Tests\Concerns\BuildsPortfolio;
use Tests\Concerns\UsesDashboard;
use Tests\TestCase;

class ContentTest extends TestCase
{
    use BuildsPortfolio, RefreshDatabase, UsesDashboard;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');
        $this->signIn(UserRole::Editor);
    }

    public function test_team_members_are_created_reordered_and_given_a_photo(): void
    {
        $first = $this->postJson('/admin/v1/team', [
            'name' => ['ar' => 'م. محمد'],
            'role' => ['ar' => 'الواجهات'],
            'bio' => ['ar' => null],
            'tech' => 'React',
            'is_founder' => true,
        ])
            ->assertCreated()
            ->assertJsonPath('data.name', ['ar' => 'م. محمد'])
            ->assertJsonPath('data.bio', ['ar' => null])
            ->assertJsonPath('data.is_visible', true)
            ->assertJsonPath('data.photo', null)
            ->json('data.id');

        $second = $this->postJson('/admin/v1/team', ['name' => ['ar' => 'سارة'], 'role' => ['ar' => 'تصميم'], 'is_visible' => false])
            ->assertCreated()
            ->assertJsonPath('data.sort_order', 1)
            ->json('data.id');

        $this->postJson('/admin/v1/team/reorder', ['ids' => [$second, $first]])->assertNoContent();

        // Hidden members are still listed for the dashboard, in the new order.
        $this->getJson('/admin/v1/team')
            ->assertOk()
            ->assertJsonPath('data.0.id', $second)
            ->assertJsonPath('data.0.is_visible', false)
            ->assertJsonPath('data.1.id', $first);

        $this->post("/admin/v1/team/{$first}/photo", ['photo' => $this->png('face.png')])
            ->assertOk()
            ->assertJsonPath('data.photo.width', 1)
            ->assertJsonPath('data.photo.url', fn (string $url) => str_ends_with($url, '/face.png'));

        $this->deleteJson("/admin/v1/team/{$first}/photo")->assertOk()->assertJsonPath('data.photo', null);

        $this->deleteJson("/admin/v1/team/{$second}")->assertNoContent();
        $this->assertSoftDeleted(TeamMember::withTrashed()->find($second));
    }

    public function test_a_testimonial_links_to_a_project(): void
    {
        Event::fake([ContentChanged::class]);
        $project = $this->makeProject(['slug' => 'saiid', 'title' => ['ar' => 'ساعد']]);
        $other = $this->makeProject(['slug' => 'rasras']);

        $id = $this->postJson('/admin/v1/testimonials', $this->testimonial(['project_id' => $project->id]))
            ->assertCreated()
            ->assertJsonPath('data.project_id', $project->id)
            ->assertJsonPath('data.project', ['id' => $project->id, 'title' => ['ar' => 'ساعد']])
            ->assertJsonPath('data.quote', ['ar' => 'غيّرت المنصة عملنا.'])
            ->assertJsonPath('data.status', 'published')
            ->json('data.id');

        // Moving the quote to another project refreshes both project pages.
        $this->putJson("/admin/v1/testimonials/{$id}", $this->testimonial(['project_id' => $other->id]))->assertOk();
        Event::assertDispatched(ContentChanged::class, fn (ContentChanged $event) => $event->tags === ['home', 'project:saiid', 'project:rasras']
            || $event->tags === ['home', 'project:rasras', 'project:saiid']);

        Testimonial::create([...$this->testimonial(), 'project_id' => null, 'sort_order' => 9]);

        $this->getJson('/admin/v1/testimonials')
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.project.id', $other->id)
            ->assertJsonPath('data.1.project', null);

        // A deleted project cannot be linked.
        $project->delete();
        $this->putJson("/admin/v1/testimonials/{$id}", $this->testimonial(['project_id' => $project->id]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['project_id' => 'المشروع المختار غير موجود أو محذوف.']);
    }

    public function test_clients_get_a_logo_and_keep_their_order(): void
    {
        $a = Client::create(['name' => ['ar' => 'أ'], 'sector_label' => ['ar' => 'ق'], 'location' => ['ar' => 'غزة'], 'sort_order' => 0]);

        $b = $this->postJson('/admin/v1/clients', [
            'name' => ['ar' => 'دار الإتقان'],
            'sector_label' => ['ar' => 'تحفيظ القرآن'],
            'location' => ['ar' => 'غزة'],
        ])
            ->assertCreated()
            ->assertJsonPath('data.sort_order', 1)
            ->assertJsonPath('data.is_visible', true)
            ->json('data.id');

        $this->post("/admin/v1/clients/{$b}/logo", ['logo' => $this->png('logo.png')])
            ->assertOk()
            ->assertJsonPath('data.logo.mime', 'image/png');

        $this->postJson('/admin/v1/clients/reorder', ['ids' => [$b, $a->id]])->assertNoContent();

        $this->getJson('/admin/v1/clients')
            ->assertOk()
            ->assertJsonPath('data.0.id', $b)
            ->assertJsonPath('data.0.logo.url', fn (string $url) => str_ends_with($url, '/logo.png'))
            ->assertJsonPath('data.1.logo', null);

        $this->deleteJson("/admin/v1/clients/{$b}/logo")->assertOk()->assertJsonPath('data.logo', null);
    }

    public function test_faqs_are_edited_and_reordered(): void
    {
        $hidden = Faq::create(['question' => ['ar' => 'مخفي؟'], 'answer' => ['ar' => 'نعم'], 'is_visible' => false, 'sort_order' => 0]);

        $id = $this->postJson('/admin/v1/faqs', ['question' => ['ar' => 'كم يكلف؟'], 'answer' => ['ar' => 'حسب النظام.']])
            ->assertCreated()
            ->assertJsonPath('data.sort_order', 1)
            ->json('data.id');

        $this->putJson("/admin/v1/faqs/{$id}", ['question' => ['ar' => 'كم يكلف النظام؟'], 'answer' => ['ar' => 'حسب النظام.'], 'is_visible' => false])
            ->assertOk()
            ->assertJsonPath('data.question', ['ar' => 'كم يكلف النظام؟'])
            ->assertJsonPath('data.is_visible', false);

        $this->postJson('/admin/v1/faqs/reorder', ['ids' => [$id, $hidden->id]])->assertNoContent();

        $this->getJson('/admin/v1/faqs')->assertOk()->assertJsonCount(2, 'data')->assertJsonPath('data.0.id', $id);

        $this->postJson('/admin/v1/faqs', ['question' => ['ar' => str_repeat('س', 201)], 'answer' => ['ar' => 'ج']])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['question.ar' => 'يجب ألا يتجاوز طول السؤال 200 حرفاً.']);
    }

    /** @return array<string, mixed> */
    private function testimonial(array $overrides = []): array
    {
        return [
            'quote' => ['ar' => 'غيّرت المنصة عملنا.'],
            'author_name' => ['ar' => 'أحمد'],
            'author_title' => ['ar' => 'مدير'],
            'organization' => ['ar' => 'ساعد'],
            'project_id' => null,
            'status' => 'published',
            ...$overrides,
        ];
    }
}
