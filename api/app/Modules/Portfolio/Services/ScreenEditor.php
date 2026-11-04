<?php

namespace App\Modules\Portfolio\Services;

use App\Modules\Portfolio\Enums\ScreenKind;
use App\Modules\Portfolio\Models\Project;
use App\Modules\Portfolio\Models\ProjectScreen;
use App\Support\Content\ContentChanged;
use App\Support\SortOrder;
use App\Support\Translations;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

/** A project's screenshots and videos: upload, caption, order, remove. */
class ScreenEditor
{
    public function __construct(private readonly ProjectEditor $projects) {}

    /** @param  array{kind: string, label?: ?array, alt: array}  $data */
    public function upload(Project $project, array $data, UploadedFile $file): ProjectScreen
    {
        return DB::transaction(function () use ($project, $data, $file) {
            $screen = $project->screens()->make([
                'kind' => $data['kind'],
                'sort_order' => SortOrder::next($this->screensOf($project)),
            ]);

            Translations::fill($screen, 'label', $data['label'] ?? null);
            Translations::fill($screen, 'alt', $data['alt']);
            $screen->save();

            // Inside the transaction: if storing the file fails, no empty screen is left behind.
            $screen->addMedia($file)->toMediaCollection('file');

            ContentChanged::dispatch($this->projects->tags($project->slug));

            return $screen->load('media');
        });
    }

    /** @param  array<string, mixed>  $data  only the keys sent change */
    public function update(Project $project, ProjectScreen $screen, array $data): ProjectScreen
    {
        $screen->fill(Arr::only($data, ['kind']));

        foreach (['label', 'alt'] as $attribute) {
            if (array_key_exists($attribute, $data)) {
                Translations::fill($screen, $attribute, $data[$attribute]);
            }
        }

        $screen->save();

        ContentChanged::dispatch($this->projects->tags($project->slug));

        return $screen->load('media');
    }

    public function delete(Project $project, ProjectScreen $screen): void
    {
        // Soft delete keeps the file, so the screen can be restored.
        $screen->delete();

        ContentChanged::dispatch($this->projects->tags($project->slug));
    }

    /** @param  list<int>  $ids */
    public function reorder(Project $project, array $ids): void
    {
        SortOrder::apply($this->screensOf($project), $ids);

        ContentChanged::dispatch($this->projects->tags($project->slug));
    }

    /** Whether a stored file fits the kind: video for video, an image for the others. */
    public function fileMatchesKind(ProjectScreen $screen, ScreenKind $kind): bool
    {
        $mime = (string) $screen->getFirstMedia('file')?->mime_type;

        if ($mime === '') {
            return true;
        }

        return $kind === ScreenKind::Video
            ? str_starts_with($mime, 'video/')
            : str_starts_with($mime, 'image/');
    }

    private function screensOf(Project $project): Builder
    {
        return ProjectScreen::query()->where('project_id', $project->getKey());
    }
}
