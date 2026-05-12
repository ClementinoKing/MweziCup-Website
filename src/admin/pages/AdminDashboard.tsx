import { ArrowRight, BookOpenText, Boxes, CheckCircle2, ImagePlus, LayoutDashboard, Mail, Plus, Sparkles, Users2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import { supabase } from '@/lib/supabase';
import type { BlogPost } from '@/types/database';

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

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [mediaItems, setMediaItems] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch blog posts
      const { data: posts } = await supabase
        .from('blog_posts')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      // Fetch contact messages
      const { data: messages } = await supabase
        .from('contact_messages')
        .select('*')
        .is('deleted_at', null)
        .order('received_at', { ascending: false });

      // Fetch newsletter subscribers
      const { data: subs } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .is('deleted_at', null)
        .order('subscription_date', { ascending: false });

      // Fetch media items
      const { data: media } = await supabase
        .from('media_items')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      setBlogPosts(posts || []);
      setContactMessages(messages || []);
      setSubscribers(subs || []);
      setMediaItems(media || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const publishedPosts = blogPosts.filter((post) => post.status === 'published');
  const draftPosts = blogPosts.filter((post) => post.status === 'draft');
  const newMessages = contactMessages.filter((msg) => msg.status === 'new');

  const stats = [
    { label: 'Total blog posts', value: String(blogPosts.length), icon: BookOpenText, change: `${blogPosts.length} total` },
    { label: 'Published posts', value: String(publishedPosts.length), icon: LayoutDashboard, change: 'Live' },
    { label: 'Draft posts', value: String(draftPosts.length), icon: Sparkles, change: 'In progress' },
    { label: 'Contact messages', value: String(contactMessages.length), icon: Mail, change: `${newMessages.length} new` },
    { label: 'Newsletter subscribers', value: String(subscribers.length), icon: Users2, change: 'Active' },
    { label: 'Media assets', value: String(mediaItems.length), icon: ImagePlus, change: 'Uploaded' },
  ];

  const contentHealthItems = [
    { 
      label: 'Blog posts published', 
      value: blogPosts.length > 0 ? Math.round((publishedPosts.length / blogPosts.length) * 100) : 0, 
      detail: `${publishedPosts.length} of ${blogPosts.length} posts are published.` 
    },
    { 
      label: 'Messages awaiting reply', 
      value: contactMessages.length > 0 ? Math.round(((contactMessages.length - newMessages.length) / contactMessages.length) * 100) : 100, 
      detail: `${newMessages.length} message${newMessages.length !== 1 ? 's' : ''} awaiting response.` 
    },
    { 
      label: 'Media library readiness', 
      value: mediaItems.length > 0 ? 96 : 0, 
      detail: `${mediaItems.length} assets uploaded and available.` 
    },
  ] as const;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Summary"
        title="Today at a glance"
        description="Track the health of the admin content system without digging through individual sections."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} icon={stat.icon} change={stat.change} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>Recent blog posts</CardTitle>
            <CardDescription>The latest blog posts created in the system.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {blogPosts.slice(0, 5).length > 0 ? (
              blogPosts.slice(0, 5).map((post, index) => (
                <div key={post.id}>
                  <div className="flex gap-4 py-1">
                    <div className={`mt-2 h-2.5 w-2.5 rounded-full ${
                      post.status === 'published' ? 'bg-emerald-500' : 
                      post.status === 'draft' ? 'bg-amber-500' : 'bg-slate-500'
                    }`} />
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-medium text-foreground">{post.title}</h3>
                        <span className="text-xs text-muted-foreground">
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm leading-6 text-muted-foreground line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          post.status === 'published' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                          post.status === 'draft' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                          'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400'
                        }`}>
                          {post.status}
                        </span>
                        <span className="text-xs text-muted-foreground">by {post.author_name}</span>
                      </div>
                    </div>
                  </div>
                  {index !== Math.min(blogPosts.length, 5) - 1 ? <Separator className="my-4" /> : null}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground py-8 text-center">No blog posts yet. Create your first post!</p>
            )}
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
              <p className="mt-2 text-3xl font-semibold text-foreground">{blogPosts.length}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {publishedPosts.length} published and ready.
              </p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm font-medium text-muted-foreground">Messages</p>
              <p className="mt-2 text-3xl font-semibold text-foreground">{contactMessages.length}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {newMessages.length} new message{newMessages.length !== 1 ? 's' : ''} to review.
              </p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm font-medium text-muted-foreground">Subscribers</p>
              <p className="mt-2 text-3xl font-semibold text-foreground">{subscribers.length}</p>
              <p className="mt-2 text-sm text-muted-foreground">Keep the newsletter list clean and active.</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm font-medium text-muted-foreground">Media assets</p>
              <p className="mt-2 text-3xl font-semibold text-foreground">{mediaItems.length}</p>
              <p className="mt-2 text-sm text-muted-foreground">Brand assets organized and ready.</p>
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
              <CheckCircle2 className={`h-5 w-5 ${publishedPosts.length > 0 ? 'text-emerald-600' : 'text-amber-600'}`} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {publishedPosts.length > 0 ? 'Blog posts published' : 'No published posts yet'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {publishedPosts.length > 0 
                    ? `${publishedPosts.length} post${publishedPosts.length !== 1 ? 's' : ''} live on the website.`
                    : 'Create and publish your first blog post.'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border p-4">
              <CheckCircle2 className={`h-5 w-5 ${draftPosts.length === 0 ? 'text-emerald-600' : 'text-amber-600'}`} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {draftPosts.length > 0 ? 'Blog drafts need review' : 'No drafts pending'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {draftPosts.length > 0
                    ? `${draftPosts.length} draft${draftPosts.length !== 1 ? 's' : ''} waiting to be published.`
                    : 'All posts are either published or archived.'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border p-4">
              <CheckCircle2 className={`h-5 w-5 ${newMessages.length === 0 ? 'text-emerald-600' : 'text-blue-600'}`} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {newMessages.length > 0 ? 'Messages require response' : 'Inbox up to date'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {newMessages.length > 0
                    ? `${newMessages.length} message${newMessages.length !== 1 ? 's' : ''} waiting in the queue.`
                    : 'All messages have been reviewed.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
