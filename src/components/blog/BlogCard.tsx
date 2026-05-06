import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { BlogPost } from '@/data/blogPosts';
import { getBlogPostPath } from '@/data/blogPosts';

type BlogCardProps = {
  post: BlogPost;
};

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Card className="group overflow-hidden border-border/80 bg-white/90 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-glow">
      <div className="h-36 bg-mwezi-hero px-6 py-5">
        <div className="flex h-full items-end justify-between gap-4">
          <Badge variant="accent" className="bg-primary/10 text-primary">
            {post.category}
          </Badge>
          <div className="h-12 w-12 rounded-full border border-white/70 bg-white/40 backdrop-blur" />
        </div>
      </div>
      <CardHeader className="space-y-3">
        <CardTitle className="text-xl leading-7">{post.title}</CardTitle>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{post.date}</span>
          <span>•</span>
          <span>{post.readingTime}</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="ghost" className="group/btn rounded-full px-0 text-primary hover:bg-transparent hover:text-mwezi-deep">
          <Link to={getBlogPostPath(post.slug)}>
            Read article
            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
