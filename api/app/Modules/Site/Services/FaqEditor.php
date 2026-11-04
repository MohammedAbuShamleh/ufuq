<?php

namespace App\Modules\Site\Services;

use App\Modules\Site\Models\Faq;
use App\Support\Content\ContentChanged;
use App\Support\Content\ContentTag;
use App\Support\SortOrder;
use App\Support\Translations;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Arr;

/** FAQs as the dashboard edits them, hidden ones included. */
class FaqEditor
{
    private const TAGS = [ContentTag::HOME];

    /** @return Collection<int, Faq> */
    public function list(): Collection
    {
        return Faq::query()->orderBy('sort_order')->orderBy('id')->get();
    }

    /** @param  array<string, mixed>  $data */
    public function create(array $data): Faq
    {
        $faq = new Faq(['is_visible' => true, 'sort_order' => SortOrder::next(Faq::query())]);

        return $this->save($faq, $data);
    }

    /** @param  array<string, mixed>  $data */
    public function update(Faq $faq, array $data): Faq
    {
        return $this->save($faq, $data);
    }

    public function delete(Faq $faq): void
    {
        $faq->delete();

        ContentChanged::dispatch(self::TAGS);
    }

    /** @param  list<int>  $ids */
    public function reorder(array $ids): void
    {
        SortOrder::apply(Faq::query(), $ids);

        ContentChanged::dispatch(self::TAGS);
    }

    /** @param  array<string, mixed>  $data */
    private function save(Faq $faq, array $data): Faq
    {
        $faq->fill(Arr::only($data, ['is_visible']));
        Translations::fill($faq, 'question', $data['question']);
        Translations::fill($faq, 'answer', $data['answer']);
        $faq->save();

        ContentChanged::dispatch(self::TAGS);

        return $faq;
    }
}
