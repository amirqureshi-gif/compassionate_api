const express = require('express');
const bcrypt = require('bcryptjs');
const { query } = require('../db');
const { signToken, requireAuth } = require('../auth');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const result = await query('select id, email, password_hash from admins where email=$1', [
    String(email).toLowerCase()
  ]);

  const admin = result.rows[0];
  if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(String(password), admin.password_hash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const token = signToken(admin);
  return res.json({ token });
});

router.get('/me', requireAuth, async (req, res) => {
  const id = req.user && req.user.sub ? String(req.user.sub) : '';
  if (!id) return res.status(401).json({ message: 'Invalid token' });

  const result = await query('select id, email from admins where id=$1', [id]);
  const admin = result.rows[0];
  if (!admin) return res.status(401).json({ message: 'Invalid token' });

  return res.json(admin);
});

module.exports = router;

