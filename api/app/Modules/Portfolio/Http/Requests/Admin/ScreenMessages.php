<?php

namespace App\Modules\Portfolio\Http\Requests\Admin;

/** Wording shared by the screen upload and edit forms. */
final class ScreenMessages
{
    public const ATTRIBUTES = [
        'kind' => 'نوع الشاشة',
        'file' => 'الملف',
        'tab_key' => 'مفتاح التبويب',
        'tab_label.ar' => 'اسم التبويب',
        'alt.ar' => 'وصف الصورة',
    ];

    public const TAB_KEY_FORMAT = 'مفتاح التبويب حروف إنجليزية صغيرة وأرقام وشرطات، حتى ٤٠ حرفاً.';

    public const NO_DESKTOP_TAB = 'لا توجد شاشة حاسوب بهذا المفتاح في المشروع. شاشة الجوال تتبع تبويب شاشة حاسوب، فارفعها أولاً أو اترك المفتاح فارغاً.';
}
