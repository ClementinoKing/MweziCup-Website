// Database types for Supabase tables

export type BlogPostStatus = 'draft' | 'published' | 'archived';

export type Database = {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          id: string;
          site_key: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          category: string;
          featured_image_url: string;
          status: BlogPostStatus;
          author_id: string | null;
          author_name: string;
          seo_title: string;
          seo_description: string;
          published_at: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          site_key?: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          category: string;
          featured_image_url: string;
          status?: BlogPostStatus;
          author_id?: string | null;
          author_name: string;
          seo_title: string;
          seo_description: string;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          site_key?: string;
          title?: string;
          slug?: string;
          excerpt?: string;
          content?: string;
          category?: string;
          featured_image_url?: string;
          status?: BlogPostStatus;
          author_id?: string | null;
          author_name?: string;
          seo_title?: string;
          seo_description?: string;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
          deleted_at?: string | null;
        };
      };
      blog_post_tags: {
        Row: {
          id: string;
          blog_post_id: string;
          tag: string;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          blog_post_id: string;
          tag: string;
          sort_order: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          blog_post_id?: string;
          tag?: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};

// Convenience types
export type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
export type BlogPostInsert = Database['public']['Tables']['blog_posts']['Insert'];
export type BlogPostUpdate = Database['public']['Tables']['blog_posts']['Update'];
export type BlogPostTag = Database['public']['Tables']['blog_post_tags']['Row'];
export type BlogPostTagInsert = Database['public']['Tables']['blog_post_tags']['Insert'];

// Extended type with tags
export type BlogPostWithTags = BlogPost & {
  tags: string[];
};
