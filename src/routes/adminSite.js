const express = require('express');
const { requireAuth } = require('../auth');
const { getMergedSite, upsertSection, DEFAULT_SITE_SECTIONS } = require('../siteRepo');
const { getSetting, setSetting, isValidEmail, FORMS_KEY } = require('../appSettings');

const router = express.Router();

router.use(requireAuth);

router.get('/site', async (req, res) => {
  try {
    const payload = await getMergedSite();
    return res.json(payload);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return res.status(500).json({ message: 'Failed to load site content' });
  }
});

router.put('/site/:sectionKey', async (req, res) => {
  const sectionKey = String(req.params.sectionKey || '').trim();
  const patch = req.body && req.body.data !== undefined ? req.body.data : req.body;

  try {
    const merged = await upsertSection(sectionKey, patch);
    return res.json({ sectionKey, data: merged });
  } catch (e) {
    if (e.code === 'UNKNOWN_KEY') {
      return res.status(400).json({ message: `Unknown section key: ${sectionKey}` });
    }
    if (e.code === 'INVALID_DATA') {
      return res.status(400).json({ message: e.message || 'Invalid data' });
    }
    // eslint-disable-next-line no-console
    console.error(e);
    return res.status(500).json({ message: 'Failed to save section' });
  }
});

router.get('/site-meta/keys', (req, res) => {
  return res.json({ keys: Object.keys(DEFAULT_SITE_SECTIONS) });
});

router.get('/app-settings', async (req, res) => {
  try {
    const formsAdminEmail = (await getSetting(FORMS_KEY)).trim();
    return res.json({ formsAdminEmail });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return res.status(500).json({ message: 'Failed to load settings' });
  }
});

router.put('/app-settings', async (req, res) => {
  const email = String((req.body && req.body.formsAdminEmail) || '')
    .trim()
    .toLowerCase();
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ message: 'Please provide a valid formsAdminEmail address.' });
  }
  try {
    await setSetting(FORMS_KEY, email);
    return res.json({ ok: true, formsAdminEmail: email });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return res.status(500).json({ message: 'Failed to save settings' });
  }
});

module.exports = router;
