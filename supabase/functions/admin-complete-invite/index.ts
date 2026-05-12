const SITE_KEY = 'default';

type CompleteInviteBody = {
  siteKey?: string;
  newPassword?: string;
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

async function requireAdmin(userId: string) {
  const row = await getAdminUserByUserId(userId);
  if (!row) {
    throw new Error('Admin profile not found');
  }

  if (row.status !== 'active' && row.status !== 'invited') {
    throw new Error('Forbidden');
  }

  return row;
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

async function updateDbRows(
  table: string,
  query: Record<string, string | undefined>,
  payload: Record<string, unknown>,
): Promise<void> {
  const serviceRole = getServiceRoleKey();
  const result = await requestJson<unknown>(`/rest/v1/${table}`, {
    method: 'PATCH',
    token: serviceRole,
    query,
    headers: {
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(payload),
  });

  if (result.error) {
    throw new Error(result.error);
  }
}

async function insertDbRow(table: string, payload: Record<string, unknown>): Promise<void> {
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
    const adminUser = await requireAdmin(caller.id);

    const body = (await request.json()) as CompleteInviteBody;
    const siteKey = body.siteKey ?? SITE_KEY;
    if (siteKey !== SITE_KEY) {
      return json({ error: 'Unsupported site key' }, 400);
    }

    const newPassword = (body.newPassword ?? '').trim();
    if (newPassword.length < 8) {
      return json({ error: 'Password must be at least 8 characters long' }, 400);
    }

    if (adminUser.status !== 'invited' && caller.user_metadata.force_password_change !== true) {
      return json({ error: 'Password change is not required for this account' }, 400);
    }

    const metadata = {
      ...caller.user_metadata,
      force_password_change: false,
    };

    await updateAuthUserById(caller.id, {
      password: newPassword,
      user_metadata: metadata,
    });

    const now = new Date().toISOString();

    await updateDbRows(
      'admin_users',
      {
        site_key: `eq.${SITE_KEY}`,
        user_id: `eq.${caller.id}`,
      },
      {
        status: 'active',
        last_login_at: now,
      },
    );

    await updateDbRows(
      'admin_invitations',
      {
        site_key: `eq.${SITE_KEY}`,
        email: `eq.${caller.email}`,
      },
      {
        status: 'accepted',
        accepted_at: now,
        accepted_user_id: caller.id,
      },
    );

    await insertDbRow('admin_activity_log', {
      site_key: SITE_KEY,
      kind: 'update',
      title: 'Admin invite accepted',
      description: `${caller.email} completed the onboarding password change.`,
      entity_type: 'admin_user',
      created_by: caller.id,
    });

    return json({
      success: true,
      message: 'Password updated',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    if (message === 'Forbidden') {
      return json({ error: 'You do not have permission to complete this action' }, 403);
    }

    return json({ error: message }, 500);
  }
});
