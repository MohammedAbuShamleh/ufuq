<?php

namespace App\Modules\Leads\Services;

use App\Modules\Leads\Enums\LeadStatus;
use App\Modules\Leads\Exceptions\InvalidLeadTransition;
use App\Modules\Leads\Models\Lead;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Validation\ValidationException;

/** The dashboard's inbox of contact-form messages. */
class LeadDesk
{
    public const PER_PAGE = 20;

    public function __construct(private readonly LeadStatusService $statuses) {}

    /** Newest first, optionally one status only. */
    public function page(?LeadStatus $status): LengthAwarePaginator
    {
        return Lead::query()
            ->when($status, fn ($query) => $query->where('status', $status))
            ->latest()
            ->orderByDesc('id')
            ->paginate(self::PER_PAGE);
    }

    /** @return array<string, int> one entry per status, zero included */
    public function counts(): array
    {
        $counts = Lead::query()->toBase()
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $result = [];

        foreach (LeadStatus::cases() as $status) {
            $result[$status->value] = (int) ($counts[$status->value] ?? 0);
        }

        return $result;
    }

    /** The status rules live in LeadStatusService; a refused step becomes a form error. */
    public function moveTo(Lead $lead, LeadStatus $next): Lead
    {
        try {
            return $this->statuses->moveTo($lead, $next);
        } catch (InvalidLeadTransition $e) {
            throw ValidationException::withMessages([
                'status' => "الرسالة حالتها «{$e->from->label()}»، ولا يمكن نقلها إلى «{$e->to->label()}».",
            ]);
        }
    }
}
