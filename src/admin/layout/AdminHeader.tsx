import { Bell, ChevronDown, Menu, PanelLeftClose, PanelLeftOpen, Search, UserRound, CirclePlus, FileText, Package, Megaphone, UserPlus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface AdminHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onMobileMenuToggle: () => void;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  accountName: string;
  accountEmail: string;
  onLogout: () => void;
}

export default function AdminHeader({
  searchValue,
  onSearchChange,
  onMobileMenuToggle,
  sidebarCollapsed,
  onToggleSidebar,
  theme,
  onThemeChange,
  accountName,
  accountEmail,
  onLogout,
}: AdminHeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="flex h-[72px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 shrink-0">
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-lg lg:hidden" onClick={onMobileMenuToggle}>
            <Menu className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="hidden h-10 w-10 rounded-lg lg:inline-flex"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
          >
            {sidebarCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
          </Button>

          <NavLink to="/martinee" className="flex items-center gap-2">
            <img src="/Mwezi_Cup_logo.svg" alt="Mwezi Cup" className="h-8 w-auto object-contain" />
          </NavLink>

          {/* Create Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" className="hidden rounded-full gap-2 md:inline-flex">
                <CirclePlus className="h-4 w-4" />
                Create
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem asChild>
                <Link to="/admin/blog/new" className="flex items-center gap-2 cursor-pointer">
                  <FileText className="h-4 w-4" />
                  <span>Blog Post</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin/products/new" className="flex items-center gap-2 cursor-pointer">
                  <Package className="h-4 w-4" />
                  <span>Product</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin/campaigns/new" className="flex items-center gap-2 cursor-pointer">
                  <Megaphone className="h-4 w-4" />
                  <span>Campaign</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin/users/invite" className="flex items-center gap-2 cursor-pointer">
                  <UserPlus className="h-4 w-4" />
                  <span>Invite User</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="hidden flex-1 md:flex md:justify-center">
          <div className="flex w-full max-w-2xl items-center gap-3 rounded-lg border border-border bg-background px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search content, posts, users..."
              className="h-auto border-0 bg-transparent px-0 py-0 text-sm text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-0"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-lg">
            <Bell className="h-4.5 w-4.5" />
          </Button>

          <div ref={menuRef} className="relative">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-lg"
              onClick={() => setProfileOpen((value) => !value)}
              aria-label="Open account menu"
            >
              <UserRound className="h-5 w-5" />
            </Button>

            <div
              className={cn(
                'absolute right-0 top-[calc(100%+0.75rem)] w-64 rounded-lg border border-border bg-background p-3 shadow-lg transition-all',
                profileOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0',
              )}
            >
              <div className="rounded-lg border border-border bg-muted/50 p-3">
                <p className="text-sm font-medium text-foreground">{accountName}</p>
                <p className="text-xs text-muted-foreground">Super Admin</p>
                <p className="mt-1 truncate text-xs text-muted-foreground">{accountEmail}</p>
              </div>

              <div className="mt-3 space-y-1">
                {[
                  { label: 'Profile settings', href: '/admin/users' },
                  { label: 'Site settings', href: '/admin/settings' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="flex rounded-md px-3 py-2.5 text-sm text-foreground transition hover:bg-muted"
                    onClick={() => setProfileOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <button
                  type="button"
                  className="flex w-full rounded-md px-3 py-2.5 text-left text-sm text-foreground transition hover:bg-muted"
                  onClick={() => {
                    setProfileOpen(false);
                    onLogout();
                  }}
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 sm:px-6 md:hidden">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search content, posts, users..."
            className="h-auto border-0 bg-transparent px-0 py-0 text-sm text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-0"
          />
        </div>
      </div>
    </header>
  );
}
