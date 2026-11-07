<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * A fifth kind of work, «نظام مالي», so the project kinds match the five
 * services (and the contact form's list, which already has it).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->enum('type', ['system', 'finance', 'website', 'platform', 'app'])->change();
        });
    }

    public function down(): void
    {
        DB::table('projects')->where('type', 'finance')->update(['type' => 'system']);

        Schema::table('projects', function (Blueprint $table) {
            $table->enum('type', ['system', 'website', 'platform', 'app'])->change();
        });
    }
};
