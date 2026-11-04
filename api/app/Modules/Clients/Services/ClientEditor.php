<?php

namespace App\Modules\Clients\Services;

use App\Modules\Clients\Models\Client;
use App\Support\Content\ContentChanged;
use App\Support\Content\ContentTag;
use App\Support\SortOrder;
use App\Support\Translations;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;

/** The client wall as the dashboard edits it, hidden clients included. */
class ClientEditor
{
    private const TAGS = [ContentTag::HOME];

    private const TEXT = ['name', 'sector_label', 'location'];

    /** @return Collection<int, Client> */
    public function list(): Collection
    {
        return Client::query()->with('media')->orderBy('sort_order')->orderBy('id')->get();
    }

    /** @param  array<string, mixed>  $data */
    public function create(array $data): Client
    {
        $client = new Client(['is_visible' => true, 'sort_order' => SortOrder::next(Client::query())]);

        return $this->save($client, $data);
    }

    /** @param  array<string, mixed>  $data */
    public function update(Client $client, array $data): Client
    {
        return $this->save($client, $data);
    }

    public function delete(Client $client): void
    {
        $client->delete();

        ContentChanged::dispatch(self::TAGS);
    }

    /** @param  list<int>  $ids */
    public function reorder(array $ids): void
    {
        SortOrder::apply(Client::query(), $ids);

        ContentChanged::dispatch(self::TAGS);
    }

    /** The collection holds one file, so a new logo replaces the old one. */
    public function setLogo(Client $client, UploadedFile $logo): Client
    {
        $client->addMedia($logo)->toMediaCollection('logo');

        ContentChanged::dispatch(self::TAGS);

        return $client->load('media');
    }

    public function removeLogo(Client $client): Client
    {
        $client->clearMediaCollection('logo');

        ContentChanged::dispatch(self::TAGS);

        return $client->load('media');
    }

    /** @param  array<string, mixed>  $data */
    private function save(Client $client, array $data): Client
    {
        $client->fill(Arr::only($data, ['is_visible']));

        foreach (self::TEXT as $attribute) {
            Translations::fill($client, $attribute, $data[$attribute]);
        }

        $client->save();

        ContentChanged::dispatch(self::TAGS);

        return $client->load('media');
    }
}
