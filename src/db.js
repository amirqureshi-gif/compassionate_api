const { Pool } = require('pg');

let pool;

function buildConnectionStringFromParts() {
  const user = process.env.PGUSER || process.env.POSTGRES_USER || '';
  const password = process.env.PGPASSWORD || process.env.POSTGRES_PASSWORD || '';
  const host = process.env.PGHOST || process.env.POSTGRES_HOST || '';
  const port = process.env.PGPORT || process.env.POSTGRES_PORT || '';
  const database = process.env.PGDATABASE || process.env.POSTGRES_DB || '';

  if (!user || !password || !host || !port || !database) return '';

  return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(
    password
  )}@${host}:${port}/${database}`;
}

function getConnectionString() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRESQL_URL ||
    buildConnectionStringFromParts()
  );
}

function getPool() {
  if (pool) return pool;
  const connectionString = getConnectionString();
  if (!connectionString) {
    const present = [
      'DATABASE_URL',
      'POSTGRES_URL',
      'POSTGRESQL_URL',
      'PGHOST',
      'PGPORT',
      'PGDATABASE',
      'PGUSER',
      'PGPASSWORD'
    ].filter((k) => Boolean(process.env[k]));

    throw new Error(
      `Missing database connection env. Set DATABASE_URL (recommended). Present: ${
        present.length ? present.join(', ') : '(none)'
      }`
    );
  }

  pool = new Pool({
    connectionString,
    ssl:
      process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : undefined
  });
  return pool;
}

async function query(text, params) {
  return await getPool().query(text, params);
}

async function ensureSchema() {
  await query(`
    create table if not exists admins (
      id bigserial primary key,
      email text unique not null,
      password_hash text not null,
      created_at timestamptz not null default now()
    );
  `);

  await query(`
    create table if not exists site_sections (
      section_key text primary key,
      data jsonb not null default '{}'::jsonb,
      updated_at timestamptz not null default now()
    );
  `);

  await query(`
    create table if not exists app_settings (
      key text primary key,
      value text not null default '',
      updated_at timestamptz not null default now()
    );
  `);

  await query(`
    create table if not exists form_submissions (
      id bigserial primary key,
      form_type text not null,
      submitter_email text,
      payload jsonb not null default '{}'::jsonb,
      image_urls jsonb not null default '[]'::jsonb,
      client_ip text,
      created_at timestamptz not null default now()
    );
  `);

  await query(`
    create index if not exists form_submissions_type_created_at_idx
    on form_submissions (form_type, created_at desc);
  `);
}

module.exports = { query, ensureSchema };
