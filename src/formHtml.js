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
  return `<a href="${u}">${u}</a>`;
}

function rowsFromObject(obj) {
  return Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== null && String(v) !== '')
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 10px;border:1px solid #e5e7eb;font-weight:600;">${escapeHtml(
          k
        )}</td><td style="padding:6px 10px;border:1px solid #e5e7eb;">${escapeHtml(
          String(v)
        )}</td></tr>`
    )
    .join('');
}

function adminTableHtml(title, data, imageUrls) {
  const body = rowsFromObject(data);
  const images =
    imageUrls && imageUrls.length
      ? `<p><strong>Image links</strong></p><ul>${imageUrls
          .map((u) => `<li>${linkOrDash(u)}</li>`)
          .join('')}</ul>`
      : '';
  return `
  <div style="font-family:system-ui,Segoe UI,sans-serif;font-size:14px;color:#111827;">
    <h2 style="margin:0 0 12px;">${escapeHtml(title)}</h2>
    <table style="border-collapse:collapse;">${body}</table>
    ${images}
  </div>`;
}

function userConfirmHtml(heading, lines) {
  const li = lines.map((t) => `<li>${escapeHtml(t)}</li>`).join('');
  return `
  <div style="font-family:system-ui,Segoe UI,sans-serif;font-size:15px;color:#111827;line-height:1.5;">
    <p style="margin:0 0 12px;"><strong>${escapeHtml(heading)}</strong></p>
    <p style="margin:0 0 12px;">We have received your submission. A copy of the details is below.</p>
    <ul style="margin:0;padding-left:20px;">${li}</ul>
    <p style="margin:16px 0 0;color:#6b7280;font-size:13px;">— Compassionate Alliance</p>
  </div>`;
}

module.exports = { escapeHtml, adminTableHtml, userConfirmHtml, linkOrDash };
