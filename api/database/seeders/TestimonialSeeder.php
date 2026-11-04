<?php

namespace Database\Seeders;

use App\Modules\Portfolio\Models\Project;
use App\Modules\Testimonials\Models\Testimonial;
use App\Support\Enums\PublishStatus;
use Illuminate\Database\Seeder;

/** Placeholders from v7: the [bracketed] text is pending and shows with the red marker. */
class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        if (Testimonial::withTrashed()->exists()) {
            $this->command?->warn('Testimonials already exist; skipping.');

            return;
        }

        $projectIds = Project::whereIn('slug', ['school-management', 'saiid', 'dar-al-itqan'])->pluck('id', 'slug');

        $testimonials = [
            ['school-management', '[شهادة من إدارة مدرسة شعاع الخاصة: ماذا تغيّر بعد الانتقال من ملف Excel إلى النظام؟]', 'مدرسة شعاع الخاصة'],
            ['saiid', '[شهادة من ساعد: كيف صارت متابعة المشاريع والتقارير بعد المنصة؟]', 'ساعد'],
            ['dar-al-itqan', '[شهادة من دار الإتقان: تجربتهم مع المنصة والموقع.]', 'دار الإتقان'],
        ];

        foreach ($testimonials as $i => [$slug, $quote, $organization]) {
            Testimonial::create([
                'project_id' => $projectIds->get($slug),
                'quote' => ['ar' => $quote],
                'author_name' => ['ar' => '[الاسم]'],
                'author_title' => ['ar' => '[المنصب]'],
                'organization' => ['ar' => $organization],
                'status' => PublishStatus::Published,
                'sort_order' => $i + 1,
            ]);
        }
    }
}
