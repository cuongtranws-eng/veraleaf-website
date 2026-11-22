# Veraleaf Corporate Website — v0.3 (Payload CMS)

Bilingual (Vietnamese / English) corporate website for Veraleaf, with a
**Payload CMS** admin dashboard at `/admin` backed by **PostgreSQL**.

> **Tóm tắt (VI):** Website song ngữ dùng Next.js 16 + Payload CMS 3 + PostgreSQL.
> Trang quản trị tại `/admin`. Sao chép `.env.example` thành `.env`, tạo cơ sở dữ liệu
> PostgreSQL **mã hoá UTF8**, chạy `npm.cmd run migrate`, rồi `npm.cmd run dev`.
> Nếu chưa cấu hình cơ sở dữ liệu, website vẫn chạy bằng nội dung tĩnh như bản v0.2.

## Stack

| Part | Version |
| --- | --- |
| Next.js (App Router) | 16.4.6 |
| React | 19.3 |
| Payload CMS | 3.94.1 (`payload`, `@payloadcms/next`, `@payloadcms/ui`, `@payloadcms/db-postgres`, `@payloadcms/richtext-lexical`) |
| PostgreSQL | 14+ (UTF8 database encoding required) |
| Node.js | 22.23.5+, 24.22.3+ or 26.13.1+ (Payload engine requirement) |

**Why Next 16 instead of Next 15:** Payload 3.94 supports Next `15.4.11+ (<15.5)` or `16.4.5+`;
it does **not** support 15.5.x. Next 15.4.11 has many published security advisories
(including a critical RCE on Windows‑hosted servers), so the project uses Next 16.4.6, which is
patched and Payload-supported. The existing pages already used async `params`, so no frontend
rewrite was needed.

## Project structure

```
app/
  (frontend)/            public website (unchanged design; moved into a route group)
    [lang]/...           /vi/... and /en/... pages, now reading CMS content
    lib/cms.ts           server-side data access (Local API, public access rules, static fallbacks)
    lib/contact-action.ts  contact form server action (validation, honeypot, rate limit)
    contact-form.tsx     contact form UI
    site-data.ts, site-header.tsx, home-client.tsx, globals.css
  (payload)/             Payload admin (/admin) and API (/api, /api/graphql)
cms/
  access.ts              role helpers & access rules
  fields.ts              shared fields: slug, archived flag, draft/publish workflow
  collections/           Users, Media, Organization, Consultants, Expertise, Projects,
                         Insights, Publications, Partners, ContactMessages
  globals/CompanyInformation.ts
migrations/              database migrations (commit these)
scripts/seed.ts          seeds the current static content (expertise, about copy)
payload.config.ts        Payload configuration
payload-types.ts         generated TypeScript types (npm run generate:types)
```

## Content model

| Collection | Purpose | Localized fields | Relationships |
| --- | --- | --- | --- |
| **Company Information** (global) | Company profile, about text, mission/vision, contact details, social links | yes | — |
| **Organization** | Units of the org chart (hierarchical via `parent`) | name, description | parent unit, head (Consultant) |
| **Consultants** | Team profiles | honorific, position, summary, biography | Expertise, Organization unit; reverse join: Projects |
| **Expertise** | Areas of expertise (drives the navigation menu & home grid) | title, summary, description | reverse join: Projects |
| **Projects** | Project profiles, ongoing / completed | title, summary, content, location, client | Expertise, Consultants (team), Partners |
| **Insights** | News & articles | title, excerpt, content | authors (Consultants), Expertise, Projects |
| **Publications** | Research & publications | title, abstract, publisher | authors, Expertise, Projects, PDF (Media) |
| **Partners** | Partners / clients / donors | name, description | reverse join: Projects |
| **Media** | Images & PDFs (resized with sharp) | alt, caption | — |
| **Contact Messages** | Enquiries from the website form | — | — |
| **Users** | CMS accounts with `admin` / `editor` roles | — | — |

**Localization:** locales `vi` (default) and `en`, with fallback to Vietnamese. Use the locale
switcher at the top of each document in `/admin`. Slugs are shared between languages.

**Workflow:** all editorial collections use Payload *drafts* (**Draft** / **Published**) plus an
**Archived** checkbox in the sidebar. The public website and public API only return documents
that are *published and not archived*. Note: Payload validates fields when a document is
**published**; drafts may be saved incomplete.

**Reserved slugs:** projects cannot use `all`, `ongoing`, `completed`; insights/publications
cannot use `news`, `articles`, `publications` (they are tab URLs).

## Roles & security

| | Admin | Editor | Public |
| --- | --- | --- | --- |
| Access `/admin` | ✅ | ✅ | ❌ |
| Create / edit content, upload media | ✅ | ✅ | ❌ |
| Delete content | ✅ | ❌ | ❌ |
| Read drafts / archived | ✅ | ✅ | ❌ |
| Read published content & media | ✅ | ✅ | ✅ |
| Read / update contact messages | ✅ | ✅ | ❌ |
| Manage users & roles | ✅ | own profile only (cannot change role) | ❌ |

- The **first account** created at `/admin` (or via `npm run seed`) is automatically an admin.
  The last admin cannot be deleted.
- Login lockout after 5 failed attempts (15 min); sessions expire after 8 h; secure cookies in production.
- The public contact form is currently **not shown** on the site (removed at the owner's request).
  The server action (`app/(frontend)/lib/contact-action.ts`, with validation, honeypot, time trap and
  per-IP rate limit) is kept so it can be re-enabled. The Contact Messages collection does not accept
  public REST/GraphQL writes.
- URL fields only accept `http(s)://`. SVG uploads are disabled (XSS risk). Consultant e-mails are
  hidden from the public unless "Show email" is ticked.
- CORS/CSRF restricted to `NEXT_PUBLIC_SERVER_URL` (+ `PAYLOAD_ALLOWED_ORIGINS`).
  GraphQL playground is disabled in production. Security headers are set in `next.config.mjs`.
- All secrets come from environment variables. `.env` is git-ignored.

## 1. Install

```powershell
cd "C:\Users\Pc\Desktop\veraleaf-website-v0.2\veraleaf-website-starter"
npm.cmd install
```

## 2. Set up PostgreSQL (local)

Install PostgreSQL for Windows (https://www.postgresql.org/download/windows/, includes `psql`),
then create a user and a **UTF8** database. Vietnamese text will fail to save in a database
created with a Windows code page (WIN1252).

```powershell
psql -U postgres -c "CREATE USER veraleaf WITH PASSWORD 'choose-a-strong-password';"
psql -U postgres -c "CREATE DATABASE veraleaf OWNER veraleaf ENCODING 'UTF8' LC_COLLATE 'C' LC_CTYPE 'C' TEMPLATE template0;"
```

(Alternative with Docker: `docker run --name veraleaf-db -e POSTGRES_USER=veraleaf -e POSTGRES_PASSWORD=... -e POSTGRES_DB=veraleaf -p 5432:5432 -d postgres:17`.)

## 3. Configure environment

```powershell
Copy-Item .env.example .env
```

Edit `.env`:

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | yes | `postgres://veraleaf:PASSWORD@127.0.0.1:5432/veraleaf` |
| `PAYLOAD_SECRET` | yes | Long random string (≥ 32 chars in production) |
| `NEXT_PUBLIC_SERVER_URL` | yes | `http://localhost:3000` locally; your real domain in production |
| `PAYLOAD_ALLOWED_ORIGINS` | no | Extra allowed origins, comma separated |
| `PAYLOAD_DB_PUSH` | no | `false` disables automatic schema push in development |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | no | Used only by `npm run seed` to create the first admin |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM_ADDRESS`, `SMTP_FROM_NAME` | no | Outgoing e-mail for "Forgot password". Without `SMTP_HOST` e-mails are only logged |
| `DB_PASSWORD` | Docker only | Password of the PostgreSQL container in `docker-compose.yml` |

Generate a secret in PowerShell:

```powershell
[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Max 256 }))
```

## 4. Create the database schema

```powershell
npm.cmd run migrate
```

Optional — load the existing site content (6 expertise areas, About copy, in VI + EN) and,
if `SEED_ADMIN_*` is set, the first admin:

```powershell
npm.cmd run seed
```

## 5. Run

```powershell
npm.cmd run dev
```

- Website: http://localhost:3000 (redirects to `/vi`)
- Admin: http://localhost:3000/admin — on first visit you are asked to create the first admin user.

## Production / deployment

**Step-by-step deployment guide (Vietnamese): [DEPLOY.md](DEPLOY.md)** — VPS + PM2, VPS + Docker,
or Vercel + Neon, moving your local data to the server, HTTPS, and automatic backups.

Ready-made files: `Dockerfile`, `docker-compose.yml` (app + PostgreSQL UTF-8), `deploy/nginx.conf`
(reverse proxy + HTTPS via certbot), `deploy/ecosystem.config.cjs` (PM2).

```powershell
npm.cmd run typecheck
npm.cmd run build
npm.cmd run migrate
npm.cmd run start
```

Set `NODE_ENV=production`, a strong `PAYLOAD_SECRET`, the real `NEXT_PUBLIC_SERVER_URL`, and serve
over HTTPS. Uploaded files are stored in `./media` — persist and back up this folder together
with the database (or switch to a cloud storage adapter on hosts without persistent disk).
Fill in the `SMTP_*` variables so "Forgot password" e-mails are actually sent.

## Backups

- Windows (this PC): `powershell -ExecutionPolicy Bypass -File scripts\backup.ps1`
- Linux server: `bash scripts/backup.sh` (cron example in DEPLOY.md)

Both create `backups/db-<timestamp>.dump` (restore with `pg_restore`) and an archive of `media/`,
and delete backups older than 14 days. `backups/` is git-ignored.

## SEO

`/sitemap.xml` (static pages + published CMS content, VI/EN with hreflang) and `/robots.txt`
(blocks `/admin` and `/api`) are generated automatically from `NEXT_PUBLIC_SERVER_URL`.

## Design

- Public site: dark botanical "frosted glass" theme (`app/(frontend)/glass.module.css`,
  `glass-shell.tsx`, `home-glass.tsx`), scroll-reveal (`reveal.tsx`) and cross-document view
  transitions. Earlier designs are kept unused for rollback (`home-organic.tsx`, `home-client.tsx`).
- Admin: VeraLeaf logo/icon, login and dashboard components in `cms/admin/`, dark green theme in
  `app/(payload)/custom.css`. Admin language follows the browser; change it under Account → Language.

## Database migrations

- In **development**, Payload pushes schema changes automatically when you edit collections.
- Before deploying a schema change, create a migration and commit it:

```powershell
npm.cmd run migrate:create -- describe-your-change
```

- Production runs migrations only (`npm.cmd run migrate`); `npm.cmd run migrate:status` shows what is applied.
- If you used dev push against a database, Payload may ask for confirmation when running
  migrations on it — use a separate database for production.

## Other commands

| Command | Purpose |
| --- | --- |
| `npm.cmd run generate:types` | Regenerate `payload-types.ts` after changing collections |
| `npm.cmd run generate:importmap` | Regenerate the admin import map after adding custom admin components |
| `npm.cmd run typecheck` | TypeScript check |
| `npm.cmd run seed:org` | Create the sample LLC organisation chart (only if Organization is empty) |
| `npm.cmd run import:legacy` | Import brand/contact copy from the old veraleaf.com.vn (fills empty fields only) |

## How the frontend uses the CMS

Pages are server-rendered on request and read content through the Payload Local API with public
access rules. If the database is not configured or a collection is still empty, each section
falls back to the original static text and placeholders, so the layout and design stay the same.
CMS-driven areas: home (slogan, tagline, philosophy quote, expertise cards, contact details),
About pages (general info, org chart drawn as a tree from the Organization collection, consultants),
expertise pages (description, related projects), projects (lists by status + detail pages
`/[lang]/projects/<slug>`), insights & publications (lists + detail pages `/[lang]/insights/<slug>`),
partners (only those marked *approved for public display*) and contact (address, e-mail, two phones, Facebook).

## Known notes

- `npm audit` still reports advisories in transitive Payload dependencies (`happy-dom` via
  `@lexical/headless`, and `drizzle-kit`/`esbuild` dev tooling). They are not reachable from the
  public site; upgrade Payload when fixed releases are available. **Do not run
  `npm audit fix --force`** — it would downgrade Payload packages.
- Photos are illustrative Unsplash images (hot-linked from images.unsplash.com, URLs in
  `app/(frontend)/glass-shell.tsx`). Replace them with VeraLeaf photos, or attach images to
  expertise/projects/insights in the CMS (CMS images take priority).
- A backup of the pre-CMS v0.2 source is in `..\veraleaf-website-starter.backup-pre-cms`.
