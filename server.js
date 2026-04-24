require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const { ensureSchema, query } = require('./src/db');
const { seedMissingSections } = require('./src/siteRepo');
const authRoutes = require('./src/routes/auth');
const healthRoutes = require('./src/routes/health');
const publicSiteRoutes = require('./src/routes/publicSite');
const publicClientRoutes = require('./src/routes/publicClient');
const publicFormsRoutes = require('./src/routes/publicForms');
const adminSiteRoutes = require('./src/routes/adminSite');
const bcrypt = require('bcryptjs');

const app = express();

app.set('trust proxy', 1);

app.disable('x-powered-by');
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  })
);

app.use(express.json({ limit: '1mb' }));

const formsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: Number(process.env.FORMS_RATE_LIMIT_MAX || 15),
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many form submissions from this network. Please try again later.' }
});

function normalizeOrigin(origin) {
  if (!origin) return '';
  try {
    return new URL(String(origin)).origin.toLowerCase();
  } catch {
    return String(origin).trim().replace(/\/+$/, '').toLowerCase();
  }
}

function expandWwwOrigins(origins) {
  const out = new Set();
  for (const raw of origins) {
    const o = normalizeOrigin(raw);
    if (!o) continue;
    out.add(o);
    try {
      const u = new URL(o);
      const host = u.hostname;
      if (host.startsWith('www.')) {
        const non = `${u.protocol}//${host.slice(4)}`;
        out.add(non);
      } else {
        const www = `${u.protocol}//www.${host}`;
        out.add(www);
      }
    } catch {
      // ignore non-url values
    }
  }
  return Array.from(out);
}

const allowedOriginsRaw = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const allowedOrigins = expandWwwOrigins(allowedOriginsRaw);

app.use(
  cors({
    origin: function (origin, cb) {
      if (!origin) return cb(null, true); // server-to-server or curl
      if (allowedOrigins.length === 0) return cb(null, true);
      const o = normalizeOrigin(origin);
      if (allowedOrigins.includes(o)) return cb(null, true);
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
app.use('/public', publicClientRoutes);
app.use('/public', publicSiteRoutes);
app.use('/public', formsLimiter, publicFormsRoutes);
app.use('/admin', adminSiteRoutes);

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
  await seedMissingSections();
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

