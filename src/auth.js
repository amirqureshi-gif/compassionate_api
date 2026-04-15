const jwt = require('jsonwebtoken');

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

function signToken(admin) {
  const secret = requireEnv('JWT_SECRET');
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(
    { sub: String(admin.id), email: admin.email, role: 'admin' },
    secret,
    { expiresIn }
  );
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [, token] = header.split(' ');
  if (!token) return res.status(401).json({ message: 'Missing token' });

  try {
    const secret = requireEnv('JWT_SECRET');
    const payload = jwt.verify(token, secret);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = { signToken, requireAuth };

