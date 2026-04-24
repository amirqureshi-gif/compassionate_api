const { Resend } = require('resend');

let resend;

function getResend() {
  if (!resend) {
    const key = (process.env.RESEND_API_KEY || '').trim();
    if (!key) return null;
    resend = new Resend(key);
  }
  return resend;
}

function getFrom() {
  return (process.env.EMAIL_FROM || 'Compassionate Alliance <onboarding@resend.dev>').trim();
}

/**
 * @returns {Promise<{ id?: string, error?: string }>}
 */
async function sendEmail({ to, subject, html, text }) {
  const client = getResend();
  if (!client) {
    return { error: 'Email is not configured (RESEND_API_KEY missing)' };
  }
  const toList = Array.isArray(to) ? to : [to];
  const { data, error } = await client.emails.send({
    from: getFrom(),
    to: toList,
    subject: String(subject).slice(0, 998),
    html: html || undefined,
    text: text || undefined
  });
  if (error) {
    return { error: error.message || 'Email send failed' };
  }
  return { id: data && data.id };
}

function isMailConfigured() {
  return Boolean((process.env.RESEND_API_KEY || '').trim());
}

module.exports = { sendEmail, getResend, getFrom, isMailConfigured };
