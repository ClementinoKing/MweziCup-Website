import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Loader2, Calendar, Clock, User as UserIcon, ArrowLeft, Share2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getBlogPostBySlug } from '@/services/blogService';
import type { BlogPostWithTags } from '@/types/database';

// Calculate reading time based on content length
function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const textContent = content.replace(/<[^>]*>/g, ''); // Strip HTML tags
  const wordCount = textContent.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

// Format date
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function BlogArticlePage() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPostWithTags | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      loadPost(slug);
    }
  }, [slug]);

  const loadPost = async (postSlug: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await getBlogPostBySlug(postSlug);
      if (error) throw error;
      if (!data) {
        setError('Post not found');
      } else {
        setPost(data);
      }
    } catch (err) {
      console.error('Error loading blog post:', err);
      setError('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <div className="page-shell py-20">
          <div className="rounded-3xl border border-border bg-card p-12 text-center">
            <h1 className="mb-4 text-3xl font-bold text-foreground">Article not found</h1>
            <p className="mb-8 text-muted-foreground">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild className="rounded-full">
              <Link to="/blog">
                <ArrowLeft className="h-4 w-4" />
                Back to blog
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const readingTime = calculateReadingTime(post.content);
  const formattedDate = post.published_at ? formatDate(post.published_at) : formatDate(post.created_at);

  return (
    <div className="min-h-screen bg-background">
      {/* Featured Image with Back Button Overlay */}
      {post.featured_image_url ? (
        <div className="relative h-[60vh] min-h-[500px] overflow-hidden bg-muted">
          <img
            src={post.featured_image_url}
            alt={post.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          
          {/* Glass Back Button - Aligned with Content Container */}
          <div className="absolute inset-x-0 top-4 sm:top-6 lg:top-8">
            <div className="page-shell">
              <Button
                asChild
                size="sm"
                className="rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:border-white/30 dark:border-white/10 dark:bg-black/20 dark:hover:bg-black/30"
              >
                <Link to="/blog">
                  <ArrowLeft className="h-4 w-4" />
                  Back to blog
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Fallback: Back button without image */}
          <div className="border-b border-border/50 bg-background">
            <div className="page-shell py-6">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="rounded-full"
              >
                <Link to="/blog">
                  <ArrowLeft className="h-4 w-4" />
                  Back to blog
                </Link>
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Article Content */}
      <article className="relative">
        <div className="page-shell">
          <div className={post.featured_image_url ? '-mt-32 relative z-10' : 'pt-12'}>
            {/* Header */}
            <header className="mb-12">
              {/* Category & Tags */}
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <Badge className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground">
                  {post.category}
                </Badge>
                {post.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="rounded-full border-border/50 bg-background/50 backdrop-blur-sm"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Title */}
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                {post.title}
              </h1>

              {/* Excerpt */}
              <p className="mb-8 text-xl leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 border-y border-border py-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <UserIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{post.author_name}</p>
                    <p className="text-xs text-muted-foreground">Author</p>
                  </div>
                </div>

                <div className="h-8 w-px bg-border" />

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{formattedDate}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{readingTime}</span>
                </div>

                <div className="ml-auto">
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </header>

            {/* Article Body */}
            <div
              className="prose prose-xl max-w-none dark:prose-invert
                prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
                prose-h1:text-4xl prose-h1:mt-12 prose-h1:mb-6
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-3
                prose-p:text-lg prose-p:leading-relaxed prose-p:text-foreground/90 prose-p:mb-6
                prose-a:text-primary prose-a:no-underline prose-a:font-medium hover:prose-a:underline
                prose-strong:text-foreground prose-strong:font-semibold
                prose-em:text-foreground/90 prose-em:italic
                prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-8
                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted/50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-foreground/80 prose-blockquote:my-8
                prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-base prose-code:text-foreground prose-code:font-mono
                prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:p-4 prose-pre:rounded-xl prose-pre:my-6
                prose-ul:list-disc prose-ul:pl-6 prose-ul:my-6 prose-ul:space-y-2
                prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-6 prose-ol:space-y-2
                prose-li:text-lg prose-li:text-foreground/90 prose-li:leading-relaxed prose-li:marker:text-primary
                prose-table:my-8 prose-table:border-collapse
                prose-th:border prose-th:border-border prose-th:bg-muted prose-th:p-3 prose-th:text-left prose-th:font-semibold
                prose-td:border prose-td:border-border prose-td:p-3
                prose-hr:border-border prose-hr:my-12"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Footer */}
            <footer className="mt-16 border-t border-border pt-12 pb-20">
              <div className="flex flex-col items-center gap-6 text-center">
                <p className="text-lg text-muted-foreground">
                  Want to read more articles like this?
                </p>
                <Button asChild size="lg" className="rounded-full">
                  <Link to="/blog">
                    Explore all articles
                  </Link>
                </Button>
              </div>
            </footer>
          </div>
        </div>
      </article>
    </div>
  );
}
