<?php

namespace Database\Seeders;

use App\Modules\Team\Models\TeamMember;
use Illuminate\Database\Seeder;

/** The team from v7; [bracketed] names and roles are pending. Photos come from the dashboard. */
class TeamSeeder extends Seeder
{
    public function run(): void
    {
        if (TeamMember::withTrashed()->exists()) {
            $this->command?->warn('Team members already exist; skipping.');

            return;
        }

        $members = [
            ['name' => 'م. محمد أبو شمله', 'role' => 'الواجهات وتجربة الاستخدام', 'tech' => 'React · TypeScript · Tailwind', 'is_founder' => true],
            ['name' => 'م. شادي الأخرس', 'role' => '[الدور]', 'tech' => '[التقنيات]', 'is_founder' => true],
            ['name' => '[الاسم]', 'role' => 'مصمم جرافيك'],
            ['name' => '[الاسم]', 'role' => 'مبرمج واجهات أمامية'],
            ['name' => '[الاسم]', 'role' => 'مصمم واجهات وتجربة مستخدم'],
        ];

        foreach ($members as $i => $member) {
            TeamMember::create([
                'name' => ['ar' => $member['name']],
                'role' => ['ar' => $member['role']],
                'tech' => $member['tech'] ?? null,
                'is_founder' => $member['is_founder'] ?? false,
                'is_visible' => true,
                'sort_order' => $i + 1,
            ]);
        }
    }
}
