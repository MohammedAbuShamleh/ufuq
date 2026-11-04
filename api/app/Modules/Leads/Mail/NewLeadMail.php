<?php

namespace App\Modules\Leads\Mail;

use App\Modules\Leads\Models\Lead;
use App\Modules\Leads\Services\WhatsappLink;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

/** The team's notice of a contact-form message, with a way to answer in one click. */
class NewLeadMail extends Mailable
{
    /** The team's local time, for «وصلت في». */
    private const TIMEZONE = 'Asia/Gaza';

    public function __construct(public readonly Lead $lead) {}

    public function envelope(): Envelope
    {
        // Replying to the notice answers the visitor when they left an email.
        $email = filter_var($this->lead->contact, FILTER_VALIDATE_EMAIL) ? $this->lead->contact : null;

        return new Envelope(
            subject: "رسالة جديدة من الموقع: {$this->lead->name}",
            replyTo: $email ? [new Address($email, $this->lead->name)] : [],
        );
    }

    public function content(): Content
    {
        $contact = $this->lead->contact;

        return new Content(
            view: 'leads::mail.new-lead',
            text: 'leads::mail.new-lead-text',
            with: [
                'lead' => $this->lead,
                'mailto' => filter_var($contact, FILTER_VALIDATE_EMAIL) ? "mailto:{$contact}" : null,
                'whatsapp' => WhatsappLink::forContact($contact),
                'dashboardUrl' => rtrim((string) config('services.dashboard.url'), '/')."/leads/{$this->lead->id}",
                // Arabic-Indic digits, as the dashboard shows the same «وصلت في».
                'receivedAt' => strtr(
                    $this->lead->created_at->timezone(self::TIMEZONE)->locale('ar')->translatedFormat('j F Y، g:i a'),
                    ['0' => '٠', '1' => '١', '2' => '٢', '3' => '٣', '4' => '٤', '5' => '٥', '6' => '٦', '7' => '٧', '8' => '٨', '9' => '٩'],
                ),
            ],
        );
    }
}
