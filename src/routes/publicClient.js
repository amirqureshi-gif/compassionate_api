const express = require('express');

const router = express.Router();

/**
 * Public config for browser clients (no secrets). Site key is safe to expose.
 */
router.get('/client-config', (req, res) => {
  return res.json({
    turnstileSiteKey: (process.env.TURNSTILE_SITE_KEY || '').trim()
  });
});

module.exports = router;
