import { useEffect, useState } from 'react';
import { Loader2, Search, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import BlogCard from '@/components/blog/BlogCard';
import { getPublishedBlogPosts } from '@/services/blogService';
import type { BlogPostWithTags } from '@/types/database';

const categories = ['All Categories', 'Education', 'Lifestyle', 'Product', 'Care'];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPostWithTags[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

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

  // Filter posts based on search and category
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All Categories' || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Smaller */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 sm:py-16 lg:py-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="soft" className="mb-4 bg-primary/10 text-primary dark:bg-primary/20">
              Blog
            </Badge>
            <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Guides, education, and stories for confident period care
            </h1>
            <p className="text-base leading-7 text-muted-foreground sm:text-lg">
              Explore the latest educational articles and helpful guides for mweziCup users.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="bg-background/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search articles, topics, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 rounded-full border-border bg-background pl-11 pr-4 focus-visible:ring-primary/20"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground sm:hidden" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-11 rounded-full border border-border bg-background px-4 pr-10 text-sm font-medium text-foreground outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 sm:min-w-[180px]"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchQuery || selectedCategory !== 'All Categories') && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchQuery && (
                <Badge
                  variant="outline"
                  className="rounded-full cursor-pointer hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
                  onClick={() => setSearchQuery('')}
                >
                  Search: "{searchQuery}"
                  <span className="ml-1">×</span>
                </Badge>
              )}
              {selectedCategory !== 'All Categories' && (
                <Badge
                  variant="outline"
                  className="rounded-full cursor-pointer hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
                  onClick={() => setSelectedCategory('All Categories')}
                >
                  {selectedCategory}
                  <span className="ml-1">×</span>
                </Badge>
              )}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All Categories');
                }}
                className="text-sm text-primary hover:underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-destructive/50 bg-destructive/10 p-8 text-center">
              <p className="text-destructive">{error}</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="rounded-2xl border border-border bg-muted/30 p-12 text-center">
              <p className="text-lg font-medium text-foreground mb-2">No articles found</p>
              <p className="text-muted-foreground">
                {searchQuery || selectedCategory !== 'All Categories'
                  ? 'Try adjusting your search or filters'
                  : 'No blog posts available yet. Check back soon!'}
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
                </p>
              </div>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
