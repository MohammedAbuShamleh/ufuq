import type { Dictionary, SheetCell } from './ar'

/**
 * Every word the site shows that does not come from the API, in English: a
 * draft in the brand's voice, not a word-for-word copy of the Arabic. Western
 * digits throughout. The type keeps it the same shape as the Arabic.
 */
export const en: Dictionary = {
  meta: {
    siteName: 'UFUQ',
    homeTitle: 'Software company',
    homeShareTitle: 'Software that opens a wider horizon',
    description:
      'UFUQ is a software company from Gaza. Since 2022 it has built systems and software for charities, schools and companies: platforms, ERP and financial systems, mobile apps and websites.',
    shareImageAlt: 'UFUQ — Systems and software for charities, schools and companies',
    projectImageAlt: 'A project screen from the work of UFUQ',
    notFound: 'Page not found',
    about: {
      title: 'About us',
      description:
        'A software company from Gaza, building systems since 2022 for charities, schools, government bodies and companies in Palestine, Egypt, the UAE and Türkiye. Meet the team who will build yours.',
    },
    work: {
      title: 'Our work',
      description:
        'Systems, platforms, apps and websites UFUQ has built for charities, schools, government bodies and companies in Palestine, Egypt, the UAE and Türkiye. Filter them by kind or sector.',
    },
    privacy: {
      title: 'Privacy policy',
      description: 'What UFUQ collects through this site, how organizations’ data is handled in the systems it builds, and why it is never shared.',
    },
  },

  common: {
    logo: 'UFUQ',
    startProject: 'Start a project',
    allWork: 'All work',
    pendingLink: 'Link coming soon',
    motion: { off: 'Pause motion', on: 'Play motion' },
  },

  nav: {
    links: {
      top: 'Home',
      projects: 'Work',
      about: 'About',
      services: 'Services',
      approach: 'How we work',
      contact: 'Contact',
    },
    home: 'UFUQ, home page',
    label: 'Main',
    menu: 'Menu',
    theme: 'Switch dark mode',
  },

  footer: {
    site: 'Site',
    services: 'Services',
    contact: 'Contact',
    country: 'Palestine',
    support: 'Technical support',
    profile: 'Company profile (PDF)',
    copyright: '© {year} UFUQ Software. All rights reserved.',
    privacy: 'Privacy policy',
    toTop: 'Back to top',
    social: { linkedin: 'LinkedIn', x: 'X', instagram: 'Instagram' },
  },

  whatsapp: {
    label: 'Chat with us on WhatsApp',
    pending: 'WhatsApp number coming soon',
  },

  hero: {
    kicker: 'UFUQ Software',
    title: ['We build software', 'that opens a wider horizon.'],
    liveTitle: 'Systems running today',
    live: [
      { name: 'Saaed', what: 'Humanitarian project management' },
      { name: 'Dar Al-Itqan', what: 'Quran circles and the teachers’ app' },
      { name: 'Shuaa School', what: 'School management' },
      { name: 'Rasras', what: 'ERP · Egypt' },
      { name: 'NexaBridge', what: 'Product platform · Dubai' },
    ],
    side: { before: 'Websites, ', ltr: 'ERP', after: ' systems and platforms. Arabic-first, by design.' },
    work: 'Our work',
    cue: 'Scroll to pass through the gate',
  },

  compare: {
    kicker: 'The difference we make',
    title: ['From 58 Excel sheets', 'to one system.'],
    lead: 'This is how Shuaa School ran its fees, payroll and stock, and how it runs them today. Drag the line to see the difference.',
    afterAlt: 'The school management system running today at Shuaa School',
    afterTag: 'After — one system',
    beforeTag: 'Before — 58 sheets',
    range: 'Compare the Excel file with the system: move the line right to see the file, and left to see the system',
    note: 'The Excel file is an illustration; the screen on the right is from the real system, with sample data.',
    link: "The system's page",
    sheet: {
      file: 'student_fees_2026_FINAL_edited3.xlsx',
      warn: 'Edited by 4 people',
      formula: "=SUM(D4:D61)+'Sheet37'!F12-'Fees (2)'!E9",
      columns: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      header: ['Student', 'Grade', 'Fees', 'Paid', 'Balance', 'Discount', 'Notes'],
      rows: [
        ['Ahmad Salem', 'Grade 4', '2,200', '500', '1,700', '', ''],
        ['Leen Mahmoud', 'Grade 1', '1,800', ['1,800', 'hl'], '0', '', 'Fixed by hand'],
        ['Yousef Khaled', 'Grade 2', '1,800', '1,800', ['#REF!', 'err'], '', ''],
        ['Sara Omar', 'Grade 4', '1,800', '1,200', '600', '', ''],
        ['Mohammed Hasan', 'Grade 4', '2,000', '0', ['#VALUE!', 'err'], '', ''],
        ['Jana Rami', 'Grade 1', ['1,800', 'hl'], '500', '1,300', '', ''],
        ['Omar Nabil', 'Grade 2', '2,400', '0', '2,400', '', ''],
        ['Reem Ayman', 'Grade 4', '2,000', '900', ['#REF!', 'err'], '10%', ''],
        ['Khaled Samir', 'Grade 3', '1,800', '1,800', '0', '', ''],
        ['Hala Waleed', 'Grade 2', '2,000', ['0', 'hl'], '2,000', '', 'Fixed by hand'],
        ['Zaid Fadi', 'Grade 1', '1,800', '1,800', '0', '', ['?? check Sheet37', 'warn']],
        ['Maryam Jamal', 'Grade 2', '1,800', '1,800', '0', '200', ''],
        ['Adam Tareq', 'Grade 4', '2,400', '900', '1,500', '', ''],
        ['Tala Maher', 'Grade 3', '2,400', '900', '1,500', '10%', ''],
      ] as SheetCell[][],
      tabs: ['Fees', 'Fees (2)', 'Fees final', 'Payroll', 'Payroll old', 'Stock', 'Attendance', 'Backup', 'Sheet37', 'Sheet38'],
      activeTab: 2,
      more: '+48 sheets',
    },
  },

  featured: {
    word: 'Work',
    title: ['Systems running today', 'in real organizations.'],
    howMany: { 2: 'Two systems', 3: 'Three systems', 4: 'Four systems', 5: 'Five systems', 6: 'Six systems' },
    someSystems: 'Selected systems',
    lead: '{count} we built, each shown the way it is really used.',
    allWork: 'All our work',
  },

  layouts: {
    similar: {
      platform: 'I want a platform like this',
      app: 'I want an app like this',
      website: 'I want a website like this',
      system: 'I want a system like this',
      finance: 'I want a financial system like this',
    },
    screens: '{title} screens',
    clips: '{title} clips',
    screen: 'A screen from {title}',
    enlarge: 'Click any screen to enlarge it.',
    close: 'Close',
    demoData: 'Sample data',
  },

  work: {
    types: { system: 'Systems', finance: 'Financial systems', website: 'Websites', platform: 'Platforms', app: 'Apps' },
    sectors: {
      charity: 'Charities',
      education: 'Schools and education',
      government: 'Government',
      dawah: 'Dawah and Quran',
      business: 'Companies',
    },
    type: { system: 'System', finance: 'Financial system', website: 'Website', platform: 'Platform', app: 'Mobile app' },
    countries: { PS: 'Palestine', EG: 'Egypt', AE: 'UAE', TR: 'Türkiye' },
    typeGroup: 'Kind of work',
    allTypes: 'All kinds',
    sectorGroup: 'Sector',
    allSectors: 'All sectors',
    count: 'Projects: {count}',
    none: 'No work in this category yet.',
  },

  stats: [
    { value: '2022', label: 'The year we started', ltr: false },
    { value: '50+', label: 'Systems we have built', ltr: true },
    { value: '4', label: 'Countries our systems run in', ltr: false },
  ],

  aboutTeaser: {
    kicker: 'About us',
    title: ['A software company from Gaza,', 'building systems for organizations that serve people.'],
    lead: 'Since 2022 we have built systems for charities, schools, government bodies and companies, and we start each one by sitting down with the people who will use it.',
    whyPending: '[Why we started: a sentence or two in your own words]',
    more: 'Read our full story',
    team: 'The team',
  },

  team: {
    founder: 'Co-founder',
    founderRole: 'Co-founder · {role}',
    photoSoon: 'Photo coming soon',
    hint: 'Tap to meet',
    teamHead: 'The team',
    inColor: 'Show the photo in color',
    techPending: '[Technologies]',
  },

  voices: {
    quotesTitle: 'What they say: the people who use our systems',
    clientsTitle: 'Organizations our systems run in',
    quotesKicker: 'What they say',
    clientsKicker: 'Who we work with',
    draft: 'Draft · waiting for our clients’ words',
    pick: 'Choose a testimonial',
    wall: 'Organizations our systems run in',
    quotePending: '[Testimonial text]',
    namePending: '[Name]',
    rolePending: '[Title]',
  },

  services: {
    kicker: 'Services',
    title: 'What we build.',
    lead: 'Five kinds of software, each built around the way you work.',
    ourWork: 'From our work:',
    separator: ', ',
    items: [
      {
        title: 'Creative websites',
        text: 'Websites with a design of their own and considered motion, that tell your organization’s story and stay with the people who visit.',
        points: ['A design of its own, not a template', 'Two languages, light and dark modes', 'Motion and interaction that work on every screen'],
        tech: 'React · TypeScript · Tailwind',
      },
      {
        title: 'ERP systems',
        text: 'Purchasing, sales, warehouses, staff and payroll in one system, built on your procedures, not the other way round.',
        points: ['A full purchasing cycle with approvals', 'Multiple warehouses with live stock levels', 'HR, attendance and payroll'],
        tech: 'Spring Boot · Laravel · React',
      },
      {
        title: 'Financial systems',
        text: 'Journal entries, cash boxes and reports, with an audit log that keeps every change.',
        points: ['A daily journal and several cash boxes', 'Ready reports and export to Excel', 'An audit log of every transaction'],
        tech: 'Laravel · React · MySQL',
      },
      {
        title: 'Online platforms',
        text: 'Dashboards to run programs, requests and follow-up, with permissions for every role.',
        points: ['Permissions the server checks for every role', 'Workflows with clear statuses', 'Dashboards and statistics for each department'],
        tech: 'React · Laravel · Sanctum',
      },
      {
        title: 'Mobile apps',
        text: 'Apps for teachers, supervisors, students and customers, connected to your platform and working in the field.',
        points: ['One app for Android and iPhone', 'Connected straight to the admin dashboard', 'Arabic interfaces that sit well in the hand'],
        tech: 'Flutter',
      },
    ],
  },

  approach: {
    kicker: 'How we work',
    title: 'Rules we don’t bend.',
    lead: 'Each one runs today in a real project.',
    rules: [
      { key: 'audit', title: 'Every change is logged.', text: 'Who changed what, and when. Nothing changes out of sight.', source: 'Rashid, the audit log' },
      {
        key: 'receipts',
        title: 'Nothing is deleted.',
        text: 'Receipts are numbered in sequence, and a mistake is voided with a written reason, so the trail stays clear for the auditor.',
        source: 'School management system',
      },
      {
        key: 'permissions',
        title: 'The server checks permissions.',
        text: 'Hiding a button is not enough. Every request is checked on the server against the role of the person who sent it.',
        source: 'Huffaz Al-Wahyayn, 34 permissions',
      },
      {
        key: 'tests',
        title: 'Tests before every release.',
        text: 'Automated tests run before any update, so what is new never breaks what works.',
        source: 'Athar, 88 tests',
      },
      { key: 'demo', title: 'A working version every stage.', text: 'We build in short stages, and you try the system yourself before it is finished.', source: 'In every project' },
      { key: 'code', title: 'The code is yours.', text: 'At handover you receive the full code, the documentation and the server credentials.', source: 'In every project' },
    ],
    numbers: ['01', '02', '03', '04', '05', '06'],
    view: { grid: 'Show them all at once', deck: 'Show them one card at a time' },
    tests: { label: '{total} of {total} tests passed', passed: 'passed' },
  },

  journey: {
    kicker: 'After you get in touch',
    title: 'What happens next?',
    hint: 'Click any step',
    alt: 'A pointed stone gateway with a road running through it, between olive and cypress hills, toward the setting sun',
    caption: '{n} of {total} — {title}',
    steps: [
      {
        title: 'A free first session',
        text: 'We hear how you work today, and suggest the system that fits.',
        points: ['A 30-minute call or meeting', 'We learn how you work now, and where it wears you out', 'A first idea of what the system could look like'],
      },
      {
        title: 'A clear agreement',
        text: 'Together we set what will be built and when, before we start.',
        points: ['A written list of what will be built', 'Delivery stages and their dates', 'No work starts before we agree'],
      },
      {
        title: 'We build in stages',
        text: 'Each stage brings a working version you try yourself, so nothing surprises you at the end.',
        points: ['A working version with every stage', 'Your notes go into the next stage', 'You see the progress yourself, not in a report'],
      },
      {
        title: 'We launch and stay',
        text: 'We hand over the full code and documentation, and stay with you until the system settles in.',
        points: ['Code, documentation and server credentials', 'Technical support after launch, until the system settles in'],
      },
    ],
    ordinals: ['1', '2', '3', '4'],
  },

  contact: {
    kicker: 'Let’s begin',
    title: ['Is an Excel file', 'wearing your team out?'],
    lead: 'Tell us how you work today, and we’ll suggest the system that fits. The first session is free.',
    whatsapp: 'Chat with us on WhatsApp',
    book: 'Book a 30-minute call',
    faq: 'Questions we hear a lot',
  },

  contactForm: {
    title: 'Or leave your details and we’ll call you',
    name: 'Full name',
    contact: 'Email or phone number',
    type: 'Kind of project',
    types: {
      website: 'Creative website',
      system: 'ERP system',
      finance: 'Financial system',
      platform: 'Online platform',
      app: 'Mobile app',
      other: 'Something else',
    },
    send: 'Start the conversation',
    sending: 'Sending…',
    privacy: 'Your details are never shared.',
    sent: 'We got your request, and we’ll be in touch soon.',
    invalid: 'Check the highlighted fields, then send again.',
    tooMany: 'You sent several requests within a minute. Wait a moment, then try again.',
    failed: 'We couldn’t send it just now. Try again shortly, or message us on WhatsApp.',
  },

  support: {
    title: 'Already running a system with us?',
    text: 'Contact technical support directly with the system’s name and the problem, and we’ll stay on it with you until it’s solved.',
    button: 'Contact support',
  },

  notFound: {
    alt: 'A paper road between hills that ends at an edge, with a wooden sign pointing back',
    code: '404',
    title: ['This road', 'doesn’t lead to the horizon.'],
    text: 'The page you are looking for doesn’t exist, or has moved. The sign points the way back.',
    home: 'Back to home',
    work: 'Our work',
    contact: 'Contact us',
  },

  aboutPage: {
    kicker: 'About us',
    title: 'A software company from Gaza,',
    accent: 'building systems for organizations that serve people.',
    lead: 'We started in 2022 by building systems for charities we worked with from the inside, so we knew how an organization runs before we wrote a line of code. Today our systems run in charities, schools, Quran centers, government bodies and companies, in Palestine, Egypt, the UAE and Türkiye.',
    teamKicker: 'The founders and the team',
    teamTitle: 'Who will build your system.',
    teamText: 'You work directly with the people who write the code, with no one in between. Click a photo to meet them.',
    storyKicker: 'Our story',
    storyTitle: 'Why we started.',
    whyPending: '[Why we started: a sentence or two in your own words. For example, what you saw in charities and schools that made you start UFUQ.]',
    story:
      'We build the systems an organization runs on every day: who registers the students, who approves a purchase, who follows a project until it reaches the people it serves. That is why we always start by sitting down with the people who will use the system, not by writing code.',
    whereKicker: 'Where we work',
    whereTitle: 'Four countries, and systems running every day.',
    where: [
      { country: 'Palestine', note: 'Gaza', clients: 'Saaed · Dar Al-Itqan · Ibn Baz Association · Shuaa Private School · Ministry of Awqaf and Religious Affairs' },
      { country: 'Egypt', note: 'Industry', clients: 'Rasras Plastics' },
      { country: 'UAE', note: 'Dubai', clients: 'NexaBridge' },
      { country: 'Türkiye', note: 'Dawah', clients: 'World League of Palestine Preachers' },
    ],
    foundKicker: 'Our foundations',
    foundTitle: 'Why we are here to stay.',
    legal: 'Official registration',
    legalPending: '[Legal entity and registration number]',
    memberships: 'Memberships',
    membershipsPending: '[Membership of PITA, the Palestinian Information Technology Association of Companies, if any]',
    data: 'Data protection',
    dataText: 'Your system’s data belongs to your organization. We access it only with your permission, and for a specific purpose.',
    dataLink: 'Privacy policy',
    after: 'After launch',
    afterText: 'We hand over the full code and documentation, and stay with you on support until the system settles in.',
    cta: 'We start with a session where we listen.',
    ctaWork: 'See our work',
  },

  logoStory: {
    label: 'The story of the logo: the arch, the key and the road',
    caption: 'The story of the name',
    notes: {
      arch: { title: 'The arch', text: 'From Palestinian architecture: a gateway that opens, not a wall that closes' },
      key: { title: 'The key', text: 'Security from the first line, not an add-on at the end' },
      road: { title: 'The road', text: 'It runs on toward the horizon, as we stay with an organization after launch' },
    },
  },

  workPage: {
    kicker: 'Our work',
    title: 'What we built for organizations,',
    accent: 'and it still runs.',
    lead: 'A sample of more than 50 systems we have built since 2022: platforms, management and financial systems, apps and websites, for charities, schools, government bodies and companies. Choose a kind or a sector to see work like your organization’s.',
    list: 'All work',
    cta: 'Nothing like your organization here? We start from what you need.',
    ctaAbout: 'About us',
  },

  project: {
    back: 'All work',
    moreTitle: 'Organizations like this one.',
    allWork: 'All work',
    cta: 'Does your organization need something similar? We start with a session where we listen.',
    ctaWork: 'All work',
    facts: { client: 'Client', sector: 'Sector', country: 'Country', type: 'Kind of work', stack: 'Stack' },
    kinds: {
      system: { offers: 'What the system does', inside: 'Inside the system' },
      finance: { offers: 'What the system does', inside: 'Inside the system' },
      platform: { offers: 'What the platform does', inside: 'Inside the platform' },
      app: { offers: 'What the app does', inside: 'Inside the app' },
      website: { offers: 'What the website does', inside: 'Inside the website' },
    },
    figures: 'In numbers',
    media: {
      cover: '{title}, the cover screen',
      stage: '{title} screens',
      hint: 'Click any screen to see it full size.',
      zoom: 'Enlarge {name}',
      screen: 'the screen',
      onPhone: 'On mobile',
      phones: '{title} screens on mobile',
      box: 'A screen from {title}',
      close: 'Close',
    },
    storyTitle: 'From the problem to a working system.',
    story: {
      challenge: { title: 'The challenge', pending: '[The challenge: how the organization worked before the system, and what kept breaking?]' },
      solution: { title: 'The solution', pending: '[The solution: what we built, and who uses it in the organization?]' },
      results: { title: 'The result', pending: '[The result: what changed after launch, in numbers where there are any.]' },
    },
    stepNumbers: ['1', '2', '3'],
    quoteLabel: 'A testimonial from {organization}',
    quotePending: '[Testimonial text]',
    namePending: '[Name]',
    rolePending: '[Title]',
  },

  privacy: {
    kicker: 'Privacy',
    title: 'Privacy policy',
    draft: 'Draft for review',
    pending: '[Privacy policy text]',
    index: 'Policy sections',
    of: 'of {total}',
  },
}
