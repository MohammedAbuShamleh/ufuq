<?php

namespace Tests\Feature\Leads;

use App\Modules\Leads\Enums\LeadStatus;
use App\Modules\Leads\Exceptions\InvalidLeadTransition;
use App\Modules\Leads\Models\Lead;
use App\Modules\Leads\Services\LeadStatusService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LeadStatusServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_lead_moves_forward_one_step_at_a_time(): void
    {
        $lead = $this->makeLead();
        $service = new LeadStatusService;

        $service->moveTo($lead, LeadStatus::Contacted);
        $service->moveTo($lead, LeadStatus::Closed);

        $this->assertSame(LeadStatus::Closed, $lead->fresh()->status);
    }

    public function test_a_lead_cannot_skip_or_go_back(): void
    {
        $lead = $this->makeLead();

        try {
            (new LeadStatusService)->moveTo($lead, LeadStatus::Closed);
            $this->fail('A new lead must not jump straight to closed.');
        } catch (InvalidLeadTransition) {
            $this->assertSame(LeadStatus::New, $lead->fresh()->status);
        }
    }

    public function test_a_closed_lead_stays_closed(): void
    {
        $lead = $this->makeLead();
        $service = new LeadStatusService;
        $service->moveTo($lead, LeadStatus::Contacted);
        $service->moveTo($lead, LeadStatus::Closed);

        $this->expectException(InvalidLeadTransition::class);

        $service->moveTo($lead, LeadStatus::Contacted);
    }

    private function makeLead(): Lead
    {
        return Lead::create(['name' => 'أحمد', 'contact' => 'ahmad@example.com', 'ip_hash' => str_repeat('a', 64)]);
    }
}
