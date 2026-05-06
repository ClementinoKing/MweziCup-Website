import PageHeader from '@/components/layout/PageHeader';
import BlogCard from '@/components/blog/BlogCard';
import { blogPosts } from '@/data/blogPosts';

export default function BlogPage() {
  return (
    <section className="section-gap">
      <div className="page-shell space-y-10">
        <PageHeader
          eyebrow="Blog"
          title="Guides, education, and stories for confident period care."
          subtitle="Explore the latest educational placeholder articles and helpful guides for mweziCup users."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {blogPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
