import { ImageUp, Save, Send, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import { mockBlogPosts } from '../data/mockAdminData';
import type { BlogPost, BlogPostStatus } from '../types/admin';

const inputClassName =
  'h-11 rounded-2xl border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-mwezi-primary/15';

const emptyPost: BlogPost = {
  id: 'new',
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  category: 'Education',
  tags: [],
  featuredImage: '',
  status: 'Draft',
  author: 'Mwezi Editorial',
  createdAt: new Date().toISOString().slice(0, 10),
  updatedAt: new Date().toISOString().slice(0, 10),
  seoTitle: '',
  seoDescription: '',
};

export default function BlogPostFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const existingPost = useMemo(() => mockBlogPosts.find((post) => post.id === id) ?? null, [id]);
  const [post, setPost] = useState<BlogPost>(existingPost ?? emptyPost);
  const [tagInput, setTagInput] = useState((existingPost?.tags ?? []).join(', '));
  const [status, setStatus] = useState<BlogPostStatus>(existingPost?.status ?? 'Draft');
  const isEditing = Boolean(existingPost);

  const handleSave = (nextStatus: BlogPostStatus) => {
    setStatus(nextStatus);
    setPost((current) => ({ ...current, status: nextStatus, tags: tagInput.split(',').map((tag) => tag.trim()).filter(Boolean) }));
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={isEditing ? 'Edit post' : 'Create post'}
        title={isEditing ? 'Edit Blog Post' : 'New Blog Post'}
        description="Use text-first editing for now so the content model can later be connected to a CMS or database."
        actions={
          <>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/admin/blog">Back to blog</Link>
            </Button>
            <StatusBadge status={status} />
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <Card className="border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle>Post details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Title</label>
                <Input value={post.title} onChange={(event) => setPost({ ...post, title: event.target.value })} className={inputClassName} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Slug</label>
                <Input value={post.slug} onChange={(event) => setPost({ ...post, slug: event.target.value })} className={inputClassName} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Excerpt</label>
                <textarea
                  value={post.excerpt}
                  onChange={(event) => setPost({ ...post, excerpt: event.target.value })}
                  className="min-h-[120px] rounded-3xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-mwezi-primary/40 focus-visible:ring-2 focus-visible:ring-mwezi-primary/15"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Content</label>
                <textarea
                  value={post.content}
                  onChange={(event) => setPost({ ...post, content: event.target.value })}
                  className="min-h-[280px] rounded-3xl border border-border bg-background px-4 py-3 text-sm leading-7 text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-mwezi-primary/40 focus-visible:ring-2 focus-visible:ring-mwezi-primary/15"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/80 shadow-sm">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>SEO settings</CardTitle>
              <Sparkles className="h-5 w-5 text-mwezi-primary" />
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">SEO title</label>
                <Input value={post.seoTitle} onChange={(event) => setPost({ ...post, seoTitle: event.target.value })} className={inputClassName} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">SEO description</label>
                <textarea
                  value={post.seoDescription}
                  onChange={(event) => setPost({ ...post, seoDescription: event.target.value })}
                  className="min-h-[110px] rounded-3xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-mwezi-primary/40 focus-visible:ring-2 focus-visible:ring-mwezi-primary/15"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Category</label>
                <select
                  value={post.category}
                  onChange={(event) => setPost({ ...post, category: event.target.value })}
                  className="h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none focus-visible:border-mwezi-primary/40 focus-visible:ring-2 focus-visible:ring-mwezi-primary/15"
                >
                  {['Education', 'Lifestyle', 'Product', 'Care'].map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Tags</label>
                <Input
                  value={tagInput}
                  onChange={(event) => {
                    const nextTags = event.target.value;
                    setTagInput(nextTags);
                    setPost((current) => ({
                      ...current,
                      tags: nextTags.split(',').map((tag) => tag.trim()).filter(Boolean),
                    }));
                  }}
                  placeholder="Menstrual Cup, Comfort, Wellness"
                  className={inputClassName}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Status</label>
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value as BlogPostStatus)}
                  className="h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none focus-visible:border-mwezi-primary/40 focus-visible:ring-2 focus-visible:ring-mwezi-primary/15"
                >
                  {['Published', 'Draft', 'Archived'].map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="rounded-3xl border border-dashed border-border/80 bg-mwezi-cream p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">Featured image</p>
                    <p className="mt-1 text-xs text-muted-foreground">{post.featuredImage || 'Upload a lead image for the post.'}</p>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <ImageUp className="h-4 w-4" />
                    Upload
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle>Preview summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-3xl bg-mwezi-cream p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mwezi-deep">Slug</p>
                <p className="mt-2 text-sm text-foreground">{post.slug || 'auto-generated-slug'}</p>
              </div>
              <div className="rounded-3xl bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Tags</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(tagInput
                    .split(',')
                    .map((tag) => tag.trim())
                    .filter(Boolean) || []).map((tag) => (
                    <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                This preview keeps the editor lightweight while still representing the publishing workflow clearly.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-border/70 pt-6 sm:flex-row sm:justify-end">
        <Button variant="outline" className="rounded-full" onClick={() => handleSave('Draft')}>
          <Save className="h-4 w-4" />
          Save draft
        </Button>
        <Button className="rounded-full bg-mwezi-primary hover:bg-mwezi-deep" onClick={() => handleSave('Published')}>
          <Send className="h-4 w-4" />
          Publish post
        </Button>
      </div>
    </div>
  );
}
