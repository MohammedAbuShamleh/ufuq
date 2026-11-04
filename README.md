# أفق | UFUQ

The UFUQ marketing site, its dashboard and its API, in one repository.
The approved design references are v7 of the home page, the About page and the 404 page;
the build handoff document defines the structure.

| Folder   | Part                       | Stack                                                  | Domain          |
| -------- | -------------------------- | ------------------------------------------------------ | --------------- |
| `web/`   | Public site (reads only)   | Next.js (App Router), TypeScript, Tailwind              | `ufuq.ps`       |
| `admin/` | Dashboard (writes)         | React, Vite, TypeScript, Tailwind, TanStack Query       | `admin.ufuq.ps` |
| `api/`   | Single source of content   | Laravel 12, Sanctum, MySQL                              | `api.ufuq.ps`   |

The site never writes to the database, and the dashboard never touches the site.
Every save goes through Laravel, which asks the site to revalidate only the affected pages.

## Backend modules

```
api/app/Modules — vertical slices by domain. No module reads another module's tables.

Portfolio     projects, project_facts, project_highlights, project_screens   → ContentChanged
Team          team_members                                                   → ContentChanged
Testimonials  testimonials                                                   → ContentChanged
Clients       clients                                                        → ContentChanged
Site          settings, faqs                                                 → ContentChanged
Leads         leads                                                          → LeadReceived
```

A module's public surface is its `Services/` and `Http/Resources/`; anything else inside it
is private. Code shared by every module (the publish status, media sizes, the public
cache) lives in `api/app/Support`. The `/home` endpoint reads from every module, so its
controller sits above them in `api/app/Http`.

## Public API

Served under `/v1` (`api.ufuq.ps/v1` in production), no auth, every read cached on the
server for five minutes.

| Endpoint                          | Returns                                                                 |
| --------------------------------- | ----------------------------------------------------------------------- |
| `GET /v1/home`                    | featured projects, other projects, clients, testimonials, team, FAQs, settings |
| `GET /v1/projects?type=&sector=`  | published projects as cards, featured first                             |
| `GET /v1/projects/{slug}`         | one project with facts, highlights, screens, story and testimonial      |
| `GET /v1/team`                    | visible team members                                                    |
| `GET /v1/settings`                | every setting key, `null` when not set yet                              |
| `POST /v1/leads`                  | stores a contact-form message (5 per minute per sender, honeypot `website`) |

Text that is still pending comes out as `null` or wrapped in `[brackets]`; the site shows
both with the pending marker. Every image comes with its original `width` and `height` and
three webp `sizes` (480, 960, 1600).

## Admin API

Served under `/admin/v1` for the dashboard only. It signs in with Sanctum's cookie
session, not tokens: the dashboard reads `GET /sanctum/csrf-cookie`, posts
`/admin/v1/login` (5 tries a minute per email and address), and sends the `XSRF-TOKEN`
cookie back as the `X-XSRF-TOKEN` header on every write. That works because the dashboard
and the API share a site (`localhost:5173` and `localhost:8000` locally,
`admin.ufuq.ps` and `api.ufuq.ps` in production) and the dashboard's host is listed in
`SANCTUM_STATEFUL_DOMAINS` and `CORS_ALLOWED_ORIGINS`.

| Endpoints                                   | Role          |
| ------------------------------------------- | ------------- |
| `login`, `logout`, `me`                     | anyone        |
| `projects` (+ `screens`, `reorder`), `team` (+ `photo`), `testimonials`, `clients` (+ `logo`), `faqs`, `leads` (+ `status`) | admin, editor |
| `settings` (+ `profile-pdf`), `users`       | admin         |

Every route names its policy ability, so the rule lives next to the model, not in the
dashboard. Errors come back in Arabic with the dashboard's own field names: a 422 carries
`errors` per field (`title.ar`, `screens.0.alt.ar`…), and 401/403/404/419/429 carry a
`message` the dashboard can show as it is.

Every content save fires `ContentChanged` with the cache tags it touches (`home`,
`projects`, `project:<slug>`, `team`, `settings`) after the transaction commits.

## Queue and email

Two jobs run after the response, so nobody waits on them:

| Event            | Listener                         | What it does                                              |
| ---------------- | -------------------------------- | --------------------------------------------------------- |
| `ContentChanged` | `FlushPublicCache` (at once)     | empties the API's cache, so `/v1` answers with the new content |
| `ContentChanged` | `RevalidateFrontend` (queued)    | posts the tags to the site's `/api/revalidate` with `REVALIDATE_SECRET`; retried 5 times over about ten minutes, then the page catches up on its hourly refresh |
| `LeadReceived`   | `NotifyTeamOfLead` (queued)      | emails the message to «بريد التواصل» from the dashboard's settings: Reply-To is the visitor when they left an email, plus a WhatsApp link for a phone and a link to the lead in the dashboard |

Without a contact email the lead is kept and only the email is skipped (logged). The same
name, contact and message from the same address within ten minutes is stored and emailed
once, so a double click is one lead.

Shared hosting keeps no worker running, so `routes/console.php` schedules
`queue:work --stop-when-empty` every minute, and one cron entry on the server runs
`php artisan schedule:run` every minute (naming PHP 8.3 explicitly; the host's default
`php` is 8.1). A dashboard save therefore shows on the site within a minute.

## Site (`web/`)

```
web/src
  app/          routes, the site shell (header, footer, theme, motion) in app/_shell
  features/     one folder per section: hero, compare, featured, work, about, voices,
                services, approach, journey, contact, and project (the project page)
  components/   the few shared pieces: Button, Kicker, ArchClip, DemoPill, Reveal
  hooks/        useInView, useReducedMotion, useMotionToggle
  lib/          API client and types, number, media and SEO helpers
```

| Route          | Reads                          | Cache tags            |
| -------------- | ------------------------------ | --------------------- |
| `/`            | `GET /v1/home`                 | `home`                |
| `/work`        | `GET /v1/projects`             | `projects`            |
| `/work/[slug]` | `GET /v1/projects/{slug}`      | `project:<slug>`, `projects` |
| `/about`       | `GET /v1/team`, `/v1/settings` | `team`, `settings`    |
| `/privacy`     | `GET /v1/settings`             | `settings`            |

Every read is tagged and kept for an hour. After a dashboard save the API posts the tags it
touched to `POST /api/revalidate` (`Authorization: Bearer <REVALIDATE_SECRET>`), which
expires them at once with `revalidateTag(tag, { expire: 0 })`: the next visit renders the
new content, rather than one last stale copy as the `'max'` profile would. Unknown tags
are refused. The footer is cached as a whole, so it carries the `settings` tag itself.
Every published project is prerendered; one published later renders on its
first visit, and an unpublished slug answers 404. `sitemap.xml` lists the same projects,
and `robots.txt` points to it.

Each page sets its title, description, canonical link and share preview through
`lib/seo.ts`. A project's preview is its first image screen, made into a 1200×630 JPEG by
`work/[slug]/opengraph-image.ts` (a desktop screen from its top, a phone screen whole on
linen); a project with no image screen shares the site's default preview.

The contact form posts from the visitor's browser straight to `POST /v1/leads`, which is
why the API allows the site's origin in `CORS_ALLOWED_ORIGINS`. «أريد نظاماً مشابهاً» on a
project page opens the home form with the project type already picked (`/?type=…#contact`).

Each section keeps the v7 class names in its own CSS file next to its component, and every
color in those files is a token from `globals.css`. Motion uses CSS, IntersectionObserver
and requestAnimationFrame only. «إيقاف الحركة» adds `motion-off` to `<html>` and is
remembered, and it behaves exactly like the system's reduced-motion setting.

## Dashboard (`admin/`)

```
admin/src
  app/          router, providers, the shell (sidebar, phone menu) in app/shell
  features/     auth, projects, team, testimonials, clients, faqs, settings, leads, users —
                each with components/, hooks/, api.ts and types.ts
  components/   shared pieces: fields, buttons, toasts, delete confirmation, sortable list,
                file drop and upload, photo cropper, the «العربية» tab for translated fields
  hooks/        useResourceForm (add/edit forms), useUnsavedGuard, useStoreRecord
  lib/          the API client (Sanctum cookie + XSRF), query hooks per resource, i18n
```

| Section          | Who            | What the team does there                                                    |
| ---------------- | -------------- | --------------------------------------------------------------------------- |
| المشاريع         | admin, editor  | text in four tabs, then screens (drop many, alt text required, phone shots follow a desktop tab), card preview, drag order |
| رسائل التواصل    | admin, editor  | filter by status, read, move new → contacted → closed, open WhatsApp       |
| الفريق           | admin, editor  | form, photo cut square in the browser before upload, drag order             |
| الشهادات         | admin, editor  | form, optional project link, draft/published, drag order                    |
| العملاء          | admin, editor  | form, logo, drag order                                                      |
| الأسئلة الشائعة  | admin, editor  | form, drag order                                                            |
| الإعدادات        | admin          | contact details, social links, profile PDF, site texts, privacy policy      |
| المستخدمون       | admin          | add people, set their role, reset a password                                |

The sidebar hides what a role cannot open, and the API refuses it anyway (a policy per
model). Every content save shows «حُفظ، ويظهر في الموقع خلال دقيقة»; drag ordering saves on
drop; uploads save on their own, with a progress bar. Deletes ask first, naming the item:
content is soft-deleted, a user is removed for good, and nobody can delete their own
account or the last admin. Removing an uploaded photo, logo or PDF asks first too. A form
with unsaved edits asks before you leave it. Numbers show in Arabic-Indic digits, as on
the site. Translated fields sit under an «العربية» tab: adding English later is one
entry in `lib/i18n.ts`, not a change to each form.

The dashboard builds to static files (`npm run build` → `dist/`); `public/.htaccess` sends
every path to `index.html` on the host.

## Design system

The tokens live as CSS variables in `web/src/app/globals.css` and its twin
`admin/src/app/globals.css`, mapped to Tailwind there. The two files differ only in
their font stacks, so change them together. Tailwind's default palette is switched off:
components use the identity classes only (`bg-accent`, `text-muted`, `rounded-card`…).
The dashboard adds the few states the site never shows (error, success, dialog scrim) in
`admin/src/app/dashboard.css`, which imports the twin, so the twin stays identical.

## Running locally

```bash
cd api && composer install && cp .env.example .env && php artisan key:generate && php artisan migrate --seed && php artisan storage:link && php artisan serve
```

The seed loads the v7 content once; it skips any table that already has rows, because
after launch the dashboard owns the content. Image uploads need PHP's GD or Imagick
extension to build the webp sizes.

```bash
cd web && npm install && cp .env.example .env.local && npm run dev
```

`API_URL` (web) and `APP_URL` (api, which builds the image addresses) point at
`127.0.0.1`, not `localhost`: Node tries IPv6 first, `artisan serve` listens on IPv4 only,
and the site's server fetches images to build share previews.

Put the same `REVALIDATE_SECRET` in `api/.env` and `web/.env.local`, then run the queue
the way cron runs it on the server:

```bash
cd api && php artisan schedule:work
```

A save then refreshes the site within a minute. That shows only on a production build
(`npm run build && npm start`): `npm run dev` does not keep pages cached. With
`MAIL_MAILER=log` the lead email lands in `api/storage/logs/laravel.log`.

```bash
cd admin && npm install && cp .env.example .env && npm run dev
```

`VITE_API_URL` points at `http://localhost:8000/admin/v1`, not `127.0.0.1`: the session
cookie only travels between same-site hosts, and `localhost:5173` and `127.0.0.1:8000`
are not. Two local accounts come from `php artisan db:seed --class=DevUsersSeeder`
(`admin@ufuq.test` and `editor@ufuq.test`; the passwords are in that file). It runs only
when `APP_ENV=local`; on the server the first admin comes from `php artisan users:create`.

Screen videos go up to 60 MB, so PHP needs `upload_max_filesize=64M` and
`post_max_size=72M`. With PHP's 2 MB default a larger file fails with «تعذّر رفع … قد يكون
الملف أكبر مما يسمح به الخادم» or «الملف أكبر من الحجم المسموح».

The site runs on `localhost:3000`, the dashboard on `localhost:5173`, and the API on
`localhost:8000` (health check: `/up`, content: `/v1/home`). Composer resolves dependencies for PHP 8.3 (the
production version) whatever PHP version is installed locally.

## Phases

1. Foundation ✅
2. Database and public API ✅
3. Home page ✅
4. Remaining pages ✅
5. Dashboard ✅
6. Wiring and instant revalidation ✅
7. Deployment and launch
