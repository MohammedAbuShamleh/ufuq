<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * The caption in the browser bar above a featured project's screens
     * ("ساعد · لوحة التحكم"). Null falls back to the project title.
     */
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->json('frame_label')->nullable()->after('tag');
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn('frame_label');
        });
    }
};
