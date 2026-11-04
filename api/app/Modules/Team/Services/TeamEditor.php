<?php

namespace App\Modules\Team\Services;

use App\Modules\Team\Models\TeamMember;
use App\Support\Content\ContentChanged;
use App\Support\Content\ContentTag;
use App\Support\SortOrder;
use App\Support\Translations;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;

/** The team as the dashboard edits it, hidden members included. */
class TeamEditor
{
    private const TAGS = [ContentTag::HOME, ContentTag::TEAM];

    /** @return Collection<int, TeamMember> */
    public function list(): Collection
    {
        return TeamMember::query()->with('media')->orderBy('sort_order')->orderBy('id')->get();
    }

    /** @param  array<string, mixed>  $data */
    public function create(array $data): TeamMember
    {
        $member = new TeamMember([
            'is_founder' => false,
            'is_visible' => true,
            'sort_order' => SortOrder::next(TeamMember::query()),
        ]);

        return $this->save($member, $data);
    }

    /** @param  array<string, mixed>  $data */
    public function update(TeamMember $member, array $data): TeamMember
    {
        return $this->save($member, $data);
    }

    public function delete(TeamMember $member): void
    {
        $member->delete();

        ContentChanged::dispatch(self::TAGS);
    }

    /** @param  list<int>  $ids */
    public function reorder(array $ids): void
    {
        SortOrder::apply(TeamMember::query(), $ids);

        ContentChanged::dispatch(self::TAGS);
    }

    /** The collection holds one file, so a new photo replaces the old one. */
    public function setPhoto(TeamMember $member, UploadedFile $photo): TeamMember
    {
        $member->addMedia($photo)->toMediaCollection('photo');

        ContentChanged::dispatch(self::TAGS);

        return $member->load('media');
    }

    public function removePhoto(TeamMember $member): TeamMember
    {
        $member->clearMediaCollection('photo');

        ContentChanged::dispatch(self::TAGS);

        return $member->load('media');
    }

    /** @param  array<string, mixed>  $data */
    private function save(TeamMember $member, array $data): TeamMember
    {
        $member->fill(Arr::only($data, ['tech', 'is_founder', 'is_visible']));
        Translations::fill($member, 'name', $data['name']);
        Translations::fill($member, 'role', $data['role']);
        Translations::fill($member, 'bio', $data['bio'] ?? null);
        $member->save();

        ContentChanged::dispatch(self::TAGS);

        return $member->load('media');
    }
}
