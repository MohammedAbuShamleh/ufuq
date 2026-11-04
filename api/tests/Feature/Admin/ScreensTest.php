<?php

namespace Tests\Feature\Admin;

use App\Enums\UserRole;
use App\Modules\Portfolio\Models\Project;
use App\Modules\Portfolio\Models\ProjectScreen;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\Concerns\BuildsPortfolio;
use Tests\Concerns\UsesDashboard;
use Tests\TestCase;

class ScreensTest extends TestCase
{
    use BuildsPortfolio, RefreshDatabase, UsesDashboard;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');
        $this->signIn(UserRole::Editor);
    }

    public function test_an_image_is_uploaded_as_the_last_screen(): void
    {
        $project = $this->makeFullProject(screens: 2);

        $this->post("/admin/v1/projects/{$project->id}/screens", [
            'file' => $this->png(),
            'kind' => 'desktop',
            'label' => ['ar' => 'التقارير'],
            'alt' => ['ar' => 'شاشة التقارير'],
        ])
            ->assertCreated()
            ->assertJsonPath('data.kind', 'desktop')
            ->assertJsonPath('data.label', ['ar' => 'التقارير'])
            ->assertJsonPath('data.alt', ['ar' => 'شاشة التقارير'])
            ->assertJsonPath('data.sort_order', 3)
            ->assertJsonPath('data.file.mime', 'image/png')
            ->assertJsonPath('data.file.width', 1)
            ->assertJsonPath('data.file.height', 1)
            ->assertJsonPath('data.file.sizes', [])
            ->assertJsonPath('data.file.url', fn (string $url) => str_ends_with($url, '/shot.png'));

        Storage::disk('public')->assertExists(ProjectScreen::latest('id')->first()->getFirstMedia('file')->getPathRelativeToRoot());
    }

    public function test_a_video_is_uploaded_for_a_video_screen(): void
    {
        $project = $this->makeProject();

        $this->post("/admin/v1/projects/{$project->id}/screens", [
            'file' => $this->video(),
            'kind' => 'video',
            'alt' => ['ar' => 'جولة في النظام'],
        ])
            ->assertCreated()
            ->assertJsonPath('data.sort_order', 0)
            ->assertJsonPath('data.label', ['ar' => null])
            ->assertJsonPath('data.file.url', fn (string $url) => str_ends_with($url, '/clip.mp4'));
    }

    public function test_the_file_must_match_the_kind(): void
    {
        $project = $this->makeProject();

        $this->postJson("/admin/v1/projects/{$project->id}/screens", [
            'file' => $this->png(),
            'kind' => 'video',
            'alt' => ['ar' => 'فيديو'],
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['file' => 'شاشة الفيديو تحتاج ملف MP4 أو WebM.']);

        $this->postJson("/admin/v1/projects/{$project->id}/screens", [
            'file' => $this->video(),
            'kind' => 'desktop',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'file' => 'الصورة يجب أن تكون JPEG أو PNG أو WebP.',
                'alt.ar' => 'حقل وصف الصورة مطلوب.',
            ]);

        $this->assertSame(0, ProjectScreen::count());
    }

    public function test_a_phone_screen_has_its_own_caption(): void
    {
        $project = $this->makeProject();

        $this->post("/admin/v1/projects/{$project->id}/screens", [
            'file' => $this->png('phone.png'),
            'kind' => 'mobile',
            'label' => ['ar' => 'جلسة الحفظ بالموضع'],
            'alt' => ['ar' => 'تطبيق المحفّظين'],
        ])
            ->assertCreated()
            ->assertJsonPath('data.kind', 'mobile')
            ->assertJsonPath('data.label', ['ar' => 'جلسة الحفظ بالموضع']);

        $this->postJson("/admin/v1/projects/{$project->id}/screens", [
            'file' => $this->png('phone.png'),
            'kind' => 'mobile',
            'label' => ['ar' => str_repeat('ح', 61)],
            'alt' => ['ar' => 'تطبيق'],
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['label.ar' => 'يجب ألا يتجاوز طول التسمية 60 حرفاً.']);
    }

    public function test_a_screen_is_edited_in_place(): void
    {
        $project = $this->makeProject();
        $screen = $this->uploadImage($project);

        $this->patchJson("/admin/v1/projects/{$project->id}/screens/{$screen->id}", [
            'label' => ['ar' => 'الرئيسية'],
            'alt' => ['ar' => 'الرئيسية'],
        ])
            ->assertOk()
            ->assertJsonPath('data.label', ['ar' => 'الرئيسية'])
            ->assertJsonPath('data.alt', ['ar' => 'الرئيسية'])
            ->assertJsonPath('data.kind', 'desktop')
            ->assertJsonPath('data.file.mime', 'image/png');

        // An image cannot become a video screen.
        $this->patchJson("/admin/v1/projects/{$project->id}/screens/{$screen->id}", ['kind' => 'video'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('kind');

        // A screen is only reachable through its own project.
        $this->patchJson("/admin/v1/projects/{$this->makeProject()->id}/screens/{$screen->id}", ['label' => ['ar' => 'x']])
            ->assertNotFound();
    }

    public function test_screens_are_reordered_within_their_project(): void
    {
        $project = $this->makeFullProject(screens: 3);
        [$first, $second, $third] = $project->screens()->pluck('id')->all();
        $foreign = $this->makeFullProject(screens: 1)->screens()->value('id');

        $this->postJson("/admin/v1/projects/{$project->id}/screens/reorder", ['ids' => [$third, $first, $second]])
            ->assertNoContent();

        $this->assertSame([$third, $first, $second], ProjectScreen::where('project_id', $project->id)->orderBy('sort_order')->pluck('id')->all());

        $this->postJson("/admin/v1/projects/{$project->id}/screens/reorder", ['ids' => [$first, $foreign]])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['ids' => 'القائمة فيها عناصر غير موجودة في هذا القسم. حدّث الصفحة وأعد الترتيب.']);
    }

    public function test_a_deleted_screen_leaves_the_project(): void
    {
        $project = $this->makeFullProject(screens: 2);
        $screen = $project->screens()->first();

        $this->deleteJson("/admin/v1/projects/{$project->id}/screens/{$screen->id}")->assertNoContent();

        $this->assertSoftDeleted($screen);
        $this->getJson("/admin/v1/projects/{$project->id}")->assertOk()->assertJsonCount(1, 'data.screens');
    }

    private function uploadImage(Project $project): ProjectScreen
    {
        $id = $this->post("/admin/v1/projects/{$project->id}/screens", [
            'file' => $this->png(),
            'kind' => 'desktop',
            'alt' => ['ar' => 'لقطة'],
        ])->assertCreated()->json('data.id');

        return ProjectScreen::findOrFail($id);
    }
}
