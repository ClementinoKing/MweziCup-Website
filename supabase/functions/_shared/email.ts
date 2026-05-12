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
  <title>Mwezi Invitation</title>
</head>
<body style="margin:0;padding:0;">
  <div style="margin:0;padding:0;background:#fde5ea;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:620px;margin:0 auto;padding:40px 20px;">
      <div style="text-align:center;margin-bottom:28px;">
        <img src="${logoUrl}" alt="Mwezi" style="height:54px;object-fit:contain;"/>
      </div>
      <div style="background:#fff7f9;border-radius:28px;padding:38px 32px;text-align:center;border:1px solid #f8c8d3;">
        <div style="display:inline-block;background:#fde5ea;color:#dc1e3d;padding:8px 16px;border-radius:999px;font-size:13px;font-weight:700;margin-bottom:22px;">
          Exclusive Invitation
        </div>
        <h1 style="margin:0 0 16px;color:#321018;font-size:34px;line-height:1.15;font-weight:800;">
          You've been invited to join Mwezi
        </h1>
        <p style="margin:0 auto 18px;color:#8b5b67;font-size:16px;line-height:1.7;max-width:470px;">
          Hello ${name}, you've been invited to access the Mwezi platform. Sign in below with your temporary password to activate your account and set a new password.
        </p>
        <div style="margin:0 auto 28px;max-width:470px;background:#fff;border:1px solid #f8c8d3;border-radius:20px;padding:18px 20px;text-align:left;">
          <div style="font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#dc1e3d;margin-bottom:8px;">
            TEMPORARY PASSWORD
          </div>
          <div style="font-size:16px;font-weight:700;color:#321018;word-break:break-word;">
            ${temporaryPassword}
          </div>
          <div style="margin-top:10px;font-size:13px;line-height:1.6;color:#9b7280;">
            This password is temporary and will be replaced the first time you sign in.
          </div>
        </div>
        <a href="${loginUrl}" style="display:inline-block;background:#dc1e3d;color:#ffffff;text-decoration:none;padding:15px 34px;border-radius:999px;font-size:16px;font-weight:700;box-shadow:0 10px 24px rgba(220,30,61,0.25);">
          Accept Invitation
        </a>
        <p style="margin:28px auto 0;color:#9b7280;font-size:13px;line-height:1.6;max-width:430px;">
          This invitation link is secure and may expire after a limited time.
        </p>
      </div>
      <div style="margin-top:24px;text-align:center;color:#9b7280;font-size:13px;">
        © Mwezi. Period freedom that moves with you.
      </div>
    </div>
  </div>
</body>
</html>`;
}