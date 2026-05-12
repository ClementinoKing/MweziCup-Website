import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import BlogCard from '@/components/blog/BlogCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { getPublishedBlogPosts } from '@/services/blogService';
import type { BlogPostWithTags } from '@/types/database';

export default function BlogPreviewSection() {
  const [posts, setPosts] = useState<BlogPostWithTags[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await getPublishedBlogPosts({ limit: 3 });
      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Don't show section if no posts
  if (!loading && posts.length === 0) {
    return null;
  }

  return (
    <section className="section-gap bg-white dark:bg-background">
      <div className="page-shell">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <Badge variant="soft" className="bg-secondary/80 text-primary dark:bg-secondary/60 dark:text-primary-foreground">
              Blog
            </Badge>
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Learn more about better period care</h2>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                Helpful guides, beginner tips, and wellness education to help you feel confident with mweziCup.
              </p>
            </div>
          </div>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/blog">View all posts</Link>
          </Button>
        </div>
        {loading ? (
          <div className="grid gap-5 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 animate-pulse rounded-2xl bg-muted/30" />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
