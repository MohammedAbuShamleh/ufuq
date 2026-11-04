<?php

namespace Database\Seeders;

use App\Modules\Site\Enums\SettingKey;
use App\Modules\Site\Models\Faq;
use App\Modules\Site\Models\Setting;
use Illuminate\Database\Seeder;

/** FAQs and settings from v7. Every SettingKey gets a row so the dashboard can edit it; null means pending. */
class SiteSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedFaqs();
        $this->seedSettings();
    }

    private function seedFaqs(): void
    {
        if (Faq::withTrashed()->exists()) {
            $this->command?->warn('FAQs already exist; skipping.');

            return;
        }

        $faqs = [
            ['كم يكلف النظام؟', 'يختلف حسب ما سيُبنى. بعد الجلسة الأولى المجانية نرسل لك عرضاً مكتوباً بالتكلفة والمدة، ولا التزام قبل أن توافق.'],
            ['كم يستغرق البناء؟', 'نقسّم العمل إلى دفعات، ومع كل دفعة نسخة تعمل تجربها بيدك. المدة الكاملة تُكتب في الاتفاق قبل أن نبدأ.'],
            ['من يملك الكود والبيانات؟', 'أنتم. نسلّمكم الكود والتوثيق وبيانات الخوادم، وبيانات النظام ملك مؤسستكم ولا نصل إليها إلا بإذنكم.'],
            ['ماذا بعد الإطلاق؟', 'نبقى معكم بالدعم الفني حتى يستقر النظام.'],
            ['هل تعملون مع مؤسسات خارج غزة؟', 'نعم. أنظمتنا تعمل في مصر والإمارات وتركيا، ونعمل عن بُعد.'],
        ];

        foreach ($faqs as $i => [$question, $answer]) {
            Faq::create([
                'question' => ['ar' => $question],
                'answer' => ['ar' => $answer],
                'is_visible' => true,
                'sort_order' => $i + 1,
            ]);
        }
    }

    private function seedSettings(): void
    {
        if (Setting::exists()) {
            $this->command?->warn('Settings already exist; skipping.');

            return;
        }

        $values = [
            SettingKey::WhatsappNumber->value => null,
            SettingKey::BookingUrl->value => null,
            SettingKey::ContactEmail->value => 'hello@ufuq.ps',
            SettingKey::SocialLinks->value => ['linkedin' => null, 'x' => null, 'instagram' => null],
            SettingKey::ProfilePdf->value => null,
            SettingKey::HeroTagline->value => ['ar' => 'أنظمة وبرمجيات للجمعيات والمدارس والشركات'],
            SettingKey::WhyWeStarted->value => null,
            SettingKey::LegalRegistration->value => null,
            SettingKey::Memberships->value => null,
            SettingKey::PrivacyPolicy->value => ['ar' => $this->privacyPolicy()],
            SettingKey::PrivacyIsDraft->value => true,
        ];

        foreach (SettingKey::cases() as $key) {
            Setting::create(['key' => $key, 'value' => $values[$key->value]]);
        }
    }

    /** @return list<array{heading: string, paragraphs: list<string>}> */
    private function privacyPolicy(): array
    {
        return [
            [
                'heading' => 'ما نجمعه عبر هذا الموقع',
                'paragraphs' => ['الاسم ووسيلة التواصل ونوع المشروع، حين تملأ نموذج التواصل. نستخدمها للرد عليك فقط، ولا نضيفك إلى قوائم بريدية.'],
            ],
            [
                'heading' => 'البيانات في الأنظمة التي نبنيها',
                'paragraphs' => [
                    'بيانات نظامك ملك مؤسستك: المستفيدون والطلاب والموظفون والحسابات. تُستضاف حيث تختار، ولا نصل إليها إلا بإذن منك ولغرض محدد كالدعم الفني، ويُسجَّل كل وصول.',
                    'نأخذ نسخاً احتياطية دورية، ونسلّمك بياناتك كاملة ونحذف نسخنا منها عند انتهاء التعاقد إن طلبت ذلك.',
                ],
            ],
            [
                'heading' => 'لا نشارك بياناتك',
                'paragraphs' => ['لا نبيع أي بيانات ولا نشاركها مع أي طرف ثالث، ولا نعرض بيانات عملائنا في أعمالنا. الشاشات المعروضة في هذا الموقع ببيانات تجريبية.'],
            ],
            [
                'heading' => 'للتواصل',
                'paragraphs' => ['لأي سؤال عن بياناتك: hello@ufuq.ps'],
            ],
        ];
    }
}
