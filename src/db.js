const { Pool } = require('pg');

let pool;

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

function getPool() {
  if (pool) return pool;
  const connectionString = requireEnv('DATABASE_URL');
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
}

module.exports = { query, ensureSchema };
