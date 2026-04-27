// Email notification service using nodemailer
// Sends event registration confirmations with QR code attachment
// If SMTP is not configured, warnings are logged and emails are silently skipped
const nodemailer = require('nodemailer');

// Build a transporter from environment variables.
// Returns null if SMTP is not yet configured (safe to skip).
function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // TLS on 465, STARTTLS otherwise
    auth: { user, pass },
  });
}

// Build the HTML body for an event registration confirmation email
function buildRegistrationHtml(user, event, registration) {
  const startDate = new Date(event.start_date).toLocaleString('en-PH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const endDate = event.end_date
    ? new Date(event.end_date).toLocaleString('en-PH', {
        hour: '2-digit',
        minute: '2-digit',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Registration Confirmed</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:#1d4ed8;padding:28px 32px;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;">MSC NU Laguna</h1>
              <p style="margin:4px 0 0;color:#bfdbfe;font-size:13px;">Microsoft Student Community</p>
              <p style="margin:0 0 24px;color:#475569;font-size:15px;">Hi ${user.fullName}, your spot is confirmed for:</p>

              <div style="background:#f8fafc;border-left:4px solid #1d4ed8;border-radius:4px;padding:16px 20px;margin-bottom:24px;">
                <p style="margin:0 0 6px;font-size:17px;font-weight:bold;color:#0f172a;">${event.title}</p>
                <p style="margin:0 0 4px;color:#475569;font-size:14px;">📅 ${startDate}${endDate ? ' – ' + endDate : ''}</p>
                <p style="margin:0 0 4px;color:#475569;font-size:14px;">📍 ${event.location}</p>
                ${event.type ? `<p style="margin:4px 0 0;color:#475569;font-size:14px;">🏷️ ${event.type}</p>` : ''}
              </div>

              <p style="margin:0 0 8px;color:#1e293b;font-size:15px;font-weight:600;">Your confirmation code</p>
              <p style="margin:0 0 24px;font-family:monospace;font-size:22px;letter-spacing:4px;color:#1d4ed8;font-weight:bold;">${registration.confirmationCode}</p>

              <p style="margin:0 0 12px;color:#1e293b;font-size:15px;font-weight:600;">QR Code for attendance check-in</p>
              <p style="margin:0 0 16px;color:#475569;font-size:14px;">
                Present this at the event entrance to mark your attendance.
              </p>
              <div style="text-align:center;margin-bottom:24px;">
                <img src="cid:qrcode" alt="Attendance QR Code" width="200" height="200"
                     style="border:1px solid #e2e8f0;border-radius:8px;" />
              </div>

              <p style="margin:0;color:#94a3b8;font-size:12px;">
                This QR code is unique to your registration and valid for 30 days.
                Do not share it with others.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:16px 32px;border-top:1px solid #e2e8f0;">
              <p style="margin:0;color:#94a3b8;font-size:12px;text-align:center;">
                MSC NU Laguna &mdash; National University Laguna &bull;
                This is an automated email, please do not reply.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// Send an event registration confirmation email with QR code attachment.
// Fire-and-forget safe: call with .catch() or use sendRegistrationConfirmationSafe().
async function sendRegistrationConfirmation(user, event, registration) {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn('[EMAIL] SMTP not configured — skipping registration confirmation for user', user.id);
    return;
  }

  // The qrCode stored in the DB/registration object is a signed JWT string.
  // The qrCodeDataUri returned from QRCode.toDataURL() is a base64 PNG data URI.
  // registration.qrCodeDataUri is the data URI; registration.qrCode is the raw JWT.
  const qrDataUri = registration.qrCodeDataUri || '';
  const base64Data = qrDataUri.startsWith('data:')
    ? qrDataUri.split(',')[1]
    : null;

  const attachments = [];
  if (base64Data) {
    attachments.push({
      filename: 'qrcode.png',
      content: Buffer.from(base64Data, 'base64'),
      contentType: 'image/png',
      cid: 'qrcode', // Referenced as src="cid:qrcode" in HTML
    });
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || '"MSC NU Laguna" <noreply@msc-laguna.edu.ph>',
    to: user.email,
    subject: `Registration Confirmed: ${event.title}`,
    html: buildRegistrationHtml(user, event, registration),
    attachments,
  });
}

// Fire-and-forget wrapper — never throws, logs errors only
function sendRegistrationConfirmationSafe(user, event, registration) {
  sendRegistrationConfirmation(user, event, registration).catch((err) => {
    console.error(
      `[EMAIL] Failed to send registration confirmation to ${user.email}: ${err.message}`
    );
  });
}

// ─────────────────────────────────────────────
// Welcome email — sent when admin creates a new account
// ─────────────────────────────────────────────

function buildWelcomeHtml(user, tempPassword) {
  const loginUrl = process.env.FRONTEND_URL
    ? `${process.env.FRONTEND_URL}/login`
    : 'http://localhost:3000/login';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Welcome to MSC NU Laguna</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:#1d4ed8;padding:28px 32px;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;">MSC NU Laguna</h1>
              <p style="margin:4px 0 0;color:#bfdbfe;font-size:13px;">Microsoft Student Community</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <h2 style="margin:0 0 8px;color:#1e293b;font-size:20px;">Welcome, ${user.fullName}! 👋</h2>
              <p style="margin:0 0 24px;color:#475569;font-size:15px;">
                Your MSC NU Laguna account has been created. Use the credentials below to log in for the first time.
                You will be asked to change your password immediately after signing in.
              </p>

              <div style="background:#f8fafc;border-radius:8px;padding:20px 24px;margin-bottom:24px;border:1px solid #e2e8f0;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="color:#64748b;font-size:13px;padding-bottom:10px;">EMAIL</td>
                    <td style="color:#0f172a;font-size:15px;font-weight:600;padding-bottom:10px;">${user.email}</td>
                  </tr>
                  <tr>
                    <td style="color:#64748b;font-size:13px;padding-bottom:10px;">TEMPORARY PASSWORD</td>
                    <td style="font-family:monospace;font-size:20px;font-weight:bold;color:#1d4ed8;letter-spacing:2px;padding-bottom:10px;">${tempPassword}</td>
                  </tr>
                  <tr>
                    <td style="color:#64748b;font-size:13px;">STUDENT ID</td>
                    <td style="color:#0f172a;font-size:15px;font-weight:600;">${user.studentId}</td>
                  </tr>
                </table>
              </div>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td align="center">
                    <a href="${loginUrl}"
                       style="display:inline-block;background:#1d4ed8;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:15px;font-weight:600;">
                      Sign In to MSC Portal
                    </a>
                  </td>
                </tr>
              </table>

              <div style="background:#fef9c3;border-left:4px solid #eab308;border-radius:4px;padding:14px 18px;margin-bottom:16px;">
                <p style="margin:0;color:#713f12;font-size:13px;">
                  ⚠️ <strong>Important:</strong> This temporary password expires after your first login.
                  Do not share it with anyone.
                </p>
              </div>

              <p style="margin:0;color:#94a3b8;font-size:12px;">
                If you did not expect this email, please contact your MSC administrator.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:16px 32px;border-top:1px solid #e2e8f0;">
              <p style="margin:0;color:#94a3b8;font-size:12px;text-align:center;">
                MSC NU Laguna &mdash; National University Laguna &bull;
                This is an automated email, please do not reply.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

async function sendWelcomeEmail(user, tempPassword) {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn('[EMAIL] SMTP not configured — skipping welcome email for user', user.id);
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || '"MSC NU Laguna" <noreply@msc-laguna.edu.ph>',
    to: user.email,
    subject: 'Welcome to MSC NU Laguna — Your Account is Ready',
    html: buildWelcomeHtml(user, tempPassword),
  });
}

// Fire-and-forget wrapper — never throws, logs errors only
function sendWelcomeEmailSafe(user, tempPassword) {
  sendWelcomeEmail(user, tempPassword).catch((err) => {
    console.error(
      `[EMAIL] Failed to send welcome email to ${user.email}: ${err.message}`
    );
  });
}

module.exports = {
  sendRegistrationConfirmation,
  sendRegistrationConfirmationSafe,
  sendWelcomeEmail,
  sendWelcomeEmailSafe,
};
