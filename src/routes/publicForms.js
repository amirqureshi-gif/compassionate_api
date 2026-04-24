const express = require('express');
const multer = require('multer');

const { query } = require('../db');
const { getFormsAdminEmail, isValidEmail } = require('../appSettings');
const { sendEmail, isMailConfigured } = require('../mail');
const { uploadBuffer, isConfigured: isCloudinaryConfigured } = require('../cloudinaryUpload');
const { verifyTurnstileToken } = require('../turnstileVerify');
const { adminTableHtml, userConfirmHtml } = require('../formHtml');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 6, fieldSize: 2 * 1024 * 1024 }
});

function getClientIp(req) {
  const x = req.headers['x-forwarded-for'];
  if (x && typeof x === 'string') return x.split(',')[0].trim();
  if (Array.isArray(x) && x[0]) return String(x[0]).split(',')[0].trim();
  return req.ip || (req.socket && req.socket.remoteAddress) || '';
}

function clean(s, max) {
  if (s === null || s === undefined) return '';
  return String(s)
    .trim()
    .slice(0, max);
}

function bad(res, code, message) {
  return res.status(code).json({ message });
}

async function assertSpamFree(req) {
  const body = req.body || {};
  const hp = body.hp_website;
  if (hp !== undefined && hp !== null && String(hp).trim() !== '') {
    return { err: { status: 400, message: 'Invalid submission' } };
  }
  const ip = getClientIp(req);
  const token = body.turnstileToken || body['cf-turnstile-response'] || req.headers['cf-turnstile-token'];
  const v = await verifyTurnstileToken(String(token || ''), ip);
  if (!v.ok) return { err: { status: 400, message: v.error || 'Verification failed' } };
  return { ip };
}

async function requireServices(res, { needCloudinary }) {
  if (!isMailConfigured()) {
    bad(
      res,
      503,
      'Form email is not configured. Set RESEND_API_KEY on the API. See the API documentation.'
    );
    return null;
  }
  const adminEmail = (await getFormsAdminEmail()).trim();
  if (!adminEmail || !isValidEmail(adminEmail)) {
    bad(
      res,
      503,
      'Recipient inbox is not set. The site administrator must add a forms email in the admin Settings screen (or set FORMS_ADMIN_EMAIL on the API).'
    );
    return null;
  }
  if (needCloudinary && !isCloudinaryConfigured()) {
    bad(
      res,
      503,
      'File uploads are not configured. Set CLOUDINARY_URL on the API.'
    );
    return null;
  }
  return { adminEmail };
}

async function saveSubmission(formType, submitterEmail, payload, imageUrls, clientIp) {
  const payloadJson = JSON.stringify(payload || {});
  const imageUrlsJson = JSON.stringify(Array.isArray(imageUrls) ? imageUrls : []);
  const { rows } = await query(
    `insert into form_submissions (form_type, submitter_email, payload, image_urls, client_ip)
     values ($1, $2, $3::jsonb, $4::jsonb, $5) returning id`,
    [formType, submitterEmail, payloadJson, imageUrlsJson, clientIp]
  );
  return rows[0].id;
}

// ---- Membership (multipart) ----
const membershipUpload = upload.fields([
  { name: 'profile_image', maxCount: 1 },
  { name: 'cnic_image', maxCount: 1 },
  { name: 'contribution_slip', maxCount: 1 }
]);

router.post('/forms/membership', (req, res, next) => {
  membershipUpload(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'One or more files are too large (max 10 MB).' });
      }
      return next(err);
    }
    return next();
  });
}, async (req, res) => {
  const svc = await requireServices(res, { needCloudinary: true });
  if (!svc) return undefined;

  const pre = await assertSpamFree(req);
  if (pre.err) return bad(res, pre.err.status, pre.err.message);

  const b = req.body || {};
  const name = clean(b.name, 200);
  const fatherName = clean(b.father_name, 200);
  const designation = clean(b.designation, 200);
  const cnic = clean(b.cnic, 20);
  const phone = clean(b.phone, 40);
  const email = clean(b.email, 200);
  const monthlyContribution = clean(b.monthly_contribution, 40);
  if (!name || !fatherName || !designation || !cnic || !phone || !email || !monthlyContribution) {
    return bad(res, 400, 'Please fill in all required fields.');
  }
  if (!isValidEmail(email)) return bad(res, 400, 'Please enter a valid email address.');

  const f = req.files || {};
  const p = f.profile_image && f.profile_image[0];
  const c = f.cnic_image && f.cnic_image[0];
  const s = f.contribution_slip && f.contribution_slip[0];
  if (!p || !c || !s) {
    return bad(res, 400, 'Profile picture, CNIC image, and contribution slip are required.');
  }
  for (const file of [p, c, s]) {
    if (!file.mimetype || !String(file.mimetype).startsWith('image/')) {
      return bad(res, 400, 'All uploads must be image files.');
    }
  }

  const ip = (pre && pre.ip) || getClientIp(req);
  let profileUrl;
  let cnicUrl;
  let slipUrl;
  try {
    profileUrl = await uploadBuffer(p.buffer, p.originalname, 'cai/membership');
    cnicUrl = await uploadBuffer(c.buffer, c.originalname, 'cai/membership');
    slipUrl = await uploadBuffer(s.buffer, s.originalname, 'cai/membership');
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('cloudinary', e);
    return bad(res, 500, 'Could not upload one or more images. Please try again in a few minutes.');
  }

  const imageUrls = [profileUrl, cnicUrl, slipUrl];
  const payload = {
    name,
    father_name: fatherName,
    designation,
    cnic,
    phone,
    email,
    monthly_contribution: monthlyContribution
  };
  const id = await saveSubmission('membership', email, payload, imageUrls, ip);

  const userSubject = 'We received your membership application — Compassionate Alliance';
  const adminSubject = `[Compassionate Alliance] New membership application: ${name}`;
  const userHtml = userConfirmHtml('Membership application', [
    `Name: ${name}`,
    `Email: ${email}`,
    'If anything looks wrong, reply to this message or contact the office numbers on the website.'
  ]);
  const adminHtml = adminTableHtml('New membership application', { ...payload, reference_id: id }, imageUrls);
  const adminTo = svc.adminEmail;

  const u = await sendEmail({ to: email, subject: userSubject, html: userHtml });
  if (u.error) {
    // eslint-disable-next-line no-console
    console.error('User email failed (membership)', u.error);
  }
  const a = await sendEmail({ to: adminTo, subject: adminSubject, html: adminHtml });
  if (a.error) {
    // eslint-disable-next-line no-console
    console.error('Admin email failed (membership)', a.error);
  }

  return res.status(201).json({
    ok: true,
    id: String(id),
    emailToUser: u.error ? 'delayed' : 'sent',
    emailToAdmin: a.error ? 'delayed' : 'sent'
  });
});

// ---- Support (json) ----
router.post('/forms/support', async (req, res) => {
  const svc = await requireServices(res, { needCloudinary: false });
  if (!svc) return undefined;

  const pre = await assertSpamFree(req);
  if (pre.err) return bad(res, pre.err.status, pre.err.message);

  const b = req.body || {};
  const name = clean(b.name, 200);
  const phone = clean(b.phone, 40);
  const em = clean(b.email, 200);
  const address = clean(b.address, 500);
  const relationship = clean(b.relationship, 120);
  const deceasedName = clean(b.deceased_name, 200);
  const dateOfDeath = clean(b.date_of_death, 32);
  const additionalInfo = clean(b.additional_info, 4000);
  if (!name || !phone || !em || !address || !relationship || !deceasedName || !dateOfDeath) {
    return bad(res, 400, 'Please fill in all required fields.');
  }
  if (!isValidEmail(em)) return bad(res, 400, 'Please enter a valid email address.');

  const ip = (pre && pre.ip) || getClientIp(req);
  const payload = {
    name,
    phone,
    email: em,
    address,
    relationship,
    deceased_name: deceasedName,
    date_of_death: dateOfDeath
  };
  if (additionalInfo) payload.additional_info = additionalInfo;

  const id = await saveSubmission('support', em, payload, [], ip);
  const userSubject = 'We received your support request — Compassionate Alliance';
  const adminSubject = `[Compassionate Alliance] New support request: ${name}`;
  const userHtml = userConfirmHtml('Support request', [
    `Name: ${name}`,
    `Email: ${em}`,
    'A team member will try to follow up with you as soon as possible using the contact details you provided.'
  ]);
  const adminHtml = adminTableHtml('New support request', { ...payload, reference_id: id }, []);

  const u = await sendEmail({ to: em, subject: userSubject, html: userHtml });
  if (u.error) {
    // eslint-disable-next-line no-console
    console.error('User email failed (support)', u.error);
  }
  const a = await sendEmail({ to: svc.adminEmail, subject: adminSubject, html: adminHtml });
  if (a.error) {
    // eslint-disable-next-line no-console
    console.error('Admin email failed (support)', a.error);
  }

  return res.status(201).json({
    ok: true,
    id: String(id),
    emailToUser: u.error ? 'delayed' : 'sent',
    emailToAdmin: a.error ? 'delayed' : 'sent'
  });
});

// ---- Donation (multipart, optional file) ----
const donationUpload = upload.fields([{ name: 'donation_slip', maxCount: 1 }]);
router.post('/forms/donation', (req, res, next) => {
  donationUpload(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File is too large (max 10 MB).' });
      }
      return next(err);
    }
    return next();
  });
}, async (req, res) => {
  const hasFile = Boolean(
    req.files && req.files.donation_slip && req.files.donation_slip[0]
  );
  const svc = await requireServices(res, { needCloudinary: hasFile });
  if (!svc) return undefined;

  const pre = await assertSpamFree(req);
  if (pre.err) return bad(res, pre.err.status, pre.err.message);

  const b = req.body || {};
  const name = clean(b.name, 200);
  const email = clean(b.email, 200);
  const phone = clean(b.phone, 40);
  const message = clean(b.message, 4000);
  if (!name || !email || !phone) {
    return bad(res, 400, 'Please fill in your name, email, and phone.');
  }
  if (!isValidEmail(email)) return bad(res, 400, 'Please enter a valid email address.');

  const ip = (pre && pre.ip) || getClientIp(req);
  const payload = { name, email, phone };
  if (message) payload.message = message;
  const imageUrls = [];
  if (hasFile) {
    const file = req.files.donation_slip[0];
    if (!file.mimetype || !String(file.mimetype).startsWith('image/')) {
      return bad(res, 400, 'The donation slip must be an image file.');
    }
    try {
      const url = await uploadBuffer(file.buffer, file.originalname, 'cai/donation');
      imageUrls.push(url);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('cloudinary donation', e);
      return bad(res, 500, 'Could not upload the image. Please try again in a few minutes.');
    }
  }
  const id = await saveSubmission('donation', email, payload, imageUrls, ip);
  const userSubject = 'We received your donation message — Compassionate Alliance';
  const adminSubject = `[Compassionate Alliance] New donation form: ${name}`;
  const userHtml = userConfirmHtml('Donation / receipt', [
    `Name: ${name}`,
    `Email: ${email}`,
    'Thank you for supporting the community. This message confirms that we have received your submission.',
    'If you attached a payment slip, our team can use the link on file; you do not need to resend the image in email unless asked.'
  ]);
  const adminHtml = adminTableHtml('New donation form', { ...payload, reference_id: id }, imageUrls);
  const u = await sendEmail({ to: email, subject: userSubject, html: userHtml });
  if (u.error) {
    // eslint-disable-next-line no-console
    console.error('User email failed (donation)', u.error);
  }
  const a = await sendEmail({ to: svc.adminEmail, subject: adminSubject, html: adminHtml });
  if (a.error) {
    // eslint-disable-next-line no-console
    console.error('Admin email failed (donation)', a.error);
  }
  return res.status(201).json({
    ok: true,
    id: String(id),
    emailToUser: u.error ? 'delayed' : 'sent',
    emailToAdmin: a.error ? 'delayed' : 'sent'
  });
});

module.exports = router;
