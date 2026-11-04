<?php

namespace App\Support;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/** Manual ordering shared by every sortable list: append last, and drag-and-drop reorder. */
final class SortOrder
{
    /** The position after the last row in the scope, so new items appear at the end. */
    public static function next(Builder $scope): int
    {
        $max = (clone $scope)->reorder()->max('sort_order');

        return $max === null ? 0 : (int) $max + 1;
    }

    /**
     * Sets each id's sort_order to its index. Every id must belong to the scope
     * (e.g. the screens of one project), so a request cannot touch other rows.
     *
     * @param  list<int>  $ids
     */
    public static function apply(Builder $scope, array $ids): void
    {
        DB::transaction(function () use ($scope, $ids) {
            $found = (clone $scope)->reorder()->whereKey($ids)->count();

            if ($found !== count($ids)) {
                throw ValidationException::withMessages([
                    'ids' => 'القائمة فيها عناصر غير موجودة في هذا القسم. حدّث الصفحة وأعد الترتيب.',
                ]);
            }

            foreach (array_values($ids) as $index => $id) {
                (clone $scope)->reorder()->whereKey($id)->update(['sort_order' => $index]);
            }
        });
    }
}
