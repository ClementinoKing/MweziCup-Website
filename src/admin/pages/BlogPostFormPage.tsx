import { Eye, FileText, Save, Send, User, Tag, Calendar, Image as ImageIcon, Loader2, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/quill-custom.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FileUpload } from '@/components/ui/file-upload';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import type { UploadResult } from '@/lib/storage';
import {
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  publishBlogPost,
  generateSlug,
} from '@/services/blogService';
import type { BlogPostWithTags, BlogPostStatus } from '@/types/database';

const inputClassName =
  'h-11 rounded-2xl border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-mwezi-primary/15';

type FormData = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  featured_image_url: string;
  author_name: string;
  seo_title: string;
  seo_description: string;
  status: BlogPostStatus;
};

const emptyForm: FormData = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  category: 'Education',
  featured_image_url: '',
  author_name: 'Mwezi Editorial',
  seo_title: '',
  seo_description: '',
  status: 'draft',
};

// Quill editor modules configuration
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['link', 'image', 'video'],
    ['blockquote', 'code-block'],
    [{ color: [] }, { background: [] }],
    ['clean'],
  ],
};

const quillFormats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'bullet',
  'align',
  'link',
  'image',
  'video',
  'blockquote',
  'code-block',
  'color',
  'background',
];

export default function BlogPostFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id && id !== 'new');

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [error, setError] = useState<string | null>(null);

  // Load existing post if editing
  useEffect(() => {
    if (isEditing && id) {
      loadPost(id);
    }
  }, [id, isEditing]);

  const loadPost = async (postId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await getBlogPostById(postId);
      if (error) throw error;
      if (data) {
        setFormData({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt,
          content: data.content,
          category: data.category,
          featured_image_url: data.featured_image_url,
          author_name: data.author_name,
          seo_title: data.seo_title,
          seo_description: data.seo_description,
          status: data.status,
        });
        setTags(data.tags || []);
      }
    } catch (err) {
      console.error('Error loading post:', err);
      setError('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (shouldPublish: boolean = false) => {
    setSaving(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.excerpt.trim()) {
        throw new Error('Excerpt is required');
      }
      if (!formData.content.trim()) {
        throw new Error('Content is required');
      }
      if (!formData.featured_image_url.trim()) {
        throw new Error('Featured image is required');
      }

      // Generate slug if empty
      const slug = formData.slug || generateSlug(formData.title);

      // Auto-generate SEO fields if empty
      const seoTitle = formData.seo_title || formData.title;
      const seoDescription = formData.seo_description || formData.excerpt;

      const postData = {
        ...formData,
        slug,
        seo_title: seoTitle,
        seo_description: seoDescription,
      };

      if (isEditing && id) {
        // Update existing post
        const { error } = await updateBlogPost(id, postData, tags);
        if (error) throw error;

        // Publish if requested
        if (shouldPublish && formData.status !== 'published') {
          const { error: publishError } = await publishBlogPost(id);
          if (publishError) throw publishError;
        }
      } else {
        // Create new post
        const { data, error } = await createBlogPost(postData, tags);
        if (error) throw error;

        // Publish if requested
        if (shouldPublish && data) {
          const { error: publishError } = await publishBlogPost(data.id);
          if (publishError) throw publishError;
        }

        // Navigate to edit page for the new post
        if (data) {
          navigate(`/admin/blog/${data.id}/edit`, { replace: true });
        }
      }

      // Success - navigate back to blog list
      navigate('/admin/blog');
    } catch (err) {
      console.error('Error saving post:', err);
      setError(err instanceof Error ? err.message : 'Failed to save blog post');
    } finally {
      setSaving(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    setFormData({ ...formData, title });
    if (!isEditing) {
      setFormData((prev) => ({ ...prev, slug: generateSlug(title) }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditing ? 'Edit Blog Post' : 'New Blog Post'}
        description="Create and manage your blog posts"
        actions={
          <div className="flex gap-3">
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/admin/blog">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => handleSave(false)}
              disabled={saving}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Draft
            </Button>
            <Button
              className="rounded-full bg-primary hover:bg-primary/90"
              onClick={() => handleSave(true)}
              disabled={saving}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Publish
            </Button>
          </div>
        }
      />

      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="p-4">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Edit/Preview Toggle */}
      <div className="flex gap-2">
        <Button
          variant={viewMode === 'edit' ? 'default' : 'outline'}
          className="rounded-full"
          onClick={() => setViewMode('edit')}
        >
          <FileText className="h-4 w-4" />
          Edit
        </Button>
        <Button
          variant={viewMode === 'preview' ? 'default' : 'outline'}
          className="rounded-full"
          onClick={() => setViewMode('preview')}
        >
          <Eye className="h-4 w-4" />
          Preview
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Main Content Area */}
        <div className="space-y-6">
          {viewMode === 'edit' ? (
            <>
              <Card className="border-border/80 shadow-sm">
                <CardHeader>
                  <CardTitle>Post Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Title *</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Enter post title..."
                      className={inputClassName}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Slug</label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="auto-generated-from-title"
                      className={inputClassName}
                    />
                    <p className="text-xs text-muted-foreground">
                      URL: /blog/{formData.slug || 'post-slug'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Excerpt *</label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="Brief description of the post..."
                      className="min-h-[100px] w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/15"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Content *</label>
                    <div className="rounded-2xl border border-border bg-background overflow-hidden">
                      <ReactQuill
                        theme="snow"
                        value={formData.content}
                        onChange={(value) => setFormData({ ...formData, content: value })}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="Write your post content here..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/80 shadow-sm">
                <CardHeader>
                  <CardTitle>SEO Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">SEO Title</label>
                    <Input
                      value={formData.seo_title}
                      onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                      placeholder={formData.title || 'Will use post title'}
                      className={inputClassName}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">SEO Description</label>
                    <textarea
                      value={formData.seo_description}
                      onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                      placeholder={formData.excerpt || 'Will use post excerpt'}
                      className="min-h-[80px] w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/15"
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="border-border/80 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">{formData.title || 'Untitled Post'}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{formData.author_name}</span>
                  <span>•</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{
                    __html: formData.content || '<p class="text-muted-foreground">No content yet...</p>',
                  }}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Post Settings */}
        <div className="space-y-6">
          <Card className="border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle>Post Settings</CardTitle>
              <p className="text-sm text-muted-foreground">Manage post metadata and settings</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Author
                </label>
                <Input
                  value={formData.author_name}
                  onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                  placeholder="Author name"
                  className="h-10 rounded-xl border-border bg-muted/30 dark:bg-muted/20"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="h-10 w-full rounded-xl border border-border bg-muted/30 dark:bg-muted/20 px-3 text-sm text-foreground outline-none focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/15"
                >
                  {['Education', 'Lifestyle', 'Product', 'Care'].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  Tags
                </label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Add a tag..."
                    className="h-10 flex-1 rounded-xl border-border bg-muted/30 dark:bg-muted/20"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={handleAddTag} className="rounded-xl">
                    Add
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full bg-secondary dark:bg-secondary/60 px-3 py-1 text-xs font-medium text-secondary-foreground"
                      >
                        {tag}
                        <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-destructive">
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  Featured Image *
                </label>
                <FileUpload
                  bucket="media"
                  folder="blog"
                  currentUrl={formData.featured_image_url}
                  onUploadComplete={(result: UploadResult) => {
                    setFormData({ ...formData, featured_image_url: result.url });
                  }}
                  onUploadError={(error: string) => {
                    console.error('Upload error:', error);
                    setError(error);
                  }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Status</label>
                <div className="rounded-xl bg-muted/30 dark:bg-muted/20 p-3">
                  <StatusBadge status={formData.status === 'draft' ? 'Draft' : formData.status === 'published' ? 'Published' : 'Archived'} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
