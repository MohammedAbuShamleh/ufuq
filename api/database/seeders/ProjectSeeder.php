<?php

namespace Database\Seeders;

use App\Modules\Portfolio\Enums\FeaturedLayout;
use App\Modules\Portfolio\Enums\ProjectSector;
use App\Modules\Portfolio\Enums\ProjectType;
use App\Modules\Portfolio\Models\Project;
use App\Support\Enums\PublishStatus;
use Illuminate\Database\Seeder;

/**
 * The portfolio as v8 shows it, text verbatim. Screens are uploaded from the
 * dashboard; story fields (challenge, solution, results) stay null until written.
 */
class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        if (Project::withTrashed()->exists()) {
            $this->command?->warn('Projects already exist; skipping.');

            return;
        }

        foreach ($this->featured() as $order => $project) {
            $this->create($project, ['is_featured' => true, 'featured_order' => $order + 1, 'sort_order' => 0]);
        }

        foreach ($this->others() as $order => $project) {
            $this->create($project, ['is_featured' => false, 'sort_order' => $order + 1]);
        }
    }

    private function create(array $data, array $placement): void
    {
        $project = Project::create([
            'slug' => $data['slug'],
            'title' => ['ar' => $data['title']],
            'client_name' => ['ar' => $data['client_name'] ?? $data['title']],
            'tag' => ['ar' => $data['tag']],
            'summary' => ['ar' => $data['summary']],
            'type' => $data['type'],
            'sector' => $data['sector'],
            'country' => $data['country'],
            'tech_stack' => $data['tech_stack'],
            'featured_layout' => $data['featured_layout'] ?? null,
            'featured_facts' => $data['featured_facts'] ?? null,
            'has_demo_data' => $data['has_demo_data'] ?? false,
            'status' => PublishStatus::Published,
            'published_at' => now(),
            ...$placement,
        ]);

        foreach ($data['highlights'] ?? [] as $i => $text) {
            $project->highlights()->create(['text' => ['ar' => $text], 'sort_order' => $i + 1]);
        }

        foreach ($data['facts'] ?? [] as $i => [$value, $label]) {
            $project->facts()->create(['value' => $value, 'label' => ['ar' => $label], 'sort_order' => $i + 1]);
        }
    }

    private function featured(): array
    {
        return [
            [
                'slug' => 'saiid',
                'title' => 'ساعد',
                'tag' => 'منصة · إدارة المشاريع الإنسانية',
                'summary' => 'منصة تدير بها جمعية ساعد مشاريعها الإنسانية، من تبرّع الجهة المانحة إلى وصول المساعدة وتقريرها.',
                'type' => ProjectType::Platform,
                'sector' => ProjectSector::Charity,
                'country' => 'PS',
                'tech_stack' => ['Laravel', 'React', 'MySQL'],
                'featured_layout' => FeaturedLayout::Showcase,
                'featured_facts' => [
                    ['value' => '١٤', 'label' => ['ar' => 'حالة لكل مشروع']],
                    ['value' => '٥', 'label' => ['ar' => 'لوحات تحكم']],
                ],
                'has_demo_data' => true,
                'highlights' => [
                    'مسار كامل للمشروع: التوريد والترسية والتوزيع والتنفيذ والمونتاج',
                    'ترسية بمقارنة عروض الموردين، ومخزن بتنبيهات الحد الأدنى',
                    'لوحة لكل قسم، وإحصاءات للأيتام والمخيمات والمستفيدين',
                ],
                'facts' => [
                    ['١٤', 'حالة لكل مشروع'],
                    ['٥', 'لوحات تحكم'],
                    ['Excel', 'تقارير تُصدَّر مباشرة'],
                ],
            ],
            [
                'slug' => 'dar-al-itqan',
                'title' => 'دار الإتقان',
                'tag' => 'نظام وتطبيق · تحفيظ القرآن',
                'summary' => 'نظام لإدارة حلقات التحفيظ، وتطبيق يسجّل فيه المحفّظ جلسة كل طالب من داخل الحلقة.',
                'type' => ProjectType::App,
                'sector' => ProjectSector::Dawah,
                'country' => 'PS',
                'tech_stack' => ['Laravel', 'React', 'Flutter'],
                'featured_layout' => FeaturedLayout::Phones,
                'has_demo_data' => true,
                'highlights' => [
                    'جلسة بالموضع: السورة والآية والصفحة والسطر، والآيات تظهر فوراً',
                    'إجازة الأجزاء من المشرف، وتقييم المحفّظين بمعايير معتمدة',
                    'لوحة للإدارة بالطلاب والحلقات والمتميزين والإحصاءات، ووضع داكن في التطبيق',
                ],
                'facts' => [
                    ['٣', 'أنواع للجلسة: جديد ومراجعة واختبار'],
                    ['٤', 'مستويات للتقييم'],
                    ['٦٠٤', 'صفحات في المصحف المدمج'],
                ],
            ],
            [
                'slug' => 'rasras',
                'title' => 'رصرص للبلاستيك',
                'tag' => 'ERP · استيراد وتوزيع · مصر',
                'summary' => 'نظام ERP وموقع تعريفي لشركة مصرية تستورد خامات البلاستيك وتوزّعها من أربعة مستودعات.',
                'type' => ProjectType::System,
                'sector' => ProjectSector::Business,
                'country' => 'EG',
                'tech_stack' => ['Spring Boot', 'React', 'TypeScript'],
                'featured_layout' => FeaturedLayout::Sheet,
                'has_demo_data' => true,
                'highlights' => [
                    'دورة شراء كاملة: طلب، فعروض موردين، فمقارنة، فأمر شراء',
                    'مبيعات ومخازن متعددة وموارد بشرية ورواتب',
                    'بريد اعتمادات يتحدّث لحظياً، على الكمبيوتر والجوال',
                ],
                'facts' => [
                    ['٨', 'أقسام مترابطة'],
                    ['٤', 'مستودعات'],
                    ['٢', 'نظام وموقع'],
                ],
            ],
            [
                'slug' => 'nexabridge',
                'title' => 'NexaBridge',
                'tag' => 'موقع ومنصة منتجات · دبي',
                'summary' => 'منصة لشركة في دبي توزّع أنظمة طاقة وإنارة ذكية من الصين إلى العالم.',
                'type' => ProjectType::Website,
                'sector' => ProjectSector::Business,
                'country' => 'AE',
                'tech_stack' => ['React', 'TypeScript', 'Tailwind', 'Motion'],
                'featured_layout' => FeaturedLayout::Reel,
                'has_demo_data' => false,
                'highlights' => [
                    'بلغتين وبوضعين فاتح وداكن، يتبدّلان دون إعادة تحميل',
                    'مصمّم ألواح Aurora وكتالوج بمقارنة المنتجات',
                    'منتجات تتحكم بلونها وحرارتها وسطوعها مباشرة',
                ],
                'facts' => [
                    ['٢', 'لغتان'],
                    ['٢', 'وضعان'],
                    ['٣٧', 'منتجاً في الكتالوج'],
                ],
            ],
        ];
    }

    /** Sectors marked "guess" are not stated in v7; confirm them in the dashboard. */
    private function others(): array
    {
        return [
            [
                'slug' => 'school-management',
                'title' => 'نظام إدارة المدارس',
                'client_name' => 'مدرسة شعاع الخاصة',
                'tag' => 'نظام ERP',
                'summary' => 'مدرسة شعاع: من ملف Excel من ٥٨ ورقة إلى نظام واحد للطلاب والرسوم والرواتب والمخزن والحضور.',
                'type' => ProjectType::System,
                'sector' => ProjectSector::Education,
                'country' => 'PS',
                'tech_stack' => ['Laravel', 'React', 'MySQL'],
                'has_demo_data' => true,
            ],
            [
                'slug' => 'huffaz-al-wahyayn',
                'title' => 'حفّاظ الوحيين',
                'client_name' => 'وزارة الأوقاف والشؤون الدينية',
                'tag' => 'منصة',
                'summary' => 'منصة لوزارة الأوقاف والشؤون الدينية بغزة، تتابع مشروع حفظ الأحاديث «الجمع بين الصحيحين» في خمس محافظات: ٥ مستويات وصول و٣٤ صلاحية موثّقة.',
                'type' => ProjectType::Platform,
                'sector' => ProjectSector::Government,
                'country' => 'PS',
                'tech_stack' => ['React', 'Laravel', 'Sanctum'],
            ],
            [
                'slug' => 'rashid',
                'title' => 'منظومة رشيد',
                'tag' => 'نظام مالي',
                'summary' => 'قيود يومية وصناديق ومخزون وتقارير، وسجل تدقيق لكل تعديل.',
                'type' => ProjectType::System,
                'sector' => ProjectSector::Charity, // guess
                'country' => 'PS',
                'tech_stack' => ['Laravel', 'React', 'MySQL'],
            ],
            [
                'slug' => 'athar',
                'title' => 'أثر',
                'tag' => 'نظام إدارة',
                'summary' => 'من طلب الجهة إلى النشر: لوحة تكليفات للمكتب الإعلامي، ٤ أدوار و٨٨ اختباراً آلياً.',
                'type' => ProjectType::System,
                'sector' => ProjectSector::Charity, // guess
                'country' => 'PS',
                'tech_stack' => ['Laravel', 'Inertia', 'React'],
            ],
            [
                'slug' => 'dar-al-itqan-website',
                'title' => 'موقع دار الإتقان',
                'client_name' => 'دار الإتقان',
                'tag' => 'موقع تعريفي',
                'summary' => 'برامج الدار وأخبارها.',
                'type' => ProjectType::Website,
                'sector' => ProjectSector::Dawah,
                'country' => 'PS',
                'tech_stack' => ['React', 'Tailwind'],
            ],
            [
                'slug' => 'sufaraa-al-dawah',
                'title' => 'سفراء الدعوة',
                'tag' => 'منصة',
                'summary' => 'متابعة الأنشطة الدعوية.',
                'type' => ProjectType::Platform,
                'sector' => ProjectSector::Dawah,
                'country' => 'PS',
                'tech_stack' => ['React', 'TypeScript', 'Laravel'],
            ],
            [
                'slug' => 'palestine-preachers-league',
                'title' => 'الرابطة العالمية لدعاة فلسطين',
                'tag' => 'موقع ومنصة',
                'summary' => 'موقع ومنصة الرابطة.',
                'type' => ProjectType::Website,
                'sector' => ProjectSector::Dawah,
                'country' => 'TR',
                'tech_stack' => ['React', 'Laravel', 'Sanctum'],
            ],
            [
                'slug' => 'elegarden',
                'title' => 'Elegarden',
                'tag' => 'موقع تعريفي',
                'summary' => 'شركة تنسيق حدائق.',
                'type' => ProjectType::Website,
                'sector' => ProjectSector::Business,
                'country' => 'PS', // guess
                'tech_stack' => ['HTML', 'CSS'],
            ],
        ];
    }
}
