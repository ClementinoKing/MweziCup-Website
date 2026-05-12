import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAdminAuth } from './AdminAuthProvider';

export default function RequireAdminAuth() {
  const location = useLocation();
  const { loading, session, adminProfile } = useAdminAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 text-sm text-muted-foreground shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Checking admin session
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  const requiresPasswordChange =
    adminProfile?.status === 'Invited' ||
    (adminProfile === null && session.user.user_metadata?.force_password_change === true);

  if (requiresPasswordChange && location.pathname !== '/admin/change-password') {
    return <Navigate to="/admin/change-password" replace state={{ from: location.pathname }} />;
  }

  if (!requiresPasswordChange && location.pathname === '/admin/change-password') {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}
