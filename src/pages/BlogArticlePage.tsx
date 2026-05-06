import { Link, useParams } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getBlogPostBySlug } from '@/data/blogPosts';

export default function BlogArticlePage() {
  const { slug } = useParams();
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return (
      <section className="section-gap">
        <div className="page-shell">
          <Card className="border-border/70 bg-white/90 p-8">
            <PageHeader
              eyebrow="Article not found"
              title="This blog article is not available yet."
              subtitle="Return to the blog listing to browse the available educational placeholder posts."
            />
            <div className="mt-8">
              <Button asChild className="rounded-full">
                <Link to="/blog">Back to blog</Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="section-gap">
      <div className="page-shell">
        <article className="mx-auto max-w-4xl">
          <Card className="overflow-hidden border-border/70 bg-white/90">
            <div className="h-56 bg-mwezi-hero" />
            <CardContent className="space-y-8 p-6 sm:p-8 lg:p-10">
              <div className="space-y-4">
                <Badge variant="soft" className="bg-secondary/80 text-primary w-fit">
                  {post.category}
                </Badge>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{post.title}</h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span>{post.author}</span>
                  <span>•</span>
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readingTime}</span>
                </div>
              </div>
              <div className="space-y-6 text-base leading-8 text-foreground">
                {post.content.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div>
                <Button asChild variant="outline" className="rounded-full">
                  <Link to="/blog">Back to blog</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </article>
      </div>
    </section>
  );
}
