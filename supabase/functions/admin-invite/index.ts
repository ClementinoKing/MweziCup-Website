const TEMP_ADMIN_PASSWORD = '12345678';
const SITE_KEY = 'default';
const DEFAULT_LOGO_URL =
  'https://pbvvkwnbcbxzqkikcoic.supabase.co/storage/v1/object/public/img/Mwezi%20Cup%20logo.png';

type InviteAdminBody = {
  siteKey?: string;
  name?: string;
  email?: string;
  role?: 'Super Admin' | 'Editor' | 'Viewer';
};

type AuthenticatedUser = {
  id: string;
  email: string;
  user_metadata: Record<string, unknown>;
};

type AdminRole = 'super_admin' | 'editor' | 'viewer';

function json(payload: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, content-type, apikey, x-client-info',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
  });
}

function getSupabaseUrl() {
  const url = Deno.env.get('SUPABASE_URL');
  if (!url) throw new Error('Missing SUPABASE_URL');
  return url;
}

function getAnonKey() {
  const key = Deno.env.get('SUPABASE_ANON_KEY');
  if (!key) throw new Error('Missing SUPABASE_ANON_KEY');
  return key;
}

function getServiceRoleKey() {
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!key) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
  return key;
}

function authHeaders(token: string, additionalHeaders: HeadersInit = {}): HeadersInit {
  return {
    apikey: token,
    Authorization: `Bearer ${token}`,
    ...additionalHeaders,
  };
}

async function requestJson<T>(
  path: string,
  init: RequestInit & { token: string; query?: Record<string, string | undefined> },
): Promise<{ data: T | null; error: string | null }> {
  const url = new URL(`${getSupabaseUrl()}${path}`);
  for (const [key, value] of Object.entries(init.query ?? {})) {
    if (value !== undefined && value !== '') {
      url.searchParams.set(key, value);
    }
  }

  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...authHeaders(init.token, init.headers ?? {}),
    },
  });

  const text = await response.text();
  if (!response.ok) {
    let message = text || `Request failed with status ${response.status}`;
    try {
      const parsed = JSON.parse(text) as { message?: unknown; error?: unknown };
      message =
        typeof parsed.message === 'string'
          ? parsed.message
          : typeof parsed.error === 'string'
            ? parsed.error
            : message;
    } catch {
      // Keep the raw response text.
    }

    return { data: null, error: message };
  }

  if (!text) {
    return { data: null, error: null };
  }

  try {
    return { data: JSON.parse(text) as T, error: null };
  } catch {
    return { data: null, error: null };
  }
}

async function getAuthenticatedUser(request: Request): Promise<AuthenticatedUser> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    throw new Error('Missing authorization header');
  }

  const response = await fetch(`${getSupabaseUrl()}/auth/v1/user`, {
    headers: {
      apikey: getAnonKey(),
      Authorization: authHeader,
      Accept: 'application/json',
    },
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(text || 'Unable to verify user');
  }

  const data = JSON.parse(text) as {
    id: string;
    email?: string | null;
    user_metadata?: Record<string, unknown> | null;
  };

  return {
    id: data.id,
    email: data.email ?? '',
    user_metadata: data.user_metadata ?? {},
  };
}

function normalizeRole(role?: string): AdminRole {
  if (role === 'Super Admin') return 'super_admin';
  if (role === 'Editor') return 'editor';
  return 'viewer';
}

function denormalizeRole(role: AdminRole) {
  if (role === 'super_admin') return 'Super Admin';
  if (role === 'editor') return 'Editor';
  return 'Viewer';
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function getAdminLoginUrl(): string {
  const explicitLoginUrl = Deno.env.get('ADMIN_LOGIN_URL');
  if (explicitLoginUrl) {
    return explicitLoginUrl;
  }

  const appUrl = Deno.env.get('ADMIN_APP_URL') ?? Deno.env.get('APP_URL') ?? 'https://mwezicup.com';
  return new URL('/admin/login', appUrl).toString();
}

function buildAdminInviteEmailHtml(input: {
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

async function sendTransactionalEmail(input: { to: string; subject: string; html: string }) {
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

async function findAuthUserByEmail(email: string): Promise<AuthenticatedUser | null> {
  const serviceRole = getServiceRoleKey();
  const pageSize = 200;

  for (let page = 1; page <= 10; page += 1) {
    const result = await requestJson<{
      users: Array<{
        id: string;
        email?: string | null;
        user_metadata?: Record<string, unknown> | null;
      }>;
    }>('/auth/v1/admin/users', {
      method: 'GET',
      token: serviceRole,
      query: {
        page: String(page),
        per_page: String(pageSize),
      },
    });

    if (result.error) {
      throw new Error(result.error);
    }

    const users = result.data?.users ?? [];
    const match = users.find((user) => (user.email ?? '').toLowerCase() === email.toLowerCase());

    if (match) {
      return {
        id: match.id,
        email: match.email ?? email,
        user_metadata: match.user_metadata ?? {},
      };
    }

    if (users.length < pageSize) {
      break;
    }
  }

  return null;
}

async function createAuthUser(input: {
  email: string;
  password: string;
  userMetadata: Record<string, unknown>;
}) {
  const serviceRole = getServiceRoleKey();
  const result = await requestJson<{ user?: { id: string } } & { id?: string }>('/auth/v1/admin/users', {
    method: 'POST',
    token: serviceRole,
    body: JSON.stringify({
      email: input.email,
      password: input.password,
      email_confirm: true,
      user_metadata: input.userMetadata,
    }),
  });

  if (result.error) {
    throw new Error(result.error);
  }

  const user = result.data?.user ?? (result.data?.id ? { id: result.data.id } : null);
  if (!user) {
    throw new Error('Failed to create auth user');
  }

  return user.id;
}

async function updateAuthUserById(
  userId: string,
  attributes: { password?: string; user_metadata?: Record<string, unknown> },
) {
  const serviceRole = getServiceRoleKey();
  const result = await requestJson<{ user?: { id: string } } & { id?: string }>(
    `/auth/v1/admin/users/${userId}`,
    {
      method: 'PUT',
      token: serviceRole,
      body: JSON.stringify(attributes),
    },
  );

  if (result.error) {
    throw new Error(result.error);
  }

  const user = result.data?.user ?? (result.data?.id ? { id: result.data.id } : null);
  if (!user) {
    throw new Error('Failed to update auth user');
  }

  return user.id;
}

async function getAdminUserByUserId(userId: string) {
  const serviceRole = getServiceRoleKey();
  const result = await requestJson<Array<{
    id: string;
    user_id: string;
    display_name: string;
    email: string;
    role: AdminRole;
    status: 'active' | 'invited' | 'disabled';
    deleted_at: string | null;
  }>>('/rest/v1/admin_users', {
    method: 'GET',
    token: serviceRole,
    query: {
      select: 'id,user_id,display_name,email,role,status,deleted_at',
      site_key: `eq.${SITE_KEY}`,
      user_id: `eq.${userId}`,
      deleted_at: 'is.null',
    },
  });

  if (result.error) {
    throw new Error(result.error);
  }

  return result.data?.[0] ?? null;
}

async function requireSuperAdmin(userId: string) {
  const row = await getAdminUserByUserId(userId);
  if (!row) {
    throw new Error('Admin profile not found');
  }

  if (row.status !== 'active' || row.role !== 'super_admin') {
    throw new Error('Forbidden');
  }

  return row;
}

async function upsertDbRow<T>(table: string, payload: Record<string, unknown>, onConflict: string) {
  const serviceRole = getServiceRoleKey();
  const result = await requestJson<T>(`/rest/v1/${table}`, {
    method: 'POST',
    token: serviceRole,
    query: { on_conflict: onConflict },
    headers: {
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify(payload),
  });

  if (result.error) {
    throw new Error(result.error);
  }

  return result.data;
}

async function insertDbRow(table: string, payload: Record<string, unknown>) {
  const serviceRole = getServiceRoleKey();
  const result = await requestJson<unknown>(`/rest/v1/${table}`, {
    method: 'POST',
    token: serviceRole,
    headers: {
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(payload),
  });

  if (result.error) {
    throw new Error(result.error);
  }
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return json({ ok: true });
  }

  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  try {
    const caller = await getAuthenticatedUser(request);
    await requireSuperAdmin(caller.id);

    const body = (await request.json()) as InviteAdminBody;
    const siteKey = body.siteKey ?? SITE_KEY;
    if (siteKey !== SITE_KEY) {
      return json({ error: 'Unsupported site key' }, 400);
    }

    const name = (body.name ?? '').trim();
    const email = (body.email ?? '').trim().toLowerCase();
    const role = normalizeRole(body.role);

    if (!name || !email) {
      return json({ error: 'Name and email are required' }, 400);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: 'Invalid email address' }, 400);
    }

    const existingAuthUser = await findAuthUserByEmail(email);
    const userMetadata = {
      full_name: name,
      force_password_change: true,
      admin_role: denormalizeRole(role),
    };

    let authUserId = existingAuthUser?.id ?? null;
    if (existingAuthUser) {
      authUserId = await updateAuthUserById(existingAuthUser.id, {
        password: TEMP_ADMIN_PASSWORD,
        user_metadata: userMetadata,
      });
    } else {
      authUserId = await createAuthUser({
        email,
        password: TEMP_ADMIN_PASSWORD,
        userMetadata,
      });
    }

    const now = new Date().toISOString();
    const inviteToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    await upsertDbRow(
      'admin_users',
      {
        site_key: SITE_KEY,
        user_id: authUserId,
        display_name: name,
        email,
        role,
        status: 'invited',
        invited_by: caller.id,
        last_login_at: null,
        deleted_at: null,
      },
      'site_key,email',
    );

    await upsertDbRow(
      'admin_invitations',
      {
        site_key: SITE_KEY,
        email,
        role,
        status: 'pending',
        invite_token: inviteToken,
        expires_at: expiresAt,
        sent_at: null,
        accepted_at: null,
        accepted_user_id: null,
        invited_by: caller.id,
        deleted_at: null,
      },
      'site_key,email',
    );

    const loginUrl = getAdminLoginUrl();
    const html = buildAdminInviteEmailHtml({
      name,
      loginUrl,
      temporaryPassword: TEMP_ADMIN_PASSWORD,
    });

    await sendTransactionalEmail({
      to: email,
      subject: 'Your Mwezi admin invitation',
      html,
    });

    await upsertDbRow(
      'admin_invitations',
      {
        site_key: SITE_KEY,
        email,
        role,
        status: 'sent',
        invite_token: inviteToken,
        expires_at: expiresAt,
        sent_at: now,
        accepted_at: null,
        accepted_user_id: null,
        invited_by: caller.id,
        deleted_at: null,
      },
      'site_key,email',
    );

    await insertDbRow('admin_activity_log', {
      site_key: SITE_KEY,
      kind: 'user',
      title: 'Admin invite sent',
      description: `${caller.email} invited ${email} as ${denormalizeRole(role)}.`,
      entity_type: 'admin_user',
      created_by: caller.id,
    });

    return json({
      success: true,
      message: 'Invitation sent',
      email,
      role: denormalizeRole(role),
      temporaryPassword: TEMP_ADMIN_PASSWORD,
      loginUrl,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    if (message === 'Forbidden') {
      return json({ error: 'Only super admins can send admin invitations' }, 403);
    }

    return json({ error: message }, 500);
  }
});
