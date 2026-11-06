import type { ProjectSector, ProjectType } from '@/lib/types'

/** A cell of the «before» workbook: its text, or its text and how it is marked. */
export type SheetCell = string | [text: string, mark: 'hl' | 'err' | 'warn']

/** The contact form's project kinds, by a key that stays the same in every language. */
export type LeadType = 'website' | 'system' | 'finance' | 'platform' | 'app' | 'other'

/** Where a rule of «طريقتنا» draws its icon from (or, for tests, its test run). */
export type RuleKey = 'audit' | 'receipts' | 'permissions' | 'tests' | 'demo' | 'code'

/** The parts of the logo that «قصة الاسم» lights up. */
export type MarkPart = 'arch' | 'key' | 'road'

/** The header's links: home sections, by the id of the section each one opens. */
export type NavId = 'top' | 'projects' | 'about' | 'services' | 'approach' | 'contact'

/**
 * Every word the site shows that does not come from the API, in Arabic.
 * Strings with {name} slots are filled with fill() from i18n/config (fillNodes()
 * for text on the page).
 */
export const ar = {
  meta: {
    siteName: 'أفق | UFUQ',
    /** The home page's title after the site's name: «أفق | UFUQ — شركة برمجيات». */
    homeTitle: 'شركة برمجيات',
    homeShareTitle: 'نبني برمجيات تفتح أفقاً أوسع',
    description:
      'أفق شركة برمجيات من غزة، تبني أنظمة وبرمجيات للجمعيات والمدارس والشركات منذ ٢٠٢٢: منصات، وأنظمة ERP ومالية، وتطبيقات جوال، ومواقع.',
    shareImageAlt: 'أفق | UFUQ — أنظمة وبرمجيات للجمعيات والمدارس والشركات',
    projectImageAlt: 'شاشة من المشروع، من أعمال أفق | UFUQ',
    notFound: 'الصفحة غير موجودة',
    about: {
      title: 'من نحن',
      description:
        'شركة برمجيات من غزة منذ ٢٠٢٢، تبني أنظمة للجمعيات والمدارس والجهات الحكومية والشركات في فلسطين ومصر والإمارات وتركيا. تعرّف على الفريق الذي سيبني نظامك.',
    },
    work: {
      title: 'أعمالنا',
      description:
        'أنظمة ومنصات وتطبيقات ومواقع بنتها أفق لجمعيات ومدارس وجهات حكومية وشركات في فلسطين ومصر والإمارات وتركيا. صنّفها حسب النوع أو القطاع.',
    },
    privacy: {
      title: 'سياسة الخصوصية',
      description: 'ما تجمعه أفق عبر موقعها، وكيف تُعامل بيانات المؤسسات في الأنظمة التي تبنيها، ولماذا لا تُشارك مع أحد.',
    },
  },

  common: {
    logo: 'أفق UFUQ',
    startProject: 'ابدأ مشروعك',
    allWork: 'كل الأعمال',
    /** A link whose address the client has not given yet (preview builds only). */
    pendingLink: 'الرابط قيد الإعداد',
    motion: { off: 'إيقاف الحركة', on: 'تشغيل الحركة' },
  },

  nav: {
    links: {
      top: 'الرئيسية',
      projects: 'أعمالنا',
      about: 'من نحن',
      services: 'خدماتنا',
      approach: 'طريقتنا',
      contact: 'تواصل معنا',
    } satisfies Record<NavId, string>,
    home: 'أفق، الصفحة الرئيسية',
    label: 'الرئيسية',
    menu: 'القائمة',
    theme: 'تبديل الوضع الليلي',
  },

  footer: {
    site: 'الموقع',
    services: 'خدماتنا',
    contact: 'تواصل',
    country: 'فلسطين',
    support: 'الدعم الفني',
    profile: 'البروفايل (PDF)',
    copyright: '© {year} أفق للبرمجيات. جميع الحقوق محفوظة.',
    privacy: 'سياسة الخصوصية',
    toTop: 'العودة للأعلى',
    social: { linkedin: 'لينكدإن', x: 'إكس', instagram: 'إنستغرام' },
  },

  whatsapp: {
    label: 'تحدّث معنا على واتساب',
    pending: 'رقم واتساب قيد الإعداد',
  },

  hero: {
    kicker: 'أفق للبرمجيات',
    title: ['نبني برمجيات', 'تفتح أفقاً أوسع.'],
    liveTitle: 'أنظمة تعمل اليوم',
    // Systems running today, named the way their users know them.
    live: [
      { name: 'ساعد', what: 'إدارة المشاريع الإنسانية' },
      { name: 'دار الإتقان', what: 'حلقات التحفيظ وتطبيق المحفّظين' },
      { name: 'مدرسة شعاع', what: 'إدارة المدرسة' },
      { name: 'رصرص', what: 'ERP · مصر' },
      { name: 'NexaBridge', what: 'منصة منتجات · دبي' },
    ],
    /** The line beside the title; `ltr` sits between the two halves, read left to right. */
    side: { before: 'مواقع وأنظمة ', ltr: 'ERP', after: ' ومنصات، عربية من الأساس.' },
    work: 'أعمالنا',
    cue: 'مرّر لتعبر البوابة',
  },

  compare: {
    kicker: 'الفرق الذي نصنعه',
    title: ['من ٥٨ ورقة Excel', 'إلى نظام واحد.'],
    lead: 'هكذا كانت مدرسة شعاع تدير رسومها ورواتبها ومخزنها، وهكذا تديرها اليوم. اسحب الخط لترى الفرق.',
    afterAlt: 'لوحة نظام إدارة المدارس الذي يعمل اليوم في مدرسة شعاع',
    afterTag: 'بعد — نظام واحد',
    beforeTag: 'قبل — ٥٨ ورقة',
    range: 'قارن بين ملف Excel والنظام: حرّك الخط لليسار لرؤية الملف، ولليمين لرؤية النظام',
    note: 'صورة ملف Excel توضيحية، والشاشة على اليسار من النظام الفعلي ببيانات تجريبية.',
    link: 'النظام في قائمة أعمالنا',
    // The school's fees workbook as it was.
    sheet: {
      file: 'رسوم_الطلاب_2026_نهائي_معدّل3.xlsx',
      warn: 'تم التعديل بواسطة ٤ أشخاص',
      formula: "=SUM(D4:D61)+'ورقة37'!F12-'الرسوم (2)'!E9",
      columns: ['أ', 'ب', 'ج', 'د', 'هـ', 'و', 'ز'],
      header: ['اسم الطالب', 'الصف', 'الرسوم', 'المدفوع', 'الباقي', 'الخصم', 'ملاحظات'],
      rows: [
        ['أحمد سالم', 'الرابع', '2,200', '500', '1,700', '', ''],
        ['لين محمود', 'الأول', '1,800', ['1,800', 'hl'], '0', '', 'عدّلته يدوياً'],
        ['يوسف خالد', 'الثاني', '1,800', '1,800', ['#REF!', 'err'], '', ''],
        ['سارة عمر', 'الرابع', '1,800', '1,200', '600', '', ''],
        ['محمد حسن', 'الرابع', '2,000', '0', ['#VALUE!', 'err'], '', ''],
        ['جنى رامي', 'الأول', ['1,800', 'hl'], '500', '1,300', '', ''],
        ['عمر نبيل', 'الثاني', '2,400', '0', '2,400', '', ''],
        ['ريم أيمن', 'الرابع', '2,000', '900', ['#REF!', 'err'], '10%', ''],
        ['خالد سمير', 'الثالث', '1,800', '1,800', '0', '', ''],
        ['هالة وليد', 'الثاني', '2,000', ['0', 'hl'], '2,000', '', 'عدّلته يدوياً'],
        ['زيد فادي', 'الأول', '1,800', '1,800', '0', '', ['؟؟ راجع ورقة 37', 'warn']],
        ['مريم جمال', 'الثاني', '1,800', '1,800', '0', '200', ''],
        ['آدم طارق', 'الرابع', '2,400', '900', '1,500', '', ''],
        ['تالا ماهر', 'الثالث', '2,400', '900', '1,500', '10%', ''],
      ] as SheetCell[][],
      tabs: ['الرسوم', 'الرسوم (2)', 'الرسوم نهائي', 'الرواتب', 'الرواتب قديم', 'المخزن', 'الحضور', 'نسخة احتياطية', 'ورقة37', 'ورقة38'],
      /** The tab that is open: «الرسوم نهائي». */
      activeTab: 2,
      more: '+٤٨ ورقة',
    },
  },

  featured: {
    word: 'أعمالنا',
    title: ['أنظمة تعمل اليوم', 'في مؤسسات حقيقية.'],
    howMany: { 2: 'منظومتان', 3: 'ثلاث منظومات', 4: 'أربع منظومات', 5: 'خمس منظومات', 6: 'ست منظومات' } as Record<number, string>,
    someSystems: 'منظومات مختارة',
    lead: '{count} من بين ما بنيناه، كلٌّ منها كما يُستخدم فعلاً.',
  },

  /** What every featured layout writes around a project's screens. */
  layouts: {
    // «I want something like this»: it opens the contact form with that kind picked.
    similar: {
      platform: 'أريد منصة مشابهة',
      app: 'أريد تطبيقاً مشابهاً',
      website: 'أريد موقعاً مشابهاً',
      system: 'أريد نظاماً مشابهاً',
    } satisfies Record<ProjectType, string>,
    screens: 'شاشات {title}',
    clips: 'مقاطع {title}',
    screen: 'شاشة من {title}',
    enlarge: 'اضغط أي شاشة لتكبيرها.',
    close: 'إغلاق',
    demoData: 'بيانات تجريبية',
  },

  otherWork: {
    title: 'مشاريع أخرى',
    sample: 'ما تراه هنا عيّنة من أكثر من ٥٠ نظاماً بنيناها منذ ٢٠٢٢.',
    filter: 'تصفية الأعمال',
    all: 'الكل',
    allWork: 'كل الأعمال',
  },

  work: {
    // Filter names: plural, as the visitor reads a shelf of work.
    types: { system: 'أنظمة', website: 'مواقع', platform: 'منصات', app: 'تطبيقات' } satisfies Record<ProjectType, string>,
    sectors: {
      charity: 'جمعيات خيرية',
      education: 'مدارس وتعليم',
      government: 'جهات حكومية',
      dawah: 'دعوة وتحفيظ',
      business: 'شركات',
    } satisfies Record<ProjectSector, string>,
    /** One project's kind, singular. */
    type: { system: 'نظام', website: 'موقع', platform: 'منصة', app: 'تطبيق جوال' } satisfies Record<ProjectType, string>,
    /** The four countries the work runs in today; any other code shows as is. */
    countries: { PS: 'فلسطين', EG: 'مصر', AE: 'الإمارات', TR: 'تركيا' } as Record<string, string>,
    typeGroup: 'نوع العمل',
    allTypes: 'كل الأنواع',
    sectorGroup: 'القطاع',
    allSectors: 'كل القطاعات',
    count: 'عدد الأعمال: {count}',
    none: 'لا أعمال بهذا التصنيف بعد.',
  },

  /** The three numbers on the home teaser and the About page. */
  stats: [
    { value: '٢٠٢٢', label: 'سنة البداية', ltr: false },
    { value: '+٥٠', label: 'نظاماً بنيناه', ltr: true },
    { value: '٤', label: 'دول تعمل فيها أنظمتنا', ltr: false },
  ],

  aboutTeaser: {
    kicker: 'من نحن',
    title: ['شركة برمجيات من غزة،', 'تبني أنظمة للمؤسسات التي تخدم الناس.'],
    lead: 'نبني منذ ٢٠٢٢ أنظمة للجمعيات والمدارس والجهات الحكومية والشركات، ونبدأ كل نظام بالجلوس مع من سيستخدمه.',
    whyPending: '[لماذا بدأنا: جملة أو جملتان بكلامكما]',
    more: 'اقرأ قصتنا كاملة',
    team: 'الفريق',
  },

  team: {
    founder: 'شريك مؤسس',
    /** A founder's line under the name: «شريك مؤسس · {role}». */
    founderRole: 'شريك مؤسس · {role}',
    photoSoon: 'الصورة قريباً',
    hint: 'اضغط للتعرّف',
    teamHead: 'فريق العمل',
    inColor: 'إظهار الصورة بالألوان',
    /** A preview build's placeholder while a teammate's technologies (not a translated field) are missing. */
    techPending: '[التقنيات]',
  },

  voices: {
    quotesTitle: 'قالوا عنّا: شهادات من يستخدم أنظمتنا',
    clientsTitle: 'مؤسسات تعمل فيها أنظمتنا',
    quotesKicker: 'قالوا عنّا',
    clientsKicker: 'من نعمل معهم',
    draft: 'مسودة · بانتظار نصوص العملاء',
    pick: 'اختر شهادة',
    wall: 'مؤسسات تعمل فيها أنظمتنا',
    quotePending: '[نص الشهادة]',
    namePending: '[الاسم]',
    rolePending: '[المنصب]',
  },

  services: {
    kicker: 'خدماتنا',
    title: 'ما نبنيه.',
    lead: 'خمسة أنواع من البرمجيات، نبني كلاً منها حول طريقة عملكم.',
    // In the order of their icons (Services.tsx), and of the footer's list.
    items: [
      {
        title: 'المواقع الإبداعية',
        text: 'مواقع إبداعية بتصميم خاص وحركة مدروسة، تحكي قصة مؤسستك وتبقى في ذاكرة زائرها.',
        points: ['تصميم إبداعي خاص، لا قالب جاهز', 'بلغتين وبوضعين فاتح وداكن', 'حركة وتفاعل يعملان على كل الشاشات'],
        tech: 'React · TypeScript · Tailwind',
      },
      {
        title: 'أنظمة ERP',
        text: 'مشتريات ومبيعات ومخازن وموظفون ورواتب في نظام واحد، مبني على إجراءاتك لا العكس.',
        points: ['دورة شراء كاملة مع اعتمادات', 'مخازن متعددة وأرصدة لحظية', 'موارد بشرية وحضور ورواتب'],
        tech: 'Spring Boot · Laravel · React',
      },
      {
        title: 'الأنظمة المالية',
        text: 'قيود يومية وصناديق وتقارير، وسجل تدقيق يحفظ كل تعديل.',
        points: ['صحيفة يومية وصناديق متعددة', 'تقارير جاهزة وتصدير إلى Excel', 'سجل تدقيق لكل عملية'],
        tech: 'Laravel · React · MySQL',
      },
      {
        title: 'المنصات الإلكترونية',
        text: 'لوحات تحكم لإدارة البرامج والطلبات والمتابعة، بصلاحيات لكل دور.',
        points: ['صلاحيات يفحصها الخادم لكل دور', 'سير عمل بحالات واضحة', 'لوحات وإحصاءات لكل قسم'],
        tech: 'React · Laravel · Sanctum',
      },
      {
        title: 'تطبيقات الجوال',
        text: 'تطبيقات للمعلمين والمشرفين والطلاب والعملاء، متصلة بمنصتك وتعمل في الميدان.',
        points: ['تطبيق واحد لأندرويد وآيفون', 'مرتبط بلوحة الإدارة مباشرة', 'واجهات عربية مريحة باليد'],
        tech: 'Flutter',
      },
    ],
  },

  approach: {
    kicker: 'طريقتنا',
    title: 'قواعد لا نتنازل عنها.',
    lead: 'وكل قاعدة منها تعمل اليوم في مشروع حقيقي.',
    rules: [
      { key: 'audit', title: 'كل تعديل له سجل.', text: 'من عدّل، وماذا عدّل، ومتى. لا شيء يتغيّر في الخفاء.', source: 'منظومة رشيد، سجل التدقيق' },
      {
        key: 'receipts',
        title: 'لا شيء يُحذف.',
        text: 'الإيصال متسلسل، والخطأ يُلغى بسبب مكتوب، فيبقى الأثر واضحاً للمراجع.',
        source: 'نظام إدارة المدارس',
      },
      {
        key: 'permissions',
        title: 'الصلاحيات يفحصها الخادم.',
        text: 'إخفاء الزر لا يكفي. كل طلب يُفحص في الخادم حسب دور صاحبه.',
        source: 'حفّاظ الوحيين، ٣٤ صلاحية',
      },
      {
        key: 'tests',
        title: 'اختبارات قبل كل نشر.',
        text: 'تُشغَّل الاختبارات الآلية قبل أي تحديث، فلا يكسر الجديد ما يعمل.',
        source: 'أثر، ٨٨ اختباراً',
      },
      { key: 'demo', title: 'نسخة تجريبية مع كل دفعة.', text: 'نبني على دفعات قصيرة، وتجرّب النظام بيدك قبل أن يكتمل.', source: 'في كل مشروع' },
      { key: 'code', title: 'الكود ملكك.', text: 'تستلم الكود والتوثيق وبيانات الخوادم كاملة عند التسليم.', source: 'في كل مشروع' },
    ] as { key: RuleKey; title: string; text: string; source: string }[],
    numbers: ['٠١', '٠٢', '٠٣', '٠٤', '٠٥', '٠٦'],
    view: { grid: 'عرض الكل معاً', deck: 'عرضها بطاقةً بطاقة' },
    tests: { label: '{total} اختباراً ناجحاً من {total}', passed: 'ناجحة' },
  },

  journey: {
    kicker: 'بعد أن تتواصل معنا',
    title: 'ماذا يحدث بعدها؟',
    hint: 'اضغط على أي خطوة',
    alt: 'بوابة طوبية مدبّبة يمر منها طريق بين تلال الزيتون والسرو نحو الشمس عند الغروب',
    caption: '{n} من {total} — {title}',
    // In the order of the camera's views (Journey.tsx).
    steps: [
      {
        title: 'جلسة أولى مجانية',
        text: 'نسمع كيف تعملون اليوم، ونقترح النظام المناسب لكم.',
        points: ['مكالمة أو لقاء لمدة ٣٠ دقيقة', 'نفهم طريقة عملكم الحالية وأين تتعبون', 'اقتراح أولي لشكل النظام'],
      },
      {
        title: 'اتفاق واضح',
        text: 'نحدد معاً ما سيُبنى ومتى، قبل أن نبدأ.',
        points: ['قائمة مكتوبة بما سيُبنى', 'مراحل التسليم ومواعيدها', 'لا عمل قبل أن نتفق'],
      },
      {
        title: 'نبني على دفعات',
        text: 'مع كل دفعة نسخة تجريبية تجربها بيدك، فلا مفاجآت في النهاية.',
        points: ['نسخة تعمل مع كل دفعة', 'ملاحظاتك تدخل الدفعة التالية', 'ترى التقدّم بعينك، لا في تقرير'],
      },
      {
        title: 'نُطلق ونرافق',
        text: 'نسلّمك الكود والتوثيق كاملين، ونبقى معك حتى يستقر النظام.',
        points: ['الكود والتوثيق وبيانات الخوادم', 'دعم فني بعد الإطلاق حتى يستقر النظام'],
      },
    ],
    ordinals: ['١', '٢', '٣', '٤'],
  },

  contact: {
    kicker: 'لنبدأ',
    title: ['عندك ملف Excel', 'يُتعب فريقك؟'],
    lead: 'أخبرنا كيف تعملون اليوم، ونقترح عليك النظام المناسب. الجلسة الأولى مجانية.',
    whatsapp: 'تحدّث معنا على واتساب',
    book: 'احجز مكالمة ٣٠ دقيقة',
    faq: 'أسئلة نسمعها كثيراً',
  },

  contactForm: {
    title: 'أو اترك بياناتك ونتصل بك',
    name: 'الاسم الكامل',
    contact: 'البريد أو رقم الجوال',
    type: 'نوع المشروع',
    // In the order the list shows them.
    types: {
      website: 'موقع إبداعي',
      system: 'نظام ERP',
      finance: 'نظام مالي',
      platform: 'منصة إلكترونية',
      app: 'تطبيق جوال',
      other: 'أمر آخر',
    } satisfies Record<LeadType, string>,
    send: 'ابدأ المحادثة',
    sending: 'جارٍ الإرسال…',
    privacy: 'بياناتك لا تُشارك مع أحد.',
    sent: 'وصلنا طلبك، وسنتواصل معك قريباً.',
    invalid: 'راجع الحقول المظلّلة ثم أرسل مرة أخرى.',
    tooMany: 'أرسلت عدة طلبات في دقيقة واحدة. انتظر قليلاً ثم أعد المحاولة.',
    failed: 'تعذّر الإرسال الآن. أعد المحاولة بعد قليل، أو راسلنا على واتساب.',
  },

  support: {
    title: 'عندك نظام يعمل معنا؟',
    text: 'تواصل مع الدعم الفني مباشرة، واذكر اسم النظام والمشكلة، ونتابعها معك حتى تُحل.',
    button: 'تواصل مع الدعم',
  },

  notFound: {
    alt: 'طريق ورقي بين التلال ينتهي عند حافة، وعليه لافتة خشبية تشير إلى الخلف',
    code: '٤٠٤',
    title: ['هذا الطريق', 'لا يؤدي إلى الأفق.'],
    text: 'الصفحة التي تبحث عنها غير موجودة، أو نُقلت إلى مكان آخر. اللافتة تشير إلى طريق العودة.',
    home: 'العودة للرئيسية',
    work: 'أعمالنا',
    contact: 'تواصل معنا',
  },

  aboutPage: {
    kicker: 'من نحن',
    title: 'شركة برمجيات من غزة،',
    accent: 'تبني أنظمة للمؤسسات التي تخدم الناس.',
    lead: 'بدأنا عام ٢٠٢٢ ببناء أنظمة للجمعيات التي نعمل معها من الداخل، فعرفنا كيف تُدار المؤسسة قبل أن نكتب أول سطر. اليوم تعمل أنظمتنا في جمعيات ومدارس ومراكز تحفيظ وجهات حكومية وشركات، في فلسطين ومصر والإمارات وتركيا.',
    teamKicker: 'المؤسسان والفريق',
    teamTitle: 'من سيبني نظامك.',
    teamText: 'تتعامل مع من يكتب الكود مباشرة، لا مع وسيط بينكما. اضغط على الصورة للتعرّف.',
    storyKicker: 'قصتنا',
    storyTitle: 'لماذا بدأنا.',
    whyPending: '[لماذا بدأنا: جملة أو جملتان بكلامكما. مثلاً ما الذي رأيتماه في الجمعيات والمدارس جعلكما تبدآن أفق.]',
    story:
      'نبني الأنظمة التي تُدار بها المؤسسة يومياً: من يسجّل الطلاب، ومن يعتمد الشراء، ومن يتابع المشروع حتى يصل للمستفيد. ولهذا نبدأ دائماً بالجلوس مع من سيستخدم النظام، لا بكتابة الكود.',
    whereKicker: 'أين نعمل',
    whereTitle: 'أربع دول، وأنظمة تعمل كل يوم.',
    where: [
      { country: 'فلسطين', note: 'غزة', clients: 'ساعد · دار الإتقان · جمعية ابن باز · مدرسة شعاع الخاصة · وزارة الأوقاف والشؤون الدينية' },
      { country: 'مصر', note: 'صناعة', clients: 'رصرص للبلاستيك' },
      { country: 'الإمارات', note: 'دبي', clients: 'NexaBridge' },
      { country: 'تركيا', note: 'دعوة', clients: 'الرابطة العالمية لدعاة فلسطين' },
    ],
    foundKicker: 'الأساس المؤسسي',
    foundTitle: 'ما يثبت أننا هنا لنبقى.',
    legal: 'التسجيل الرسمي',
    legalPending: '[الكيان القانوني ورقم التسجيل]',
    memberships: 'العضويات',
    membershipsPending: '[عضوية اتحاد شركات أنظمة المعلومات الفلسطينية (بيتا) إن وُجدت]',
    data: 'حماية البيانات',
    dataText: 'بيانات نظامك ملك مؤسستك، ولا نصل إليها إلا بإذنك ولغرض محدد.',
    dataLink: 'سياسة الخصوصية',
    after: 'بعد الإطلاق',
    afterText: 'نسلّمك الكود والتوثيق كاملين، ونبقى معك بالدعم حتى يستقر النظام.',
    cta: 'نبدأ بجلسة نسمعك فيها.',
    ctaWork: 'شاهد أعمالنا',
  },

  logoStory: {
    label: 'قصة الشعار: القوس والمفتاح والطريق',
    caption: 'قصة الاسم',
    notes: {
      arch: { title: 'القوس', text: 'من العمارة الفلسطينية: بوابة تُفتح، لا جدار يُغلق' },
      key: { title: 'المفتاح', text: 'الأمان من أول سطر، لا إضافة في النهاية' },
      road: { title: 'الطريق', text: 'يمتد نحو الأفق، كما نبقى مع المؤسسة بعد الإطلاق' },
    } satisfies Record<MarkPart, { title: string; text: string }>,
  },

  workPage: {
    kicker: 'أعمالنا',
    title: 'ما بنيناه للمؤسسات،',
    accent: 'وما زال يعمل.',
    lead: 'عيّنة من أكثر من ٥٠ نظاماً بنيناها منذ ٢٠٢٢: منصات وأنظمة إدارة ومالية وتطبيقات ومواقع، لجمعيات ومدارس وجهات حكومية وشركات. اختر النوع أو القطاع لترى ما يشبه مؤسستك.',
    list: 'كل الأعمال',
    cta: 'لم تجد ما يشبه مؤسستك؟ نبدأ من احتياجك.',
    ctaAbout: 'من نحن',
  },

  project: {
    back: 'كل الأعمال',
    moreTitle: 'مؤسسات تشبه هذه.',
    allWork: 'كل الأعمال',
    cta: 'مؤسستك تحتاج شيئاً مشابهاً؟ نبدأ بجلسة نسمعك فيها.',
    ctaWork: 'كل الأعمال',
    facts: { client: 'العميل', sector: 'القطاع', country: 'الدولة', type: 'نوع العمل', stack: 'التقنيات' },
    /** The section headings speak of the kind of work by its name. */
    kinds: {
      system: { offers: 'ما يقدّمه النظام', inside: 'داخل النظام' },
      platform: { offers: 'ما تقدّمه المنصة', inside: 'داخل المنصة' },
      app: { offers: 'ما يقدّمه التطبيق', inside: 'داخل التطبيق' },
      website: { offers: 'ما يقدّمه الموقع', inside: 'داخل الموقع' },
    } satisfies Record<ProjectType, { offers: string; inside: string }>,
    figures: 'بالأرقام',
    /** The screens: cover, walk-through, phones and the full-size dialog (ProjectMedia). */
    media: {
      cover: 'واجهة {title}',
      stage: 'شاشات {title}',
      hint: 'اضغط أي شاشة لتراها بحجمها.',
      zoom: 'تكبير {name}',
      screen: 'الشاشة',
      onPhone: 'على الجوال',
      phones: 'شاشات {title} على الجوال',
      box: 'شاشة من {title}',
      close: 'إغلاق',
    },
    storyTitle: 'من المشكلة إلى نظام يعمل.',
    // Challenge, solution, result: the client fills them.
    story: {
      challenge: { title: 'التحدي', pending: '[التحدي: كيف كانت المؤسسة تعمل قبل النظام، وما الذي كان يتعطّل؟]' },
      solution: { title: 'الحل', pending: '[الحل: ما الذي بنيناه، ومن يستخدمه في المؤسسة؟]' },
      results: { title: 'النتيجة', pending: '[النتيجة: ما الذي تغيّر بعد الإطلاق، بالأرقام إن وُجدت.]' },
    },
    stepNumbers: ['١', '٢', '٣'],
    quoteLabel: 'شهادة {organization}',
    quotePending: '[نص الشهادة]',
    namePending: '[الاسم]',
    rolePending: '[المنصب]',
  },

  privacy: {
    kicker: 'الخصوصية',
    title: 'سياسة الخصوصية',
    draft: 'مسودة للمراجعة',
    pending: '[نص سياسة الخصوصية]',
    index: 'أقسام السياسة',
    /** «٠٢ من ٠٧» under the arch: the section at the reading line, of how many. */
    of: 'من {total}',
  },
}

export type Dictionary = typeof ar
