import { ArrowRight, BookOpenText, Boxes, CheckCircle2, ImagePlus, LayoutDashboard, Mail, Plus, Sparkles, Users2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import { mockActivityItems, mockBlogPosts, mockContactMessages, mockMediaItems, mockSubscribers, mockWebsiteSections } from '../data/mockAdminData';
import type { ActivityItem } from '../types/admin';

const recentItems: ActivityItem[] = mockActivityItems;

const contentHealthItems = [
  { label: 'Homepage content complete', value: 92, detail: 'Most homepage sections are ready for publishing.' },
  { label: 'Blog editorial pipeline', value: 68, detail: 'Drafts are present, but editorial review is still needed.' },
  { label: 'Messages awaiting reply', value: 82, detail: 'Only one new message is awaiting a response.' },
  { label: 'Media library readiness', value: 96, detail: 'Core brand assets are uploaded and available.' },
] as const;

const quickActions = [
  {
    title: 'Write blog post',
    description: 'Draft a new editorial update, education piece, or product story.',
    to: '/admin/blog/new',
    icon: BookOpenText,
  },
  {
    title: 'Update homepage',
    description: 'Refine the hero, CTA sections, marquee text, and featured blocks.',
    to: '/admin/homepage',
    icon: Sparkles,
  },
  {
    title: 'Review messages',
    description: 'Reply to fresh contacts, wholesale requests, and support questions.',
    to: '/admin/messages',
    icon: Mail,
  },
  {
    title: 'Manage media',
    description: 'Keep brand imagery, uploads, and assets organized in one place.',
    to: '/admin/media',
    icon: ImagePlus,
  },
];

function getActivityDot(kind: ActivityItem['kind']) {
  switch (kind) {
    case 'publish':
      return 'bg-emerald-500';
    case 'draft':
      return 'bg-amber-500';
    case 'message':
      return 'bg-blue-500';
    case 'media':
      return 'bg-fuchsia-500';
    case 'user':
      return 'bg-mwezi-primary';
    default:
      return 'bg-slate-500';
  }
}

export default function AdminDashboard() {
  const stats = [
    { label: 'Total blog posts', value: String(mockBlogPosts.length), icon: BookOpenText, change: '+2 this week' },
    { label: 'Published posts', value: String(mockBlogPosts.filter((post) => post.status === 'Published').length), icon: LayoutDashboard, change: 'Stable' },
    { label: 'Draft posts', value: String(mockBlogPosts.filter((post) => post.status === 'Draft').length), icon: Sparkles, change: '+1 today' },
    { label: 'Homepage sections', value: '5', icon: Boxes, change: 'Ready' },
    { label: 'Product sections', value: String(mockWebsiteSections.filter((section) => section.type === 'Product').length), icon: Boxes, change: 'Linked' },
    { label: 'Contact messages', value: String(mockContactMessages.length), icon: Mail, change: '+1 new' },
    { label: 'Newsletter subscribers', value: String(mockSubscribers.length), icon: Users2, change: '+4 today' },
    { label: 'Recent updates', value: String(mockActivityItems.length), icon: Sparkles, change: '8 total' },
  ];

  return (
    <div className="space-y-8">
      <Card className="border-border shadow-sm">
        <CardContent className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Overview</p>
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">Admin dashboard</h2>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                Keep homepage content, blog publishing, media, messages, and team access aligned from one central workspace.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild variant="outline" className="rounded-lg">
              <Link to="/admin/blog">
                <ArrowRight className="h-4 w-4 rotate-180" />
                Open blog
              </Link>
            </Button>
            <Button asChild className="rounded-lg bg-primary text-primary-foreground shadow-sm hover:bg-primary/90">
              <Link to="/admin/blog/new">
                <Plus className="h-4 w-4" />
                New post
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <PageHeader
        eyebrow="Summary"
        title="Today at a glance"
        description="Track the health of the admin content system without digging through individual sections."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} icon={stat.icon} change={stat.change} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>The latest content, message, and admin updates in one feed.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentItems.map((item, index) => (
              <div key={item.id}>
                <div className="flex gap-4 py-1">
                  <div className={`mt-2 h-2.5 w-2.5 rounded-full ${getActivityDot(item.kind)}`} />
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-medium text-foreground">{item.title}</h3>
                      <span className="text-xs text-muted-foreground">{item.time}</span>
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                {index !== recentItems.length - 1 ? <Separator className="my-4" /> : null}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
              <CardDescription>Shortcuts for the most common admin tasks.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.title}
                    to={action.to}
                    className="group rounded-lg border border-border bg-background p-4 transition-colors hover:bg-muted"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-foreground">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="font-medium text-foreground">{action.title}</h3>
                          <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5" />
                        </div>
                        <p className="text-sm leading-6 text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle>Content health</CardTitle>
              <CardDescription>What is ready and what still needs attention.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {contentHealthItems.map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <span className="text-sm text-muted-foreground">{item.value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${item.value}%` }} />
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">{item.detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>Content snapshot</CardTitle>
            <CardDescription>At-a-glance counts for the most important areas.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm font-medium text-muted-foreground">Blog posts</p>
              <p className="mt-2 text-3xl font-semibold text-foreground">{mockBlogPosts.length}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {mockBlogPosts.filter((post) => post.status === 'Published').length} published and ready.
              </p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm font-medium text-muted-foreground">Messages</p>
              <p className="mt-2 text-3xl font-semibold text-foreground">{mockContactMessages.length}</p>
              <p className="mt-2 text-sm text-muted-foreground">Prioritize new inquiries and support follow-ups.</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm font-medium text-muted-foreground">Subscribers</p>
              <p className="mt-2 text-3xl font-semibold text-foreground">{mockSubscribers.length}</p>
              <p className="mt-2 text-sm text-muted-foreground">Keep the newsletter list clean and active.</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm font-medium text-muted-foreground">Media assets</p>
              <p className="mt-2 text-3xl font-semibold text-foreground">{mockMediaItems.length}</p>
              <p className="mt-2 text-sm text-muted-foreground">Core brand assets are organized and ready.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>Publishing focus</CardTitle>
            <CardDescription>Where attention should go next.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg border border-border p-4">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">Homepage is mostly complete</p>
                <p className="text-sm text-muted-foreground">Finalize CTA wording and the hero image selection.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border p-4">
              <CheckCircle2 className="h-5 w-5 text-amber-600" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">Blog drafts need review</p>
                <p className="text-sm text-muted-foreground">Focus on publishing the education and care articles.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border p-4">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">Inbox requires response</p>
                <p className="text-sm text-muted-foreground">One wholesale message is waiting in the queue.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
