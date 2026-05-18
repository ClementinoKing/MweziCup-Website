import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Loader2, Calendar, Clock, User as UserIcon, ArrowLeft, Share2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Seo from '@/components/seo/Seo';
import { getSiteUrl } from '@/lib/site';
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
  const canonicalPath = `/blog/${post.slug}`;
  const seoTitle = post.seo_title || post.title;
  const seoDescription = post.seo_description || post.excerpt;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: seoDescription,
    image: post.featured_image_url ? getSiteUrl(post.featured_image_url) : getSiteUrl('/img/Mwezi%20hero%20image.png'),
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Person',
      name: post.author_name,
    },
    mainEntityOfPage: getSiteUrl(canonicalPath),
    keywords: post.tags,
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={seoTitle}
        description={seoDescription}
        path={canonicalPath}
        type="article"
        image={post.featured_image_url || '/img/Mwezi hero image.png'}
        keywords={[post.category, ...post.tags]}
        schema={schema}
      />
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
                prose-h1:text-5xl prose-h1:mt-12 prose-h1:mb-6
                prose-h2:text-4xl prose-h2:mt-10 prose-h2:mb-5
                prose-h3:text-3xl prose-h3:mt-8 prose-h3:mb-4
                prose-h4:text-2xl prose-h4:mt-6 prose-h4:mb-3
                prose-p:text-xl prose-p:leading-relaxed prose-p:text-foreground/90 prose-p:mb-6
                prose-a:text-primary prose-a:no-underline prose-a:font-medium hover:prose-a:underline hover:prose-a:text-primary/80
                prose-strong:text-foreground prose-strong:font-bold
                prose-em:text-foreground/90 prose-em:italic
                prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-8 prose-img:w-full
                prose-blockquote:relative prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-gradient-to-r prose-blockquote:from-mwezi-cream/50 prose-blockquote:to-transparent prose-blockquote:py-6 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl prose-blockquote:italic prose-blockquote:text-foreground prose-blockquote:my-8 prose-blockquote:font-medium prose-blockquote:text-2xl prose-blockquote:leading-relaxed
                before:prose-blockquote:content-['\201C'] before:prose-blockquote:absolute before:prose-blockquote:text-6xl before:prose-blockquote:text-primary/20 before:prose-blockquote:font-serif before:prose-blockquote:-top-2 before:prose-blockquote:left-4
                after:prose-blockquote:content-['\201D'] after:prose-blockquote:absolute after:prose-blockquote:text-6xl after:prose-blockquote:text-primary/20 after:prose-blockquote:font-serif after:prose-blockquote:-bottom-8 after:prose-blockquote:right-4
                prose-blockquote>p:relative prose-blockquote>p:z-10
                prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-base prose-code:text-foreground prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:p-4 prose-pre:rounded-xl prose-pre:my-6 prose-pre:overflow-x-auto
                prose-ul:list-inside prose-ul:my-6 prose-ul:space-y-3
                prose-ol:list-inside prose-ol:my-6 prose-ol:space-y-3
                prose-li:text-xl prose-li:text-foreground/90 prose-li:leading-relaxed prose-li:marker:text-primary prose-li:marker:font-bold
                prose-li>p:inline
                prose-table:my-8 prose-table:border-collapse prose-table:w-full
                prose-th:border prose-th:border-border prose-th:bg-muted prose-th:p-3 prose-th:text-left prose-th:font-semibold prose-th:text-foreground prose-th:text-lg
                prose-td:border prose-td:border-border prose-td:p-3 prose-td:text-foreground/90 prose-td:text-lg
                prose-hr:border-border prose-hr:my-12
                [&_.ql-align-center]:text-center
                [&_.ql-align-right]:text-right
                [&_.ql-align-justify]:text-justify
                [&_.ql-indent-1]:ml-8
                [&_.ql-indent-2]:ml-16
                [&_.ql-indent-3]:ml-24
                [&_.ql-indent-4]:ml-32
                [&_.ql-indent-5]:ml-40
                [&_.ql-indent-6]:ml-48
                [&_.ql-indent-7]:ml-56
                [&_.ql-indent-8]:ml-64
                [&_ul]:list-disc [&_ul]:list-inside
                [&_ol]:list-decimal [&_ol]:list-inside
                [&_ul_ul]:list-circle [&_ul_ul]:ml-6
                [&_ul_ul_ul]:list-square [&_ul_ul_ul]:ml-6
                [&_ol_ol]:list-[lower-alpha] [&_ol_ol]:ml-6
                [&_ol_ol_ol]:list-[lower-roman] [&_ol_ol_ol]:ml-6
                [&_s]:line-through
                [&_u]:underline
                [&_sub]:align-sub [&_sub]:text-xs
                [&_sup]:align-super [&_sup]:text-xs
                [&_.ql-video]:aspect-video [&_.ql-video]:w-full [&_.ql-video]:rounded-2xl [&_.ql-video]:my-8
                [&_iframe]:aspect-video [&_iframe]:w-full [&_iframe]:rounded-2xl [&_iframe]:my-8
                [&_.ql-syntax]:bg-muted [&_.ql-syntax]:p-4 [&_.ql-syntax]:rounded-xl [&_.ql-syntax]:my-6 [&_.ql-syntax]:overflow-x-auto [&_.ql-syntax]:font-mono [&_.ql-syntax]:text-sm
                [&_.ql-font-serif]:font-serif
                [&_.ql-font-monospace]:font-mono
                [&_.ql-size-small]:text-base
                [&_.ql-size-large]:text-2xl
                [&_.ql-size-huge]:text-3xl
                [&_blockquote]:relative [&_blockquote]:pl-12
                [&_blockquote:before]:content-['\201C'] [&_blockquote:before]:absolute [&_blockquote:before]:text-6xl [&_blockquote:before]:text-primary/20 [&_blockquote:before]:font-serif [&_blockquote:before]:-top-2 [&_blockquote:before]:left-2
                [&_blockquote:after]:content-['\201D'] [&_blockquote:after]:absolute [&_blockquote:after]:text-6xl [&_blockquote:after]:text-primary/20 [&_blockquote:after]:font-serif [&_blockquote:after]:-bottom-8 [&_blockquote:after]:right-4"
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
