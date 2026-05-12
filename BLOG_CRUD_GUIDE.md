# Blog CRUD Operations Guide

Complete implementation of blog post management system with Supabase backend.

## Overview

The blog system includes:
- **Admin Panel**: Full CRUD operations for managing blog posts
- **Public Pages**: Display published posts to all visitors (no login required)
- **Rich Text Editor**: WYSIWYG editor with formatting options
- **Image Upload**: Integrated with Supabase Storage
- **Tags System**: Multi-tag support for categorization
- **SEO Fields**: Title and description optimization

## Database Schema

### Tables

#### `blog_posts`
Main table for blog posts with the following fields:
- `id` (uuid, primary key)
- `site_key` (text, default: 'default')
- `title` (text, required)
- `slug` (text, required, unique per site)
- `excerpt` (text, required)
- `content` (text, required - HTML content)
- `category` (text, required)
- `featured_image_url` (text, required)
- `status` (enum: 'draft', 'published', 'archived')
- `author_id` (uuid, foreign key to auth.users)
- `author_name` (text, required)
- `seo_title` (text)
- `seo_description` (text)
- `published_at` (timestamp)
- `created_at` (timestamp)
- `updated_at` (timestamp)
- `created_by` (uuid, foreign key to auth.users)
- `updated_by` (uuid, foreign key to auth.users)
- `deleted_at` (timestamp, for soft deletes)

#### `blog_post_tags`
Tags associated with blog posts:
- `id` (uuid, primary key)
- `blog_post_id` (uuid, foreign key to blog_posts)
- `tag` (text, required)
- `sort_order` (smallint, required)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Indexes
- `blog_posts_site_key_idx` - Fast filtering by site
- `blog_posts_status_idx` - Fast filtering by status
- `blog_posts_category_idx` - Fast filtering by category
- `blog_posts_published_at_idx` - Sorted by publish date
- `blog_posts_site_slug_unique` - Unique slug per site
- `blog_post_tags_blog_post_id_idx` - Fast tag lookups
- `blog_post_tags_post_sort_unique` - Unique sort order per post

## File Structure

```
src/
├── types/
│   └── database.ts              # TypeScript types for Supabase tables
├── services/
│   └── blogService.ts           # Blog CRUD operations
├── lib/
│   ├── supabase.ts             # Supabase client (typed)
│   └── storage.ts              # File upload utilities
├── admin/
│   └── pages/
│       ├── BlogManager.tsx      # List/manage all posts
│       └── BlogPostFormPage.tsx # Create/edit posts
├── pages/
│   ├── BlogPage.tsx            # Public blog listing
│   └── BlogArticlePage.tsx     # Public single post view
└── components/
    ├── blog/
    │   └── BlogCard.tsx        # Blog post card component
    └── home/
        └── BlogPreviewSection.tsx # Homepage blog preview
```

## API Functions

### `blogService.ts`

#### Read Operations
```typescript
// Get all posts (with optional filters)
getBlogPosts(options?: {
  status?: BlogPostStatus;
  category?: string;
  limit?: number;
  offset?: number;
})

// Get published posts only (for public display)
getPublishedBlogPosts(options?: {
  category?: string;
  limit?: number;
  offset?: number;
})

// Get single post by ID
getBlogPostById(id: string)

// Get single post by slug (for public URLs)
getBlogPostBySlug(slug: string)

// Search posts
searchBlogPosts(query: string, options?: { status?: BlogPostStatus })
```

#### Write Operations
```typescript
// Create new post
createBlogPost(
  post: BlogPostInsert,
  tags: string[]
)

// Update existing post
updateBlogPost(
  id: string,
  post: BlogPostUpdate,
  tags?: string[]
)

// Delete post (soft delete)
deleteBlogPost(id: string)

// Permanently delete post
permanentlyDeleteBlogPost(id: string)

// Publish a post
publishBlogPost(id: string)

// Unpublish a post
unpublishBlogPost(id: string)

// Archive a post
archiveBlogPost(id: string)
```

#### Utility Functions
```typescript
// Generate URL-friendly slug from title
generateSlug(title: string): string
```

## Admin Panel Usage

### Creating a New Post

1. Navigate to `/admin/blog`
2. Click "New post" button
3. Fill in the required fields:
   - **Title** (required) - Auto-generates slug
   - **Excerpt** (required) - Brief description
   - **Content** (required) - Use WYSIWYG editor
   - **Featured Image** (required) - Upload or provide URL
   - **Category** - Select from dropdown
   - **Tags** - Add multiple tags
   - **Author** - Author name
   - **SEO fields** - Optional, auto-filled from title/excerpt

4. Click "Save Draft" or "Publish"

### Editing a Post

1. Navigate to `/admin/blog`
2. Click "Edit" on any post
3. Make changes
4. Click "Save Draft" or "Publish"

### Managing Posts

From `/admin/blog` you can:
- **Search** - Search by title, excerpt, or tags
- **Filter** - By status (Published/Draft/Archived) or category
- **Publish/Unpublish** - Change post status
- **Delete** - Soft delete posts (can be restored)

## Public Pages

### Blog Listing (`/blog`)

- Shows all **published** posts only
- No authentication required
- Displays:
  - Featured image
  - Title
  - Excerpt
  - Category badge
  - Publish date
  - Reading time (auto-calculated)
- Click any post to view full article

### Single Post (`/blog/:slug`)

- Shows full post content
- No authentication required
- Displays:
  - Featured image
  - Title and excerpt
  - Author name
  - Publish date
  - Reading time
  - Category and tags
  - Full HTML content (rendered safely)
- "Back to blog" button

### Homepage Preview

- Shows latest 3 published posts
- Automatically hidden if no posts exist
- Links to full blog page

## Features

### Auto-Generated Fields

- **Slug**: Auto-generated from title (can be customized)
- **Reading Time**: Calculated from content length
- **SEO Title**: Defaults to post title if not provided
- **SEO Description**: Defaults to excerpt if not provided
- **Published Date**: Set automatically when publishing

### Rich Text Editor

Supports:
- Headers (H1, H2, H3)
- Text formatting (bold, italic, underline, strikethrough)
- Lists (ordered, bullet)
- Text alignment
- Links, images, videos
- Blockquotes and code blocks
- Text and background colors
- Dark mode support

### Image Upload

- Drag & drop or click to browse
- Automatic upload to Supabase Storage
- Image preview
- Validation (file type, size)
- Stored in `media/blog/` folder

### Tags System

- Add multiple tags per post
- Tags stored in separate table with sort order
- Displayed on cards and article pages
- Can be used for filtering (future enhancement)

## Security

### Row Level Security (RLS)

You'll need to set up RLS policies in Supabase:

```sql
-- Allow public read access to published posts
CREATE POLICY "Public can view published posts"
ON blog_posts FOR SELECT
TO public
USING (status = 'published' AND deleted_at IS NULL);

-- Allow authenticated users to view all posts
CREATE POLICY "Authenticated users can view all posts"
ON blog_posts FOR SELECT
TO authenticated
USING (deleted_at IS NULL);

-- Allow authenticated users to create posts
CREATE POLICY "Authenticated users can create posts"
ON blog_posts FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update posts
CREATE POLICY "Authenticated users can update posts"
ON blog_posts FOR UPDATE
TO authenticated
USING (true);

-- Allow authenticated users to delete posts
CREATE POLICY "Authenticated users can delete posts"
ON blog_posts FOR DELETE
TO authenticated
USING (true);

-- Tags policies (cascade with blog_posts)
CREATE POLICY "Public can view tags for published posts"
ON blog_post_tags FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM blog_posts
    WHERE blog_posts.id = blog_post_tags.blog_post_id
    AND blog_posts.status = 'published'
    AND blog_posts.deleted_at IS NULL
  )
);

CREATE POLICY "Authenticated users can manage tags"
ON blog_post_tags FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
```

## Testing

### Test the Admin Panel

1. **Create a post**:
   ```
   - Go to http://localhost:5173/admin/login
   - Login with admin credentials
   - Navigate to http://localhost:5173/admin/blog
   - Click "New post"
   - Fill in all fields
   - Upload an image
   - Add some tags
   - Click "Publish"
   ```

2. **Edit a post**:
   ```
   - Click "Edit" on any post
   - Make changes
   - Click "Save Draft"
   ```

3. **Delete a post**:
   ```
   - Click delete icon
   - Confirm deletion
   ```

### Test Public Pages

1. **View blog listing**:
   ```
   - Go to http://localhost:5173/blog
   - Should see all published posts
   - No login required
   ```

2. **View single post**:
   ```
   - Click on any blog card
   - Should see full post content
   - Check that HTML renders correctly
   ```

3. **Test with no posts**:
   ```
   - Delete all posts from admin
   - Visit /blog
   - Should see "No posts available" message
   ```

## Troubleshooting

### Posts not showing on public page

1. Check post status is "published"
2. Check `published_at` is set
3. Check `deleted_at` is NULL
4. Verify RLS policies are set up correctly

### Images not uploading

1. Check Supabase Storage is set up (see STORAGE_SETUP.md)
2. Verify `media` bucket exists and is public
3. Check file size limits
4. Check allowed MIME types

### Slug conflicts

- Slugs must be unique per site
- System will show error if slug already exists
- Edit the slug manually to make it unique

### Tags not saving

- Check `blog_post_tags` table exists
- Verify foreign key relationship
- Check RLS policies on tags table

## Future Enhancements

- [ ] Pagination for blog listing
- [ ] Category filtering on public page
- [ ] Tag filtering on public page
- [ ] Related posts section
- [ ] Post scheduling (publish at specific time)
- [ ] Draft preview for non-authenticated users
- [ ] Social sharing buttons
- [ ] Comments system
- [ ] Post analytics (views, reads)
- [ ] Bulk operations (bulk delete, bulk publish)
- [ ] Post revisions/history
- [ ] Multi-author support with permissions

## Support

For issues or questions:
1. Check Supabase logs in dashboard
2. Check browser console for errors
3. Verify database schema matches expected structure
4. Check RLS policies are correctly set up
