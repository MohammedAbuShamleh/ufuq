<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->string('name', 120);
            $table->string('contact', 160);
            $table->string('project_type', 60)->nullable();
            $table->text('message')->nullable();
            $table->string('source_page')->nullable();
            // SHA-256 of IP + app key: enough to spot abuse, without storing the address.
            $table->char('ip_hash', 64);
            // Changed only through LeadStatusService (new → contacted → closed).
            $table->enum('status', ['new', 'contacted', 'closed'])->default('new');
            $table->timestamps();

            $table->index(['status', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
