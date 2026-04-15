require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const { ensureSchema, query } = require('./src/db');
const authRoutes = require('./src/routes/auth');
const healthRoutes = require('./src/routes/health');
const bcrypt = require('bcryptjs');

const app = express();

app.disable('x-powered-by');
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  })
);

app.use(express.json({ limit: '1mb' }));

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: function (origin, cb) {
      if (!origin) return cb(null, true); // server-to-server or curl
      if (allowedOrigins.length === 0) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error('Not allowed by CORS'));
    },
    credentials: true
  })
);

app.get('/', (req, res) => {
  res.type('text/plain').send('Compassionate API is running');
});

app.use('/health', healthRoutes);
app.use('/auth', authRoutes);

async function ensureBootstrapAdmin() {
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = (process.env.ADMIN_PASSWORD || '').trim();
  if (!email || !password) return;

  const existing = await query('select id from admins where email=$1', [email]);
  if (existing.rows[0]) return;

  const passwordHash = await bcrypt.hash(password, 12);
  await query('insert into admins(email, password_hash) values($1, $2)', [
    email,
    passwordHash
  ]);
  console.log(`Bootstrapped admin user: ${email}`);
}

async function main() {
  await ensureSchema();
  await ensureBootstrapAdmin();

  const port = process.env.PORT ? Number(process.env.PORT) : 8080;
  app.listen(port, '0.0.0.0', () => {
    console.log(`API listening on port ${port}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

