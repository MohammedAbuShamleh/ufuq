<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_screens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->enum('kind', ['desktop', 'mobile', 'video']);
            // Screens sharing a tab_key show together; a mobile screen with no
            // tab_key stays visible whatever tab is open.
            $table->string('tab_key', 40)->nullable();
            $table->json('tab_label')->nullable();
            $table->json('alt');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            // Leftmost column is the foreign key, so this also indexes it.
            $table->index(['project_id', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_screens');
    }
};
