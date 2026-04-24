const { query } = require('./db');

const FORMS_KEY = 'forms_admin_email';

async function getSetting(key) {
  const { rows } = await query('select value from app_settings where key = $1', [key]);
  return rows[0] ? String(rows[0].value) : '';
}

async function setSetting(key, value) {
  const v = value === null || value === undefined ? '' : String(value);
  await query(
    `
    insert into app_settings (key, value, updated_at)
    values ($1, $2, now())
    on conflict (key) do update set value = excluded.value, updated_at = now()
    `,
    [key, v]
  );
}

/**
 * Inbox for form notification emails. DB wins; else FORMS_ADMIN_EMAIL; else bootstrap ADMIN_EMAIL.
 */
async function getFormsAdminEmail() {
  const fromDb = (await getSetting(FORMS_KEY)).trim();
  if (fromDb) return fromDb;
  const env = (process.env.FORMS_ADMIN_EMAIL || process.env.ADMIN_EMAIL || '').trim();
  return env || '';
}

function isValidEmail(s) {
  if (!s || typeof s !== 'string') return false;
  const t = s.trim();
  if (t.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t);
}

module.exports = {
  getSetting,
  setSetting,
  getFormsAdminEmail,
  isValidEmail,
  FORMS_KEY
};
