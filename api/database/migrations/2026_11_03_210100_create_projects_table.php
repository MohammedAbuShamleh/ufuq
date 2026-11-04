<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->json('title');
            $table->json('client_name');
            $table->json('summary');
            // Not in the handoff schema: the category line every v7 card shows,
            // e.g. «منصة · إدارة المشاريع الإنسانية». The type enum alone can't produce it.
            $table->json('tag');
            $table->json('challenge')->nullable();
            $table->json('solution')->nullable();
            $table->json('results')->nullable();
            $table->enum('type', ['system', 'website', 'platform', 'app']);
            $table->enum('sector', ['charity', 'education', 'government', 'dawah', 'business']);
            $table->char('country', 2);
            $table->json('tech_stack');
            $table->boolean('is_featured')->default(false);
            $table->unsignedInteger('featured_order')->default(0);
            $table->enum('card_theme', ['linen', 'ink', 'sand', 'charcoal'])->nullable();
            $table->boolean('has_demo_data')->default(false);
            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->dateTime('published_at')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'is_featured', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
