import { NavLink, useLocation } from 'react-router-dom';
import { ChevronRight, LogOut, MoonStar, SunMedium } from 'lucide-react';
import { SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { adminNavItems } from './adminNav';

interface AdminSidebarProps {
  mobile?: boolean;
  onNavigate?: () => void;
  collapsed?: boolean;
  theme?: 'light' | 'dark';
  onThemeChange?: (theme: 'light' | 'dark') => void;
  accountName?: string;
  accountEmail?: string;
  onLogout?: () => void;
}

export default function AdminSidebar({
  mobile = false,
  onNavigate,
  collapsed = false,
  theme = 'light',
  onThemeChange,
  accountName = 'Clement Mwanyama',
  accountEmail = 'clement@mwezicup.com',
  onLogout,
}: AdminSidebarProps) {
  const location = useLocation();
  const footerBandClass = collapsed ? 'min-h-[156px] px-3 pb-3 pt-2' : 'min-h-[168px] px-3 pb-3 pt-2';
  const footerActionClass =
    'flex h-10 w-full items-center justify-center rounded-xl border border-border/70 bg-background/95 text-foreground shadow-sm transition-all hover:border-border hover:bg-muted';
  const content = (
    <div className="flex h-full flex-col bg-background">
      <nav className={cn('flex-1 space-y-1.5 py-3', collapsed ? 'px-2' : 'px-3')}>
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const isDashboard = item.to === '/martinee' && (location.pathname === '/admin' || location.pathname === '/martinee');
          const link = (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'group relative flex h-11 items-center justify-between rounded-xl px-3 text-sm font-medium transition-all duration-200',
                  (isActive || isDashboard)
                    ? 'border border-primary/15 bg-primary/10 text-primary shadow-sm'
                    : 'border border-transparent text-muted-foreground hover:border-border/70 hover:bg-muted/70 hover:text-foreground',
                  collapsed && 'justify-center px-0',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
                    <span
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-lg border transition-colors',
                        (isActive || isDashboard)
                          ? 'border-primary/15 bg-primary/15 text-primary'
                          : 'border-transparent bg-muted/60 text-muted-foreground group-hover:border-border/70 group-hover:bg-background',
                      )}
                    >
                      <Icon className="h-[17px] w-[17px]" strokeWidth={1.9} />
                    </span>
                    {!collapsed ? <span>{item.label}</span> : null}
                  </span>
                  {!collapsed ? (
                    <ChevronRight className={cn('h-4 w-4 transition-all', (isActive || isDashboard) ? 'opacity-100 text-primary' : 'opacity-0 -translate-x-0.5 group-hover:opacity-60')} />
                  ) : null}
                </>
              )}
            </NavLink>
          );

          return mobile ? <SheetClose asChild key={item.to}>{link}</SheetClose> : link;
        })}
      </nav>

      <div className={cn('overflow-visible', footerBandClass)}>
        {collapsed ? (
          <div className="flex h-full flex-col justify-end gap-3 px-2">
            <div className="flex items-center justify-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-background text-foreground shadow-sm ring-1 ring-border/40">
                <span className="text-[11px] font-semibold tracking-wide">CM</span>
              </div>
            </div>

            <div className="flex flex-col items-stretch gap-2">
              <button
                type="button"
                className="flex h-11 w-full items-center justify-center rounded-xl border border-border/70 bg-background/95 text-foreground shadow-sm transition-all hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
                onClick={() => {
                  onNavigate?.();
                  onLogout?.();
                }}
                aria-label="Logout"
                title="Logout"
              >
                <LogOut className="h-[17px] w-[17px]" strokeWidth={2.1} />
              </button>

              <button
                type="button"
                className="flex h-11 w-full items-center justify-center rounded-xl border border-border/70 bg-background/95 text-foreground shadow-sm transition-all hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
                onClick={() => onThemeChange?.(theme === 'light' ? 'dark' : 'light')}
                aria-label="Toggle color mode"
                title="Toggle color mode"
              >
                {theme === 'light' ? <MoonStar className="h-[17px] w-[17px]" strokeWidth={2.1} /> : <SunMedium className="h-[17px] w-[17px]" strokeWidth={2.1} />}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col justify-end gap-2 px-3">
            <div className="rounded-2xl border border-border/70 bg-muted/25 p-2.5 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground/70">
                  Account
                </p>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <span className="text-[10px] font-semibold">CM</span>
                </div>
              </div>

              <div className="rounded-xl border border-border/60 bg-background/95 px-3 py-2.5 shadow-sm">
                <p className="truncate text-sm font-medium text-foreground">{accountName}</p>
                <p className="truncate text-xs text-muted-foreground">{accountEmail}</p>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <Button
                  variant="outline"
                  className="h-10 min-w-0 flex-1 justify-start rounded-xl border-border/70 bg-background/95 px-3 text-sm shadow-sm transition-colors hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
                  onClick={() => {
                    onNavigate?.();
                    onLogout?.();
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-xl border-border/70 bg-background/95 shadow-sm transition-colors hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
                  onClick={() => onThemeChange?.(theme === 'light' ? 'dark' : 'light')}
                  aria-label="Toggle color mode"
                >
                  {theme === 'light' ? <MoonStar className="h-[17px] w-[17px]" /> : <SunMedium className="h-[17px] w-[17px]" />}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return mobile ? <div className="h-full">{content}</div> : <aside className="h-full">{content}</aside>;
}
