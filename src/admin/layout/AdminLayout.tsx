import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useAdminAuth } from '../auth/AdminAuthProvider';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { session, signOut, adminProfile } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    const storedTheme = window.localStorage.getItem('mwezi-admin-theme');
    if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem('mwezi-admin-theme', theme);
  }, [theme]);

  const sidebarWidthClass = sidebarCollapsed ? 'lg:w-20' : 'lg:w-72';
  const fixedSidebarWidthClass = sidebarCollapsed ? 'w-20' : 'w-72';
  const accountName = adminProfile?.displayName ?? session?.user.user_metadata?.full_name ?? session?.user.email?.split('@')[0] ?? 'Admin';
  const accountEmail = adminProfile?.email ?? session?.user.email ?? 'admin@mwezicup.com';

  async function handleLogout() {
    await signOut();
    navigate('/admin/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onMobileMenuToggle={() => setMobileOpen(true)}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed((value) => !value)}
        theme={theme}
        onThemeChange={setTheme}
        accountName={accountName}
        accountEmail={accountEmail}
        onLogout={handleLogout}
      />

      <div className="flex min-h-[calc(100vh-72px)]">
        <div className={cn('hidden lg:block lg:shrink-0', sidebarWidthClass)}>
          <div
            className={cn(
              'fixed bottom-0 top-[72px] z-20 border-r border-border bg-background transition-all duration-200',
              fixedSidebarWidthClass,
            )}
          >
            <AdminSidebar
              collapsed={sidebarCollapsed}
              theme={theme}
              onThemeChange={setTheme}
              accountName={accountName}
              accountEmail={accountEmail}
              onLogout={handleLogout}
            />
          </div>
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-[88vw] max-w-sm border-r-0 bg-background p-0">
            <SheetHeader className="sr-only">
              <h2>Admin navigation</h2>
            </SheetHeader>
            <AdminSidebar
              mobile
              theme={theme}
              onThemeChange={setTheme}
              onNavigate={() => setMobileOpen(false)}
              accountName={accountName}
              accountEmail={accountEmail}
              onLogout={handleLogout}
            />
          </SheetContent>
        </Sheet>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
