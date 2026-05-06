import { Badge } from '@/components/ui/badge';
import BlogCard from '@/components/blog/BlogCard';
import { blogPosts } from '@/data/blogPosts';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function BlogPreviewSection() {
  return (
    <section className="section-gap bg-white">
      <div className="page-shell">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <Badge variant="soft" className="bg-secondary/80 text-primary">
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
        <div className="grid gap-5 lg:grid-cols-3">
          {blogPosts.slice(0, 3).map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
