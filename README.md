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

## Design system

The tokens live as CSS variables in `web/src/app/globals.css` and its twin
`admin/src/app/globals.css`, mapped to Tailwind there. The two files differ only in
their font stacks, so change them together. Tailwind's default palette is switched off:
components use the identity classes only (`bg-accent`, `text-muted`, `rounded-card`…).

## Running locally

```bash
cd api && composer install && cp .env.example .env && php artisan key:generate && php artisan migrate --seed && php artisan storage:link && php artisan serve
```

The seed loads the v7 content once; it skips any table that already has rows, because
after launch the dashboard owns the content. Image uploads need PHP's GD or Imagick
extension to build the webp sizes.

```bash
cd web && npm install && npm run dev
```

```bash
cd admin && npm install && npm run dev
```

The site runs on `localhost:3000`, the dashboard on `localhost:5173`, and the API on
`localhost:8000` (health check: `/up`, content: `/v1/home`). Composer resolves dependencies for PHP 8.3 (the
production version) whatever PHP version is installed locally.

## Phases

1. Foundation ✅
2. Database and public API ✅
3. Home page
4. Remaining pages
5. Dashboard
6. Wiring and instant revalidation
7. Deployment and launch
