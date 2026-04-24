function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function linkOrDash(url) {
  if (!url) return '—';
  const u = escapeHtml(url);
  return `<a href="${u}" style="color:#15803d;text-decoration:underline;">${u}</a>`;
}

function rowsFromObject(obj) {
  return Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== null && String(v) !== '')
    .map(
      ([k, v]) =>
        `<tr><td style="padding:10px 12px;border-top:1px solid #e5e7eb;font-weight:700;color:#111827;width:220px;">${escapeHtml(
          k
        )}</td><td style="padding:10px 12px;border-top:1px solid #e5e7eb;color:#111827;">${escapeHtml(
          String(v)
        )}</td></tr>`
    )
    .join('');
}

function wrapEmailPage({ preheader, title, subtitle, bodyHtml }) {
  const ph = preheader ? escapeHtml(preheader) : '';
  const t = title ? escapeHtml(title) : '';
  const sub = subtitle ? escapeHtml(subtitle) : '';
  const logoUrl = String(process.env.EMAIL_LOGO_URL || '').trim();
  const safeLogoUrl = logoUrl ? escapeHtml(logoUrl) : '';

  return `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${t}</title>
    </head>
    <body style="margin:0;background:#f3f4f6;">
      <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${ph}</div>
      <div style="padding:28px 16px;">
        <div style="max-width:680px;margin:0 auto;">
          <div style="background:#0b1220;border-radius:14px;padding:14px 16px;margin-bottom:14px;">
            ${
              safeLogoUrl
                ? `<div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
                    <img src="${safeLogoUrl}" alt="Compassionate Alliance" height="36" style="display:block;height:36px;width:auto;border-radius:10px;" />
                    <div style="font-family:system-ui,Segoe UI,sans-serif;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#86efac;font-weight:700;">
                      Compassionate Alliance
                    </div>
                  </div>`
                : `<div style="font-family:system-ui,Segoe UI,sans-serif;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#86efac;font-weight:700;">
                    Compassionate Alliance
                  </div>`
            }
            <div style="font-family:system-ui,Segoe UI,sans-serif;font-size:18px;color:#eaf0ff;font-weight:800;margin-top:6px;">
              ${t}
            </div>
            ${
              sub
                ? `<div style="font-family:system-ui,Segoe UI,sans-serif;font-size:13px;color:rgba(234,240,255,0.72);margin-top:4px;line-height:1.5;">${sub}</div>`
                : ''
            }
          </div>

          <div style="background:#ffffff;border-radius:14px;border:1px solid #e5e7eb;box-shadow:0 10px 28px rgba(0,0,0,0.08);padding:18px 18px 14px;">
            ${bodyHtml}
          </div>

          <div style="max-width:680px;margin:12px auto 0;font-family:system-ui,Segoe UI,sans-serif;font-size:12px;color:#6b7280;line-height:1.5;">
            <div>Do not reply to this email. This inbox is not monitored.</div>
            <div style="margin-top:6px;">If you need help, contact the office numbers listed on the website.</div>
          </div>
        </div>
      </div>
    </body>
  </html>`;
}

function adminTableHtml(title, data, imageUrls) {
  const body = rowsFromObject(data);
  const images =
    imageUrls && imageUrls.length
      ? `<div style="margin-top:14px;">
          <div style="font-weight:800;color:#111827;margin:0 0 8px;">Image links</div>
          <ul style="margin:0;padding-left:18px;line-height:1.6;">${imageUrls
            .map((u) => `<li style="margin:6px 0;">${linkOrDash(u)}</li>`)
            .join('')}</ul>
        </div>`
      : '';

  const inner = `
    <div style="font-family:system-ui,Segoe UI,sans-serif;color:#111827;">
      <div style="font-size:14px;line-height:1.5;color:#374151;margin-bottom:12px;">
        A new submission was received. Details are below.
      </div>
      <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
        <tbody>${body}</tbody>
      </table>
      ${images}
    </div>
  `;

  return wrapEmailPage({
    preheader: `New form submission: ${title}`,
    title,
    subtitle: 'Admin notification',
    bodyHtml: inner
  });
}

function userConfirmHtml(heading, lines) {
  const li = lines.map((t) => `<li>${escapeHtml(t)}</li>`).join('');

  const inner = `
    <div style="font-family:system-ui,Segoe UI,sans-serif;color:#111827;">
      <div style="font-size:14px;line-height:1.6;color:#374151;">
        We have received your submission. A copy of the details is below.
      </div>
      <div style="height:12px;"></div>
      <ul style="margin:0;padding-left:18px;line-height:1.7;font-size:14px;color:#111827;">${li}</ul>
      <div style="height:14px;"></div>
      <div style="padding:12px 12px;border-radius:12px;background:rgba(22,163,74,0.08);border:1px solid rgba(22,163,74,0.18);color:#14532d;font-size:13px;line-height:1.55;">
        Note: Please do not reply to this email. This inbox is not monitored.
      </div>
    </div>
  `;

  return wrapEmailPage({
    preheader: `Confirmation: ${heading}`,
    title: heading,
    subtitle: 'Submission confirmation',
    bodyHtml: inner
  });
}

module.exports = { escapeHtml, adminTableHtml, userConfirmHtml, linkOrDash };
