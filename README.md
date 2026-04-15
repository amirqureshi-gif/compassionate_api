# Compassionate API

Backend API for CompassionateAlliance.

## Endpoints used by the admin panel

- `POST /auth/login` → `{ token }`
- `GET /auth/me` → `{ id, email }` (requires `Authorization: Bearer <token>`)

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

- `DATABASE_URL` (from Railway Postgres)
- `JWT_SECRET`
- `ALLOWED_ORIGINS` (comma-separated)
- `ADMIN_EMAIL` and `ADMIN_PASSWORD` (first deploy only; optional but recommended)

## Notes

This API auto-creates its tables on startup if they do not exist.

