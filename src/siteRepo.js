const { query } = require('./db');
const { DEFAULT_SITE_SECTIONS } = require('./defaultSiteContent');

function deepMerge(base, patch) {
  if (patch === null || patch === undefined) return base;
  if (Array.isArray(patch)) return patch;
  if (typeof patch !== 'object') return patch;
  if (typeof base !== 'object' || base === null || Array.isArray(base)) return patch;
  const out = { ...base };
  for (const k of Object.keys(patch)) {
    out[k] = deepMerge(base[k], patch[k]);
  }
  return out;
}

async function seedMissingSections() {
  const entries = Object.entries(DEFAULT_SITE_SECTIONS);
  for (const [sectionKey, data] of entries) {
    await query(
      `insert into site_sections(section_key, data)
       values ($1, $2::jsonb)
       on conflict (section_key) do nothing`,
      [sectionKey, JSON.stringify(data)]
    );
  }
}

async function listSectionRows() {
  const res = await query(
    'select section_key, data, updated_at from site_sections order by section_key asc'
  );
  return res.rows;
}

async function getMergedSite() {
  const rows = await listSectionRows();
  const fromDb = {};
  for (const row of rows) {
    fromDb[row.section_key] = row.data;
  }

  const sections = {};
  for (const key of Object.keys(DEFAULT_SITE_SECTIONS)) {
    const def = DEFAULT_SITE_SECTIONS[key];
    const patch = fromDb[key];
    sections[key] = patch ? deepMerge(def, patch) : def;
  }
  return { sections, keys: Object.keys(DEFAULT_SITE_SECTIONS) };
}

async function upsertSection(sectionKey, data) {
  if (!DEFAULT_SITE_SECTIONS[sectionKey]) {
    const err = new Error('Unknown section key');
    err.code = 'UNKNOWN_KEY';
    throw err;
  }
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    const err = new Error('Body must be a JSON object');
    err.code = 'INVALID_DATA';
    throw err;
  }

  const merged = deepMerge(DEFAULT_SITE_SECTIONS[sectionKey], data);

  await query(
    `insert into site_sections(section_key, data, updated_at)
     values ($1, $2::jsonb, now())
     on conflict (section_key)
     do update set data = excluded.data, updated_at = now()`,
    [sectionKey, JSON.stringify(merged)]
  );

  return merged;
}

module.exports = {
  seedMissingSections,
  getMergedSite,
  upsertSection,
  listSectionRows,
  DEFAULT_SITE_SECTIONS
};
