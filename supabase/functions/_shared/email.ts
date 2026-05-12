const DEFAULT_LOGO_URL =
  'https://pbvvkwnbcbxzqkikcoic.supabase.co/storage/v1/object/public/img/Mwezi%20Cup%20logo.png';

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function buildAdminInviteEmailHtml(input: {
  name: string;
  loginUrl: string;
  temporaryPassword: string;
  logoUrl?: string;
}) {
  const name = escapeHtml(input.name);
  const loginUrl = escapeHtml(input.loginUrl);
  const temporaryPassword = escapeHtml(input.temporaryPassword);
  const logoUrl = escapeHtml(input.logoUrl ?? DEFAULT_LOGO_URL);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Mwezi Invite Email Preview</title>
</head>
<body style="margin:0;padding:0;background:#fde5ea;font-family:Arial,Helvetica,sans-serif;display:flex;justify-content:center;padding:40px 20px;">
  <div style="max-width:620px;width:100%;">
    <div style="text-align:center;margin-bottom:28px;">
      <img
        src="${logoUrl}"
        alt="Mwezi"
        style="height:54px;object-fit:contain;"
      />
    </div>

    <div style="background:#fff7f9;border-radius:28px;padding:42px 32px;text-align:center;border:1px solid #f8c8d3;box-shadow:0 20px 60px rgba(0,0,0,0.08);">
      <div style="display:inline-block;background:#fde5ea;color:#dc1e3d;padding:8px 16px;border-radius:999px;font-size:13px;font-weight:700;margin-bottom:22px;">
        Exclusive Invitation
      </div>

      <h1 style="margin:0 0 16px;color:#321018;font-size:34px;line-height:1.15;font-weight:800;">
        You&apos;ve been invited to join Mwezi
      </h1>

      <p style="margin:0 auto 18px;color:#8b5b67;font-size:16px;line-height:1.7;max-width:470px;">
        Hello ${name}, you&apos;ve been invited to access the Mwezi platform. Sign in below with your temporary password to activate your account and set a new password.
      </p>

      <div style="margin:0 auto 28px;max-width:470px;background:#fff;border:1px solid #f8c8d3;border-radius:20px;padding:18px 20px;text-align:left;">
        <div style="font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#dc1e3d;margin-bottom:8px;">Temporary password</div>
        <div style="font-size:16px;font-weight:700;color:#321018;word-break:break-word;">${temporaryPassword}</div>
        <div style="margin-top:10px;font-size:13px;line-height:1.6;color:#9b7280;">
          This password is temporary and will be replaced the first time you sign in.
        </div>
      </div>

      <a
        href="${loginUrl}"
        style="display:inline-block;background:#dc1e3d;color:#ffffff;text-decoration:none;padding:15px 36px;border-radius:999px;font-size:16px;font-weight:700;box-shadow:0 10px 24px rgba(220,30,61,0.25);"
      >
        Accept Invitation
      </a>

      <p style="margin:24px auto 0;color:#9b7280;font-size:13px;line-height:1.6;max-width:420px;">
        This invitation link is secure and may expire after a limited time.
      </p>
    </div>

    <div style="margin-top:24px;text-align:center;color:#9b7280;font-size:13px;line-height:1.6;">
      © Mwezi. Period freedom that moves with you.
    </div>
  </div>
</body>
</html>`;
}

export async function sendTransactionalEmail(input: {
  to: string;
  subject: string;
  html: string;
}) {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  const fromEmail = Deno.env.get('RESEND_FROM_EMAIL');
  const fromName = Deno.env.get('RESEND_FROM_NAME') ?? 'Mwezi';

  if (!apiKey || !fromEmail) {
    throw new Error('Missing RESEND_API_KEY or RESEND_FROM_EMAIL');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `${fromName} <${fromEmail}>`,
      to: [input.to],
      subject: input.subject,
      html: input.html,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to send email');
  }
}

export function getAdminLoginUrl(): string {
  const explicitLoginUrl = Deno.env.get('ADMIN_LOGIN_URL');
  if (explicitLoginUrl) {
    return explicitLoginUrl;
  }

  const appUrl = Deno.env.get('ADMIN_APP_URL') ?? Deno.env.get('APP_URL') ?? 'http://localhost:5173';
  return new URL('/admin/login', appUrl).toString();
}

