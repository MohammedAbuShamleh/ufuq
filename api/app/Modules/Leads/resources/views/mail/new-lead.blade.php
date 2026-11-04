<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>رسالة جديدة من الموقع</title>
</head>
{{-- Mail clients drop stylesheets, so styles are inline; the colors are the site's light tokens. --}}
<body style="margin:0; padding:24px 12px; background:#F7F7F6; color:#15181D; font-family:Tahoma, Arial, sans-serif; direction:rtl; text-align:right;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; margin:0 auto; background:#FFFFFF; border:1px solid #E9E7E3; border-radius:12px;">
        <tr>
            <td style="padding:28px 28px 8px;">
                <p style="margin:0 0 6px; font-size:13px; color:#A3463D;">أفق | UFUQ</p>
                <h1 style="margin:0; font-size:20px; line-height:1.6;">رسالة جديدة من {{ $lead->name }}</h1>
                <p style="margin:4px 0 0; font-size:13px; color:#66645D;">وصلت في {{ $receivedAt }}@if ($lead->source_page) من صفحة <span dir="ltr">{{ $lead->source_page }}</span>@endif</p>
            </td>
        </tr>
        <tr>
            <td style="padding:16px 28px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:15px; line-height:1.8;">
                    <tr>
                        <td style="padding:6px 0; color:#66645D; width:120px; vertical-align:top;">وسيلة التواصل</td>
                        <td style="padding:6px 0;" dir="ltr" align="right">{{ $lead->contact }}</td>
                    </tr>
                    <tr>
                        <td style="padding:6px 0; color:#66645D; vertical-align:top;">نوع المشروع</td>
                        <td style="padding:6px 0;">{{ $lead->project_type ?: '—' }}</td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td style="padding:0 28px 8px;">
                <div style="padding:16px 18px; background:#F7F7F6; border-radius:10px; font-size:15px; line-height:1.9; white-space:pre-line;">{{ $lead->message ?: 'لم يكتب رسالة.' }}</div>
            </td>
        </tr>
        <tr>
            <td style="padding:16px 28px 28px;">
                @if ($whatsapp)
                    <a href="{{ $whatsapp }}" style="display:inline-block; margin:0 0 8px 8px; padding:10px 18px; background:#A3463D; color:#FFFFFF; text-decoration:none; border-radius:999px; font-size:14px;">الرد عبر واتساب</a>
                @endif
                @if ($mailto)
                    <a href="{{ $mailto }}" style="display:inline-block; margin:0 0 8px 8px; padding:10px 18px; background:#A3463D; color:#FFFFFF; text-decoration:none; border-radius:999px; font-size:14px;">الرد بالبريد</a>
                @endif
                <a href="{{ $dashboardUrl }}" style="display:inline-block; margin:0 0 8px 8px; padding:9px 17px; border:1px solid #E9E7E3; color:#15181D; text-decoration:none; border-radius:999px; font-size:14px;">فتحها في اللوحة</a>
            </td>
        </tr>
    </table>
    <p style="max-width:560px; margin:12px auto 0; font-size:12px; color:#66645D; text-align:center;">وصلتك لأن هذا البريد هو «بريد التواصل» في إعدادات لوحة أفق.</p>
</body>
</html>
