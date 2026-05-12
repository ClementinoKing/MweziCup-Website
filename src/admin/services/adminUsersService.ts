import { supabase } from '@/lib/supabase';
import type { AdminProfile, AdminRole, AdminStatus, AdminUser } from '../types/admin';

const SITE_KEY = 'default';
export const DEFAULT_TEMP_ADMIN_PASSWORD = '12345678';

type DbAdminRole = 'super_admin' | 'editor' | 'viewer';
type DbAdminStatus = 'active' | 'invited' | 'disabled';
type DbInvitationStatus = 'pending' | 'sent' | 'accepted' | 'revoked' | 'expired';

type AdminUserRow = {
  id: string;
  display_name: string;
  email: string;
  role: DbAdminRole;
  status: DbAdminStatus;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

type AdminInvitationRow = {
  id: string;
  email: string;
  role: DbAdminRole;
  status: DbInvitationStatus;
  sent_at: string | null;
  accepted_at: string | null;
  expires_at: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

type InviteAdminInput = {
  name: string;
  email: string;
  role: AdminRole;
};

type InviteAdminResponse = {
  success: boolean;
  message: string;
};

export type AdminUsersSnapshot = {
  users: AdminUser[];
  invitations: AdminInvitationSummary[];
};

export type AdminInvitationSummary = {
  id: string;
  email: string;
  role: AdminRole;
  status: 'Pending' | 'Sent' | 'Accepted' | 'Revoked' | 'Expired';
  sentAt: string | null;
  acceptedAt: string | null;
  expiresAt: string;
};

function toDisplayRole(role: DbAdminRole): AdminRole {
  if (role === 'super_admin') return 'Super Admin';
  if (role === 'editor') return 'Editor';
  return 'Viewer';
}

function toDisplayStatus(status: DbAdminStatus): AdminStatus {
  if (status === 'active') return 'Active';
  if (status === 'disabled') return 'Disabled';
  return 'Invited';
}

function toDisplayInvitationStatus(status: DbInvitationStatus): AdminInvitationSummary['status'] {
  if (status === 'accepted') return 'Accepted';
  if (status === 'expired') return 'Expired';
  if (status === 'revoked') return 'Revoked';
  if (status === 'sent') return 'Sent';
  return 'Pending';
}

function formatLastLoginAt(lastLoginAt: string | null): string {
  if (!lastLoginAt) return 'Never';

  const date = new Date(lastLoginAt);
  if (Number.isNaN(date.getTime())) return 'Never';

  return new Intl.DateTimeFormat('en-MW', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function formatInviteDate(value: string | null): string | null {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat('en-MW', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function mapUserRow(row: AdminUserRow): AdminUser {
  return {
    id: row.id,
    name: row.display_name,
    email: row.email,
    role: toDisplayRole(row.role),
    status: toDisplayStatus(row.status),
    lastLogin: formatLastLoginAt(row.last_login_at),
  };
}

function mapProfileRow(row: AdminUserRow): AdminProfile {
  return {
    id: row.id,
    displayName: row.display_name,
    email: row.email,
    role: toDisplayRole(row.role),
    status: toDisplayStatus(row.status),
    lastLoginAt: row.last_login_at,
  };
}

function mapInvitationRow(row: AdminInvitationRow): AdminInvitationSummary {
  return {
    id: row.id,
    email: row.email,
    role: toDisplayRole(row.role),
    status: toDisplayInvitationStatus(row.status),
    sentAt: formatInviteDate(row.sent_at),
    acceptedAt: formatInviteDate(row.accepted_at),
    expiresAt: formatInviteDate(row.expires_at) ?? row.expires_at,
  };
}

export async function loadAdminUsers(): Promise<{ data: AdminUser[]; error: string | null }> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('id, display_name, email, role, status, last_login_at, created_at, updated_at, deleted_at')
    .eq('site_key', SITE_KEY)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) {
    return { data: [], error: error.message };
  }

  return { data: (data ?? []).map((row) => mapUserRow(row as AdminUserRow)), error: null };
}

export async function loadAdminInvitations(): Promise<{ data: AdminInvitationSummary[]; error: string | null }> {
  const { data, error } = await supabase
    .from('admin_invitations')
    .select('id, email, role, status, sent_at, accepted_at, expires_at, created_at, updated_at, deleted_at')
    .eq('site_key', SITE_KEY)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) {
    return { data: [], error: error.message };
  }

  return { data: (data ?? []).map((row) => mapInvitationRow(row as AdminInvitationRow)), error: null };
}

export async function loadAdminSnapshot(): Promise<{ data: AdminUsersSnapshot; error: string | null }> {
  const [usersResult, invitationsResult] = await Promise.all([loadAdminUsers(), loadAdminInvitations()]);

  const error = usersResult.error ?? invitationsResult.error;
  if (error) {
    return {
      data: { users: usersResult.data, invitations: invitationsResult.data },
      error,
    };
  }

  return {
    data: { users: usersResult.data, invitations: invitationsResult.data },
    error: null,
  };
}

export async function loadCurrentAdminProfile(userId: string): Promise<{ data: AdminProfile | null; error: string | null }> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('id, display_name, email, role, status, last_login_at, created_at, updated_at, deleted_at')
    .eq('site_key', SITE_KEY)
    .eq('user_id', userId)
    .is('deleted_at', null)
    .maybeSingle();

  if (error) {
    return { data: null, error: error.message };
  }

  if (!data) {
    return { data: null, error: null };
  }

  return { data: mapProfileRow(data as AdminUserRow), error: null };
}

export async function inviteAdmin(input: InviteAdminInput): Promise<{ data: InviteAdminResponse | null; error: string | null }> {
  const { data, error } = await supabase.functions.invoke<InviteAdminResponse>('admin-invite', {
    body: {
      siteKey: SITE_KEY,
      name: input.name,
      email: input.email,
      role: input.role,
    },
  });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data ?? null, error: null };
}

export async function completeAdminInvite(newPassword: string): Promise<{ error: string | null }> {
  const { error } = await supabase.functions.invoke('admin-complete-invite', {
    body: {
      siteKey: SITE_KEY,
      newPassword,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
