const express = require('express');
const { getMergedSite } = require('../siteRepo');

const router = express.Router();

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

module.exports = router;
