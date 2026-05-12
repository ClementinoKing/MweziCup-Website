import { Copy, Mail, MoreHorizontal, Plus, RefreshCw, Search, Shield, UserRoundPlus, type LucideIcon } from 'lucide-react';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import type { AdminRole, AdminUser } from '../types/admin';
import {
  DEFAULT_TEMP_ADMIN_PASSWORD,
  inviteAdmin,
  loadAdminSnapshot,
  type AdminInvitationSummary,
} from '../services/adminUsersService';
import { useToast } from '@/components/ui/toast';

const roles: AdminRole[] = ['Super Admin', 'Editor', 'Viewer'];

function RoleBadge({ role }: { role: AdminRole }) {
  const className =
    role === 'Super Admin' ? 'bg-mwezi-primary text-white' : role === 'Editor' ? 'bg-mwezi-soft text-mwezi-deep' : 'bg-secondary text-secondary-foreground';
  return <span className={`rounded-full px-3 py-1 text-xs font-medium ${className}`}>{role}</span>;
}

function ActionsMenu({
  open,
  onOpenChange,
  onCopyEmail,
  onResendInvite,
  canResend,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCopyEmail: () => void;
  onResendInvite: () => void;
  canResend: boolean;
}) {
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onOpenChange(false);
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onOpenChange]);

  return (
    <div ref={menuRef} className="relative">
      <Button variant="ghost" size="icon" className="rounded-full" onClick={() => onOpenChange(!open)}>
        <MoreHorizontal className="h-4 w-4" />
      </Button>
      <div
        className={`absolute right-0 top-[calc(100%+0.5rem)] z-20 w-56 rounded-3xl border border-border bg-popover p-2 shadow-2xl transition ${open ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'}`}
      >
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-foreground transition hover:bg-secondary/70"
          onClick={onCopyEmail}
        >
          <Copy className="h-4 w-4 text-mwezi-primary" />
          Copy email
        </button>
        <button
          type="button"
          className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${canResend ? 'text-foreground hover:bg-secondary/70' : 'cursor-not-allowed text-muted-foreground'}`}
          onClick={onResendInvite}
          disabled={!canResend}
        >
          <RefreshCw className="h-4 w-4 text-mwezi-primary" />
          Resend invite
        </button>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mwezi-soft text-mwezi-deep">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function InvitationRow({ invitation }: { invitation: AdminInvitationSummary }) {
  return (
    <div className="flex flex-col gap-2 rounded-3xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-mwezi-primary" />
          <p className="font-medium text-foreground">{invitation.email}</p>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {invitation.role} · {invitation.status}
        </p>
      </div>
      <div className="text-sm text-muted-foreground">
        {invitation.sentAt ? `Sent ${invitation.sentAt}` : 'Not sent yet'}
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [invitations, setInvitations] = useState<AdminInvitationSummary[]>([]);
  const [search, setSearch] = useState('');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<AdminRole>('Editor');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [inviteSubmitting, setInviteSubmitting] = useState(false);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const { toast } = useToast();

  async function loadSnapshot() {
    setLoading(true);

    const { data, error } = await loadAdminSnapshot();

    if (error) {
      setLoadError(error);
      setUsers(data.users);
      setInvitations(data.invitations);
    } else {
      setLoadError(null);
      setUsers(data.users);
      setInvitations(data.invitations);
    }

    setLoading(false);
  }

  useEffect(() => {
    let mounted = true;

    loadAdminSnapshot()
      .then(({ data, error }) => {
        if (!mounted) return;
        setUsers(data.users);
        setInvitations(data.invitations);
        setLoadError(error);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const filteredUsers = useMemo(
    () => users.filter((user) => `${user.name} ${user.email} ${user.role} ${user.status}`.toLowerCase().includes(search.toLowerCase())),
    [search, users],
  );

  const stats = useMemo(() => {
    const active = users.filter((user) => user.status === 'Active').length;
    const invited = users.filter((user) => user.status === 'Invited').length;
    const disabled = users.filter((user) => user.status === 'Disabled').length;
    return { active, invited, disabled, total: users.length };
  }, [users]);

  function resetInviteForm() {
    setInviteName('');
    setInviteEmail('');
    setInviteRole('Editor');
  }

  async function handleInviteSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = inviteName.trim();
    const trimmedEmail = inviteEmail.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail) {
      toast({
        title: 'Missing details',
        description: 'Enter both a name and an email address.',
        variant: 'error',
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      toast({
        title: 'Invalid email',
        description: 'Use a valid email address for the invited admin.',
        variant: 'error',
      });
      return;
    }

    setInviteSubmitting(true);

    const { error } = await inviteAdmin({
      name: trimmedName,
      email: trimmedEmail,
      role: inviteRole,
    });

    if (error) {
      toast({
        title: 'Invite failed',
        description: error,
        variant: 'error',
      });
      setInviteSubmitting(false);
      return;
    }

    toast({
      title: 'Invite sent',
      description: `The admin invitation was delivered with the temporary password ${DEFAULT_TEMP_ADMIN_PASSWORD}.`,
      variant: 'success',
    });

    resetInviteForm();
    setInviteSubmitting(false);
    setInviteOpen(false);
    await loadSnapshot();
  }

  async function handleResendInvite(user: AdminUser) {
    setResendingId(user.id);

    const { error } = await inviteAdmin({
      name: user.name,
      email: user.email,
      role: user.role,
    });

    if (error) {
      toast({
        title: 'Resend failed',
        description: error,
        variant: 'error',
      });
      setResendingId(null);
      return;
    }

    toast({
      title: 'Invite resent',
      description: `A fresh invitation was sent to ${user.email}.`,
      variant: 'success',
    });

    setSelectedMenuId(null);
    setResendingId(null);
    await loadSnapshot();
  }

  async function handleCopyEmail(email: string) {
    await navigator.clipboard.writeText(email);
    toast({
      title: 'Email copied',
      description: email,
      variant: 'success',
    });
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Access control"
        title="Admin Users"
        description="Manage roles, access, and invitation delivery from one clean admin directory."
        actions={
          <Button className="rounded-full bg-mwezi-primary hover:bg-mwezi-deep" onClick={() => setInviteOpen(true)}>
            <Plus className="h-4 w-4" />
            Invite admin
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Total admins" value={String(stats.total)} icon={UserRoundPlus} />
        <SummaryCard label="Active" value={String(stats.active)} icon={Shield} />
        <SummaryCard label="Invited" value={String(stats.invited)} icon={Mail} />
        <SummaryCard label="Disabled" value={String(stats.disabled)} icon={MoreHorizontal} />
      </div>

      <Card className="border-border/80 bg-card shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search admin users..."
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
        </CardContent>
      </Card>

      {loadError ? (
        <Card className="border-destructive/20 bg-destructive/5 shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm font-medium text-destructive">Could not load admin users</p>
            <p className="mt-1 text-sm text-muted-foreground">{loadError}</p>
            <Button variant="outline" className="mt-4 rounded-full" onClick={loadSnapshot}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <Card className="border-border/80 bg-card shadow-sm">
        <CardContent className="overflow-x-auto p-0">
          <table className="min-w-full divide-y divide-border/70">
            <thead className="bg-muted/80 text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last login</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70 bg-card">
              {loading ? (
                <tr>
                  <td className="px-6 py-12 text-center text-sm text-muted-foreground" colSpan={6}>
                    Loading admin users...
                  </td>
                </tr>
              ) : null}

              {!loading
                ? filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-5 font-medium text-foreground">{user.name}</td>
                      <td className="px-6 py-5 text-sm text-foreground">{user.email}</td>
                      <td className="px-6 py-5">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="px-6 py-5">
                        <StatusBadge status={user.status} />
                      </td>
                      <td className="px-6 py-5 text-sm text-muted-foreground">{user.lastLogin}</td>
                      <td className="px-6 py-5">
                        <ActionsMenu
                          open={selectedMenuId === user.id}
                          onOpenChange={(open) => setSelectedMenuId(open ? user.id : null)}
                          onCopyEmail={() => handleCopyEmail(user.email)}
                          onResendInvite={() => handleResendInvite(user)}
                          canResend={user.status === 'Invited' && resendingId !== user.id}
                        />
                      </td>
                    </tr>
                  ))
                : null}

              {!loading && filteredUsers.length === 0 ? (
                <tr>
                  <td className="px-6 py-12 text-center text-sm text-muted-foreground" colSpan={6}>
                    No users match the current search.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card className="border-border/80 bg-card shadow-sm">
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-base font-semibold text-foreground">Recent invitations</p>
              <p className="mt-1 text-sm text-muted-foreground">The latest invite deliveries and their current status.</p>
            </div>
          </div>
          <div className="grid gap-3">
            {invitations.slice(0, 4).map((invitation) => (
              <InvitationRow key={invitation.id} invitation={invitation} />
            ))}
            {!loading && invitations.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border bg-muted/20 p-6 text-sm text-muted-foreground">
                No invitations have been created yet.
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Dialog.Root
        open={inviteOpen}
        onOpenChange={(open) => {
          setInviteOpen(open);
          if (!open) resetInviteForm();
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border bg-popover p-6 shadow-2xl focus:outline-none">
            <Dialog.Title className="text-xl font-semibold text-foreground">Invite admin</Dialog.Title>
            <Dialog.Description className="mt-2 text-sm leading-6 text-muted-foreground">
              Create a secure invite with the temporary password <span className="font-semibold text-foreground">{DEFAULT_TEMP_ADMIN_PASSWORD}</span>. The user will be forced to change it on first login.
            </Dialog.Description>

            <form className="mt-6 space-y-4" onSubmit={handleInviteSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full name</label>
                <Input
                  value={inviteName}
                  onChange={(event) => setInviteName(event.target.value)}
                  placeholder="Jane Banda"
                  className="h-11 rounded-2xl"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email address</label>
                <Input
                  type="email"
                  value={inviteEmail}
                  onChange={(event) => setInviteEmail(event.target.value)}
                  placeholder="jane@company.com"
                  className="h-11 rounded-2xl"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Role</label>
                <select
                  value={inviteRole}
                  onChange={(event) => setInviteRole(event.target.value as AdminRole)}
                  className="h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none focus-visible:border-mwezi-primary/40 focus-visible:ring-2 focus-visible:ring-mwezi-primary/15"
                >
                  {roles.map((role) => (
                    <option key={role}>{role}</option>
                  ))}
                </select>
              </div>

              <div className="rounded-2xl border border-border bg-muted p-4 text-sm leading-6 text-muted-foreground">
                The invitation email will link to the admin login page and present the branded Mwezi invite template.
              </div>

              <div className="mt-2 flex flex-wrap justify-end gap-3">
                <Dialog.Close asChild>
                  <Button variant="outline" className="rounded-full">
                    Cancel
                  </Button>
                </Dialog.Close>
                <Button className="rounded-full bg-mwezi-primary hover:bg-mwezi-deep" type="submit" disabled={inviteSubmitting}>
                  {inviteSubmitting ? 'Sending invite' : 'Invite user'}
                </Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    </div>
  );
}
