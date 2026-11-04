<?php

namespace Database\Seeders;

use App\Modules\Clients\Models\Client;
use Illuminate\Database\Seeder;

/** Names only; logos are uploaded from the dashboard. */
class ClientSeeder extends Seeder
{
    public function run(): void
    {
        if (Client::withTrashed()->exists()) {
            $this->command?->warn('Clients already exist; skipping.');

            return;
        }

        $clients = [
            ['ساعد', 'جمعية خيرية', 'غزة'],
            ['دار الإتقان', 'تحفيظ القرآن', 'غزة'],
            ['جمعية ابن باز', 'جمعية دعوية', 'غزة'],
            ['مدرسة شعاع الخاصة', 'تعليم', 'غزة'],
            ['وزارة الأوقاف والشؤون الدينية', 'مشروع حفّاظ الوحيين', 'غزة'],
            ['الرابطة العالمية لدعاة فلسطين', 'رابطة دعوية', 'تركيا'],
            ['رصرص للبلاستيك', 'صناعة', 'مصر'],
            ['NexaBridge', 'تجارة', 'دبي'],
        ];

        foreach ($clients as $i => [$name, $sector, $location]) {
            Client::create([
                'name' => ['ar' => $name],
                'sector_label' => ['ar' => $sector],
                'location' => ['ar' => $location],
                'is_visible' => true,
                'sort_order' => $i + 1,
            ]);
        }
    }
}
