import {
  Boxes,
  LayoutDashboard,
  Mail,
  Settings2,
  Users2,
  MessageSquareText,
  BookOpenText,
  Images,
  BadgeInfo,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface AdminNavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  exact?: boolean;
}

export const adminNavItems: AdminNavItem[] = [
  { label: 'Dashboard', to: '/martinee', icon: LayoutDashboard, exact: true },
  { label: 'Homepage', to: '/admin/homepage', icon: BadgeInfo },
  { label: 'Blog', to: '/admin/blog', icon: BookOpenText },
  { label: 'Sections', to: '/admin/sections', icon: Boxes },
  { label: 'Media Library', to: '/admin/media', icon: Images },
  { label: 'Messages', to: '/admin/messages', icon: MessageSquareText },
  { label: 'Subscribers', to: '/admin/subscribers', icon: Mail },
  { label: 'Settings', to: '/admin/settings', icon: Settings2 },
  { label: 'Admin Users', to: '/admin/users', icon: Users2 },
];

export const adminRouteTitles = [
  { path: '/martinee', title: 'Dashboard' },
  { path: '/admin', title: 'Dashboard' },
  { path: '/admin/homepage', title: 'Homepage Manager' },
  { path: '/admin/blog/new', title: 'New Blog Post' },
  { path: '/admin/blog/:id/edit', title: 'Edit Blog Post' },
  { path: '/admin/blog', title: 'Blog Manager' },
  { path: '/admin/sections', title: 'Sections Manager' },
  { path: '/admin/media', title: 'Media Library' },
  { path: '/admin/messages', title: 'Messages' },
  { path: '/admin/subscribers', title: 'Subscribers' },
  { path: '/admin/settings', title: 'Site Settings' },
  { path: '/admin/users', title: 'Admin Users' },
];
