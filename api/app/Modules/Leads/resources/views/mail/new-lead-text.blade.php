{{-- Plain text, never read as HTML, so values are printed raw (escaping would show &amp;). --}}
رسالة جديدة من {!! $lead->name !!}
وصلت في {!! $receivedAt !!}@if ($lead->source_page) من صفحة {!! $lead->source_page !!}@endif


وسيلة التواصل: {!! $lead->contact !!}
نوع المشروع: {!! $lead->project_type ?: '—' !!}
@if ($lead->locale === 'en')
اللغة: الإنجليزية (من النسخة الإنجليزية من الموقع)
@endif

{!! $lead->message ?: 'لم يكتب رسالة.' !!}

@if ($whatsapp)
الرد عبر واتساب: {!! $whatsapp !!}
@endif
فتحها في اللوحة: {!! $dashboardUrl !!}
