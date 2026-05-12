import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import type { BlogPostWithTags } from '@/types/database';

type BlogCardProps = {
  post: BlogPostWithTags;
};

// Calculate reading time based on content length
function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const textContent = content.replace(/<[^>]*>/g, ''); // Strip HTML tags
  const wordCount = textContent.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min`;
}

// Format date
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function BlogCard({ post }: BlogCardProps) {
  const readingTime = calculateReadingTime(post.content);
  const formattedDate = post.published_at ? formatDate(post.published_at) : formatDate(post.created_at);

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-card transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 dark:bg-card/50"
    >
      {/* Featured Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {post.featured_image_url ? (
          <>
            <img
              src={post.featured_image_url}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
          </>
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20" />
        )}
        
        {/* Category Badge - Floating */}
        <div className="absolute left-4 top-4">
          <Badge className="rounded-full border-0 bg-white/90 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur-sm dark:bg-black/50 dark:text-primary-foreground">
            {post.category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="mb-3 text-xl font-bold leading-tight text-foreground transition-colors group-hover:text-primary sm:text-2xl">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{readingTime}</span>
            </div>
          </div>

          {/* Read More Arrow */}
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <span className="hidden sm:inline">Read</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-3xl border-2 border-transparent transition-colors group-hover:border-primary/20" />
    </Link>
  );
}
