<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/** The browser frame it captioned is gone with the v7 cards. */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn('frame_label');
        });
    }

    /** The column comes back empty: the captions it held are not kept. */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->json('frame_label')->nullable()->after('tag');
        });
    }
};
