// Database types for Supabase tables

export type BlogPostStatus = 'draft' | 'published' | 'archived';
export type ContactMessageStatus = 'new' | 'read' | 'replied' | 'archived';
export type NewsletterSubscriberStatus = 'active' | 'unsubscribed' | 'bounced';

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
      contact_messages: {
        Row: {
          id: string;
          site_key: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          status: ContactMessageStatus;
          received_at: string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          site_key?: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          status?: ContactMessageStatus;
          received_at?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          site_key?: string;
          name?: string;
          email?: string;
          subject?: string;
          message?: string;
          status?: ContactMessageStatus;
          received_at?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          site_key: string;
          email: string;
          status: NewsletterSubscriberStatus;
          subscription_date: string;
          unsubscribed_at: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          site_key?: string;
          email: string;
          status?: NewsletterSubscriberStatus;
          subscription_date?: string;
          unsubscribed_at?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          site_key?: string;
          email?: string;
          status?: NewsletterSubscriberStatus;
          subscription_date?: string;
          unsubscribed_at?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      media_items: {
        Row: {
          id: string;
          site_key: string;
          file_name: string;
          file_path: string;
          file_size: number;
          mime_type: string;
          alt_text: string | null;
          caption: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          site_key?: string;
          file_name: string;
          file_path: string;
          file_size: number;
          mime_type: string;
          alt_text?: string | null;
          caption?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          site_key?: string;
          file_name?: string;
          file_path?: string;
          file_size?: number;
          mime_type?: string;
          alt_text?: string | null;
          caption?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
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

export type ContactMessage = Database['public']['Tables']['contact_messages']['Row'];
export type ContactMessageInsert = Database['public']['Tables']['contact_messages']['Insert'];
export type ContactMessageUpdate = Database['public']['Tables']['contact_messages']['Update'];

export type NewsletterSubscriber = Database['public']['Tables']['newsletter_subscribers']['Row'];
export type NewsletterSubscriberInsert = Database['public']['Tables']['newsletter_subscribers']['Insert'];
export type NewsletterSubscriberUpdate = Database['public']['Tables']['newsletter_subscribers']['Update'];

export type MediaItem = Database['public']['Tables']['media_items']['Row'];
export type MediaItemInsert = Database['public']['Tables']['media_items']['Insert'];
export type MediaItemUpdate = Database['public']['Tables']['media_items']['Update'];

// Extended type with tags
export type BlogPostWithTags = BlogPost & {
  tags: string[];
};
