# Compassionate API

Backend API for CompassionateAlliance.

## Endpoints

### Auth

- `POST /auth/login` → `{ token }`
- `GET /auth/me` → `{ id, email }` (requires `Authorization: Bearer <token>`)

### Public (main website)

- `GET /public/site` → `{ sections: { ... }, keys: [...] }` (merged defaults + database)
- `GET /public/client-config` → `{ turnstileSiteKey }` (public site key for Cloudflare Turnstile; safe to expose in the browser)
- `POST /public/forms/membership` — `multipart/form-data` (see API code for field names: images uploaded to Cloudinary; metadata stored in DB)
- `POST /public/forms/support` — JSON body
- `POST /public/forms/donation` — `multipart/form-data` (optional image file)

Form submissions are rate-limited per IP, use a honeypot and optional Turnstile, store rows in `form_submissions` with **image URLs only** (not binary), and send email via Resend to the user and the configured admin inbox.

### Admin (requires `Authorization: Bearer <token>`)

- `GET /admin/site` → same shape as public
- `PUT /admin/site/:sectionKey` → body: partial JSON object merged into defaults for that section; response `{ sectionKey, data }`
- `GET /admin/site-meta/keys` → `{ keys: [...] }`
- `GET /admin/app-settings` → `{ formsAdminEmail }` (inbox for form notifications)
- `PUT /admin/app-settings` — body: `{ "formsAdminEmail": "inbox@yourdomain.com" }`

## Local run

1. Install:

```bash
npm install
```

2. Create `.env`:

```bash
copy .env.example .env
```

3. Start:

```bash
npm run dev
```

## Railway variables (API service)

- Database connection (pick one):
  - `DATABASE_URL` (recommended; from Railway Postgres)
  - or Railway-style parts: `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`
- `JWT_SECRET`
- `ALLOWED_ORIGINS` (comma-separated; must include your main site origin, e.g. `https://compassionatealliance.live` and `https://www.compassionatealliance.live`, or form POSTs from the browser will be blocked by CORS)
- `ADMIN_EMAIL` and `ADMIN_PASSWORD` (first deploy only; optional but recommended)
- **Forms & email (required for live forms):** `RESEND_API_KEY`, `EMAIL_FROM`, `CLOUDINARY_URL`, and either `FORMS_ADMIN_EMAIL` or save the inbox in the admin **Settings** screen
- **Optional:** `TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` (strongly recommended in production)

## Notes

This API auto-creates its tables on startup if they do not exist.

### Tables

- `admins` — login accounts for the admin panel
- `site_sections` — one row per `section_key` with JSON `data` for the public website (seeded from defaults on first boot)
- `app_settings` — key/value (e.g. `forms_admin_email` for the inbox that receives all form notifications)
- `form_submissions` — each submission with `form_type`, `payload` jsonb, `image_urls` jsonb (https links only)

You do **not** need to run SQL migrations manually on Railway: deploy the API with `DATABASE_URL` set; on boot it runs `CREATE TABLE IF NOT EXISTS` and inserts default rows for each section.

### Railway checklist

1. Create a **PostgreSQL** plugin and copy `DATABASE_URL` into the **API** service variables.
2. Set `JWT_SECRET` (long random string), `ALLOWED_ORIGINS` (your public site + admin domains, comma-separated), and optional `ADMIN_EMAIL` / `ADMIN_PASSWORD` for the first admin.
3. Use the **public URL** of this API service as `REACT_APP_API_BASE_URL` on both the **main site** and **admin** frontend services, then **redeploy** those frontends so webpack embeds the variable.

