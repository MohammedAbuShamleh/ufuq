<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * v8 drops the colored stacking cards: each featured project gets a layout of
 * its own, and up to two figures beside its title.
 */
return new class extends Migration
{
    /** Each v7 theme belonged to one project, so its layout follows from the theme. */
    private const LAYOUT_FOR_THEME = ['linen' => 'showcase', 'ink' => 'phones', 'charcoal' => 'sheet', 'sand' => 'reel'];

    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->enum('featured_layout', ['showcase', 'phones', 'sheet', 'reel'])->nullable()->after('featured_order');
            // [{value: "١٤", label: {ar, en}}], two at most.
            $table->json('featured_facts')->nullable()->after('featured_layout');
        });

        foreach (self::LAYOUT_FOR_THEME as $theme => $layout) {
            DB::table('projects')->where('card_theme', $theme)->update(['featured_layout' => $layout]);
        }

        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn('card_theme');
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->enum('card_theme', ['linen', 'ink', 'sand', 'charcoal'])->nullable()->after('featured_order');
        });

        foreach (self::LAYOUT_FOR_THEME as $theme => $layout) {
            DB::table('projects')->where('featured_layout', $layout)->update(['card_theme' => $theme]);
        }

        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['featured_layout', 'featured_facts']);
        });
    }
};
