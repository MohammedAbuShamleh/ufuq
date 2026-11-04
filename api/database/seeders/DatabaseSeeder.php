<?php

namespace Database\Seeders;

use App\Support\PublicCache;
use Illuminate\Database\Seeder;

/**
 * Launch content from v7. Each seeder skips a table that already has rows:
 * after the first run the dashboard owns the content, and a second run
 * must never duplicate or overwrite it.
 */
class DatabaseSeeder extends Seeder
{
    public function run(PublicCache $cache): void
    {
        $this->call([
            ProjectSeeder::class,
            TestimonialSeeder::class,
            ClientSeeder::class,
            TeamSeeder::class,
            SiteSeeder::class,
        ]);

        $cache->flush();
    }
}
