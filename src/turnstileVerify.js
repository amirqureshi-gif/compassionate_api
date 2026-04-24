/**
 * Cloudflare Turnstile server-side verify.
 * @param {string} token
 * @param {string} [remoteip]
 */
async function verifyTurnstileToken(token, remoteip) {
  const secret = (process.env.TURNSTILE_SECRET_KEY || '').trim();
  if (!secret) return { ok: true, skipped: true };
  if (!token || typeof token !== 'string') {
    return { ok: false, error: 'Missing security check' };
  }
  const body = new URLSearchParams();
  body.set('secret', secret);
  body.set('response', token);
  if (remoteip) body.set('remoteip', remoteip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body
  });
  const data = await res.json().catch(() => ({}));
  if (data && data.success) return { ok: true, skipped: false };
  return { ok: false, error: 'Security check failed. Please refresh the page and try again.' };
}

module.exports = { verifyTurnstileToken };
