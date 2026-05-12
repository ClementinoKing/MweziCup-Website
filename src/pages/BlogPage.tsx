import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import BlogCard from '@/components/blog/BlogCard';
import { getPublishedBlogPosts } from '@/services/blogService';
import type { BlogPostWithTags } from '@/types/database';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPostWithTags[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await getPublishedBlogPosts();
      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('Error loading blog posts:', err);
      setError('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 sm:py-24 lg:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="soft" className="mb-6 bg-primary/10 text-primary dark:bg-primary/20">
              Blog
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Guides, education, and stories for confident period care
            </h1>
            <p className="text-lg leading-8 text-muted-foreground sm:text-xl">
              Explore the latest educational articles and helpful guides for mweziCup users.
            </p>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-destructive/50 bg-destructive/10 p-8 text-center">
              <p className="text-destructive">{error}</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-2xl border border-border bg-muted/30 p-12 text-center">
              <p className="text-muted-foreground">No blog posts available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
