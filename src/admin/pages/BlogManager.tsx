import { Archive, Edit3, Filter, Plus, Search, Send, Trash2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import ConfirmDialog from '../components/ConfirmDialog';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import type { BlogPostWithTags, BlogPostStatus } from '@/types/database';
import {
  getBlogPosts,
  deleteBlogPost,
  publishBlogPost,
  unpublishBlogPost,
} from '@/services/blogService';

const categories = ['All categories', 'Education', 'Lifestyle', 'Product', 'Care'];
const statuses = ['All status', 'Published', 'Draft', 'Archived'];

export default function BlogManager() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All status' | BlogPostStatus>('All status');
  const [categoryFilter, setCategoryFilter] = useState('All categories');
  const [posts, setPosts] = useState<BlogPostWithTags[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPostWithTags | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'delete' | 'archive' | 'publish'>('delete');
  const [actionLoading, setActionLoading] = useState(false);

  // Load posts on mount
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await getBlogPosts();
      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = useMemo(
    () =>
      posts.filter((post) => {
        const matchesSearch =
          post.title.toLowerCase().includes(search.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
          post.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
        const matchesStatus = statusFilter === 'All status' || post.status === statusFilter.toLowerCase();
        const matchesCategory = categoryFilter === 'All categories' || post.category === categoryFilter;
        return matchesSearch && matchesStatus && matchesCategory;
      }),
    [categoryFilter, posts, search, statusFilter],
  );

  const handleConfirm = async () => {
    if (!selectedPost) return;

    setActionLoading(true);
    try {
      if (dialogMode === 'delete') {
        const { error } = await deleteBlogPost(selectedPost.id);
        if (error) throw error;
        setPosts((current) => current.filter((post) => post.id !== selectedPost.id));
      } else if (dialogMode === 'archive') {
        const { error } = await unpublishBlogPost(selectedPost.id);
        if (error) throw error;
        await loadPosts(); // Reload to get updated data
      } else if (dialogMode === 'publish') {
        const { error } = await publishBlogPost(selectedPost.id);
        if (error) throw error;
        await loadPosts(); // Reload to get updated data
      }
    } catch (error) {
      console.error('Error performing action:', error);
    } finally {
      setActionLoading(false);
      setDialogOpen(false);
      setSelectedPost(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Editorial control"
        title="Blog Manager"
        description="Manage posts, track publishing status, and keep the editorial pipeline aligned with the site's tone."
        actions={
          <Button asChild className="rounded-full bg-primary hover:bg-primary/90">
            <Link to="/admin/blog/new">
              <Plus className="h-4 w-4" />
              New post
            </Link>
          </Button>
        }
      />

      <Card className="border-border/80 shadow-sm">
        <CardContent className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center">
          <div className="flex flex-1 items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search posts, excerpts, or tags..."
              className="h-auto border-0 bg-transparent px-0 py-0 shadow-none focus-visible:ring-0"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:w-[420px]">
            <div className="flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
                className="w-full bg-transparent text-sm text-foreground outline-none dark:bg-transparent"
              >
                {statuses.map((option) => (
                  <option key={option} className="bg-background text-foreground">
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3">
              <Archive className="h-4 w-4 text-muted-foreground" />
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="w-full bg-transparent text-sm text-foreground outline-none dark:bg-transparent"
              >
                {categories.map((option) => (
                  <option key={option} className="bg-background text-foreground">
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/80 shadow-sm">
        <CardContent className="overflow-x-auto p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <table className="min-w-full divide-y divide-border/70">
              <thead className="bg-muted/30 dark:bg-muted/20">
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Updated</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70 bg-card dark:bg-card/50">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="align-top hover:bg-muted/20 dark:hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-5">
                      <div className="space-y-2">
                        <p className="font-medium text-foreground">{post.title}</p>
                        <p className="max-w-xl text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-secondary dark:bg-secondary/60 px-3 py-1 text-xs font-medium text-secondary-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-foreground">{post.category}</td>
                    <td className="px-6 py-5">
                      <StatusBadge
                        status={
                          post.status === 'draft' ? 'Draft' : post.status === 'published' ? 'Published' : 'Archived'
                        }
                      />
                    </td>
                    <td className="px-6 py-5 text-sm text-muted-foreground">{formatDate(post.updated_at)}</td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-2">
                        <Button asChild variant="outline" size="sm" className="rounded-full">
                          <Link to={`/admin/blog/${post.id}/edit`}>
                            <Edit3 className="h-4 w-4" />
                            Edit
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                          onClick={() => {
                            setSelectedPost(post);
                            setDialogMode(post.status === 'published' ? 'archive' : 'publish');
                            setDialogOpen(true);
                          }}
                        >
                          <Send className="h-4 w-4" />
                          {post.status === 'published' ? 'Unpublish' : 'Publish'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-full text-rose-700 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/30 dark:hover:text-rose-300"
                          onClick={() => {
                            setSelectedPost(post);
                            setDialogMode('delete');
                            setDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredPosts.length === 0 ? (
                  <tr>
                    <td className="px-6 py-12 text-center text-sm text-muted-foreground" colSpan={5}>
                      {loading ? 'Loading posts...' : 'No posts match the current filters.'}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={
          dialogMode === 'delete'
            ? 'Delete blog post?'
            : dialogMode === 'archive'
              ? 'Unpublish this post?'
              : 'Publish this post?'
        }
        description={
          dialogMode === 'delete'
            ? 'This will soft delete the post. It can be restored later if needed.'
            : dialogMode === 'archive'
              ? 'The post will move back to draft state and disappear from the public blog.'
              : 'The post will be marked as published and become available on the public site.'
        }
        confirmLabel={dialogMode === 'delete' ? 'Delete' : dialogMode === 'archive' ? 'Unpublish' : 'Publish'}
        onConfirm={handleConfirm}
        loading={actionLoading}
      />
    </div>
  );
}
