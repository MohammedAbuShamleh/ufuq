<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * v7 grouped screens under tabs (a phone followed a desktop tab by its key, and
 * only tabs had names). v8 shows each screen on its own, so every screen,
 * phones included, carries its own label and the tab key goes.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('project_screens', function (Blueprint $table) {
            $table->renameColumn('tab_label', 'label');
        });

        Schema::table('project_screens', function (Blueprint $table) {
            $table->dropColumn('tab_key');
        });
    }

    /** Desktop shots and videos get a tab each again; phones come back as still shots. */
    public function down(): void
    {
        Schema::table('project_screens', function (Blueprint $table) {
            $table->renameColumn('label', 'tab_label');
        });

        Schema::table('project_screens', function (Blueprint $table) {
            $table->string('tab_key', 40)->nullable()->after('kind');
        });

        DB::table('project_screens')->where('kind', '!=', 'mobile')->pluck('id')
            ->each(fn (int $id) => DB::table('project_screens')->where('id', $id)->update(['tab_key' => "tab-{$id}"]));
    }
};
