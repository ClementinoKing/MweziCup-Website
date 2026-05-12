const SITE_KEY = 'default';

export type AdminRole = 'super_admin' | 'editor' | 'viewer';
export type AdminStatus = 'active' | 'invited' | 'disabled';

export type AuthenticatedUser = {
  id: string;
  email: string;
  user_metadata: Record<string, unknown>;
};

type AdminUserRow = {
  id: string;
  user_id: string;
  display_name: string;
  email: string;
  role: AdminRole;
  status: AdminStatus;
  deleted_at: string | null;
};

type DbResponse<T> = {
  data: T | null;
  error: string | null;
  response?: Response;
};

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
): Promise<DbResponse<T>> {
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
  let data: T | null = null;

  if (text) {
    try {
      data = JSON.parse(text) as T;
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    return {
      data: null,
      error:
        typeof data === 'object' && data && 'message' in data
          ? String((data as { message?: unknown }).message)
          : text || `Request failed with status ${response.status}`,
      response,
    };
  }

  return { data, error: null, response };
}

export async function getAuthenticatedUser(request: Request): Promise<AuthenticatedUser> {
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

export async function findAuthUserByEmail(email: string): Promise<AuthenticatedUser | null> {
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

export async function createAuthUser(input: {
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

export async function updateAuthUserById(
  userId: string,
  attributes: { password?: string; user_metadata?: Record<string, unknown> },
) {
  const serviceRole = getServiceRoleKey();
  const result = await requestJson<{ user?: { id: string } } & { id?: string }>(
    '/auth/v1/admin/users/' + userId,
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

export async function getAdminUserByUserId(userId: string) {
  const serviceRole = getServiceRoleKey();
  const result = await requestJson<AdminUserRow[]>('/rest/v1/admin_users', {
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

export async function requireSuperAdmin(userId: string): Promise<AdminUserRow> {
  const row = await getAdminUserByUserId(userId);

  if (!row) {
    throw new Error('Admin profile not found');
  }

  if (row.status !== 'active' || row.role !== 'super_admin') {
    throw new Error('Forbidden');
  }

  return row;
}

export async function requireAdmin(userId: string): Promise<AdminUserRow> {
  const row = await getAdminUserByUserId(userId);

  if (!row) {
    throw new Error('Admin profile not found');
  }

  if (row.status !== 'active' && row.status !== 'invited') {
    throw new Error('Forbidden');
  }

  return row;
}

export async function selectDbRows<T>(
  table: string,
  query: Record<string, string | undefined>,
): Promise<T[]> {
  const serviceRole = getServiceRoleKey();
  const result = await requestJson<T[]>(`/rest/v1/${table}`, {
    method: 'GET',
    token: serviceRole,
    query,
  });

  if (result.error) {
    throw new Error(result.error);
  }

  return result.data ?? [];
}

export async function upsertDbRow<T>(
  table: string,
  payload: Record<string, unknown>,
  onConflict: string,
): Promise<T | null> {
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

  if (Array.isArray(result.data)) {
    return result.data[0] ?? null;
  }

  return result.data;
}

export async function updateDbRows(
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

export async function insertDbRow(table: string, payload: Record<string, unknown>): Promise<void> {
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
