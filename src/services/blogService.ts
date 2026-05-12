import { supabase } from '@/lib/supabase';
import type {
  BlogPost,
  BlogPostInsert,
  BlogPostUpdate,
  BlogPostWithTags,
  BlogPostTagInsert,
  BlogPostStatus,
} from '@/types/database';

/**
 * Generate a URL-friendly slug from a title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Fetch all blog posts with tags
 */
export async function getBlogPosts(options?: {
  status?: BlogPostStatus;
  category?: string;
  limit?: number;
  offset?: number;
}) {
  try {
    let query = supabase
      .from('blog_posts')
      .select('*, blog_post_tags(tag, sort_order)')
      .is('deleted_at', null)
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false });

    if (options?.status) {
      query = query.eq('status', options.status);
    }

    if (options?.category) {
      query = query.eq('category', options.category);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Transform data to include tags as array
    const posts: BlogPostWithTags[] = (data || []).map((post: any) => ({
      ...post,
      tags: (post.blog_post_tags || [])
        .sort((a: any, b: any) => a.sort_order - b.sort_order)
        .map((t: any) => t.tag),
      blog_post_tags: undefined,
    }));

    return { data: posts, error: null };
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return { data: null, error };
  }
}

/**
 * Fetch published blog posts for public display
 */
export async function getPublishedBlogPosts(options?: {
  category?: string;
  limit?: number;
  offset?: number;
}) {
  return getBlogPosts({
    ...options,
    status: 'published',
  });
}

/**
 * Fetch a single blog post by ID
 */
export async function getBlogPostById(id: string) {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*, blog_post_tags(tag, sort_order)')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) throw error;

    const post: BlogPostWithTags = {
      ...data,
      tags: (data.blog_post_tags || [])
        .sort((a: any, b: any) => a.sort_order - b.sort_order)
        .map((t: any) => t.tag),
    };

    return { data: post, error: null };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return { data: null, error };
  }
}

/**
 * Fetch a single blog post by slug
 */
export async function getBlogPostBySlug(slug: string) {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*, blog_post_tags(tag, sort_order)')
      .eq('slug', slug)
      .eq('status', 'published')
      .is('deleted_at', null)
      .single();

    if (error) throw error;

    const post: BlogPostWithTags = {
      ...data,
      tags: (data.blog_post_tags || [])
        .sort((a: any, b: any) => a.sort_order - b.sort_order)
        .map((t: any) => t.tag),
    };

    return { data: post, error: null };
  } catch (error) {
    console.error('Error fetching blog post by slug:', error);
    return { data: null, error };
  }
}

/**
 * Create a new blog post with tags
 */
export async function createBlogPost(
  post: Omit<BlogPostInsert, 'id' | 'created_at' | 'updated_at'>,
  tags: string[]
) {
  try {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Insert blog post
    const { data: newPost, error: postError } = await supabase
      .from('blog_posts')
      .insert({
        ...post,
        author_id: user.id,
        created_by: user.id,
        updated_by: user.id,
      })
      .select()
      .single();

    if (postError) throw postError;

    // Insert tags
    if (tags.length > 0) {
      const tagInserts: BlogPostTagInsert[] = tags.map((tag, index) => ({
        blog_post_id: newPost.id,
        tag: tag.trim(),
        sort_order: index + 1,
      }));

      const { error: tagsError } = await supabase.from('blog_post_tags').insert(tagInserts);

      if (tagsError) throw tagsError;
    }

    return { data: newPost, error: null };
  } catch (error) {
    console.error('Error creating blog post:', error);
    return { data: null, error };
  }
}

/**
 * Update an existing blog post
 */
export async function updateBlogPost(
  id: string,
  post: BlogPostUpdate,
  tags?: string[]
) {
  try {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Update blog post
    const { data: updatedPost, error: postError } = await supabase
      .from('blog_posts')
      .update({
        ...post,
        updated_by: user.id,
      })
      .eq('id', id)
      .select()
      .single();

    if (postError) throw postError;

    // Update tags if provided
    if (tags !== undefined) {
      // Delete existing tags
      const { error: deleteError } = await supabase
        .from('blog_post_tags')
        .delete()
        .eq('blog_post_id', id);

      if (deleteError) throw deleteError;

      // Insert new tags
      if (tags.length > 0) {
        const tagInserts: BlogPostTagInsert[] = tags.map((tag, index) => ({
          blog_post_id: id,
          tag: tag.trim(),
          sort_order: index + 1,
        }));

        const { error: tagsError } = await supabase.from('blog_post_tags').insert(tagInserts);

        if (tagsError) throw tagsError;
      }
    }

    return { data: updatedPost, error: null };
  } catch (error) {
    console.error('Error updating blog post:', error);
    return { data: null, error };
  }
}

/**
 * Delete a blog post (soft delete)
 */
export async function deleteBlogPost(id: string) {
  try {
    const { error } = await supabase
      .from('blog_posts')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return { error };
  }
}

/**
 * Permanently delete a blog post
 */
export async function permanentlyDeleteBlogPost(id: string) {
  try {
    // Tags will be deleted automatically due to CASCADE
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error('Error permanently deleting blog post:', error);
    return { error };
  }
}

/**
 * Publish a blog post
 */
export async function publishBlogPost(id: string) {
  return updateBlogPost(id, {
    status: 'published',
    published_at: new Date().toISOString(),
  });
}

/**
 * Unpublish a blog post
 */
export async function unpublishBlogPost(id: string) {
  return updateBlogPost(id, {
    status: 'draft',
  });
}

/**
 * Archive a blog post
 */
export async function archiveBlogPost(id: string) {
  return updateBlogPost(id, {
    status: 'archived',
  });
}

/**
 * Search blog posts
 */
export async function searchBlogPosts(query: string, options?: { status?: BlogPostStatus }) {
  try {
    let dbQuery = supabase
      .from('blog_posts')
      .select('*, blog_post_tags(tag, sort_order)')
      .is('deleted_at', null)
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
      .order('published_at', { ascending: false, nullsFirst: false });

    if (options?.status) {
      dbQuery = dbQuery.eq('status', options.status);
    }

    const { data, error } = await dbQuery;

    if (error) throw error;

    const posts: BlogPostWithTags[] = (data || []).map((post: any) => ({
      ...post,
      tags: (post.blog_post_tags || [])
        .sort((a: any, b: any) => a.sort_order - b.sort_order)
        .map((t: any) => t.tag),
    }));

    return { data: posts, error: null };
  } catch (error) {
    console.error('Error searching blog posts:', error);
    return { data: null, error };
  }
}
