# Supabase Storage Setup Guide

This guide will help you set up file storage in Supabase for the Mwezi Cup website.

## Overview

The storage system includes:
- **Media bucket**: For blog images, featured images, and general media (5MB limit)
- **Avatars bucket**: For user profile pictures (2MB limit)
- **Documents bucket**: For PDFs and documents (10MB limit)

## Setup Instructions

### Option 1: Using Supabase Dashboard (Recommended)

1. **Go to your Supabase project dashboard**
   - Navigate to: https://supabase.com/dashboard/project/pbvvkwnbcbxzqkikcoic

2. **Create Storage Buckets**
   - Go to **Storage** in the left sidebar
   - Click **New bucket**
   - Create the following buckets:

   **Media Bucket:**
   - Name: `media`
   - Public: ✅ Yes
   - File size limit: `5242880` (5MB)
   - Allowed MIME types: `image/jpeg, image/png, image/gif, image/webp, image/svg+xml`

   **Avatars Bucket:**
   - Name: `avatars`
   - Public: ✅ Yes
   - File size limit: `2097152` (2MB)
   - Allowed MIME types: `image/jpeg, image/png, image/webp`

   **Documents Bucket:**
   - Name: `documents`
   - Public: ✅ Yes
   - File size limit: `10485760` (10MB)
   - Allowed MIME types: `application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document`

3. **Set up Storage Policies**
   
   For each bucket, go to **Policies** tab and add these policies:

   **For all buckets:**
   
   a. **Public Read Access**
   ```sql
   CREATE POLICY "Public read access"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'BUCKET_NAME');
   ```

   b. **Authenticated Upload**
   ```sql
   CREATE POLICY "Authenticated users can upload"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'BUCKET_NAME');
   ```

   c. **Users can update their own files**
   ```sql
   CREATE POLICY "Users can update their own files"
   ON storage.objects FOR UPDATE
   TO authenticated
   USING (bucket_id = 'BUCKET_NAME' AND auth.uid()::text = owner::text)
   WITH CHECK (bucket_id = 'BUCKET_NAME');
   ```

   d. **Users can delete their own files**
   ```sql
   CREATE POLICY "Users can delete their own files"
   ON storage.objects FOR DELETE
   TO authenticated
   USING (bucket_id = 'BUCKET_NAME' AND auth.uid()::text = owner::text);
   ```

   Replace `BUCKET_NAME` with `media`, `avatars`, or `documents` for each bucket.

### Option 2: Using SQL Migration

1. **Go to SQL Editor in Supabase Dashboard**
   - Navigate to **SQL Editor** in the left sidebar

2. **Run the migration**
   - Copy the contents of `supabase/migrations/003_storage_setup.sql`
   - Paste into the SQL Editor
   - Click **Run**

## Testing the Setup

### Test Upload from the Application

1. **Start your development server**
   ```bash
   npm run dev
   ```

2. **Navigate to the blog editor**
   - Go to: http://localhost:5173/admin/login
   - Log in with your admin credentials
   - Navigate to: http://localhost:5173/admin/blog/new

3. **Test file upload**
   - Scroll to the "Featured Image" section
   - Drag and drop an image or click to browse
   - The image should upload and display a preview

### Verify in Supabase Dashboard

1. Go to **Storage** → **media** bucket
2. You should see your uploaded file in the `blog` folder
3. Click on the file to see its public URL

## File Upload Component Usage

The `FileUpload` component can be used anywhere in your application:

```tsx
import { FileUpload } from '@/components/ui/file-upload';
import type { UploadResult } from '@/lib/storage';

function MyComponent() {
  const [imageUrl, setImageUrl] = useState('');

  return (
    <FileUpload
      bucket="media"
      folder="blog"
      currentUrl={imageUrl}
      onUploadComplete={(result: UploadResult) => {
        setImageUrl(result.url);
        console.log('File uploaded:', result);
      }}
      onUploadError={(error: string) => {
        console.error('Upload failed:', error);
      }}
      maxSize={5} // 5MB
      accept="image/*"
    />
  );
}
```

## Storage Utility Functions

The `src/lib/storage.ts` file provides utility functions:

### Upload a file
```typescript
import { uploadFile } from '@/lib/storage';

const { data, error } = await uploadFile(file, 'media', 'blog');
if (data) {
  console.log('Public URL:', data.url);
}
```

### Delete a file
```typescript
import { deleteFile } from '@/lib/storage';

const { error } = await deleteFile('blog/filename.jpg', 'media');
```

### Get public URL
```typescript
import { getPublicUrl } from '@/lib/storage';

const url = getPublicUrl('blog/filename.jpg', 'media');
```

### List files in a folder
```typescript
import { listFiles } from '@/lib/storage';

const { data, error } = await listFiles('blog', 'media');
```

### Validate file before upload
```typescript
import { validateFile } from '@/lib/storage';

const validation = validateFile(file, {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png']
});

if (!validation.valid) {
  console.error(validation.error);
}
```

## Folder Structure

Files are organized in the following structure:

```
media/
├── blog/           # Blog post images
├── products/       # Product images
├── homepage/       # Homepage images
└── general/        # Other media files

avatars/
└── [user-id]/      # User avatars

documents/
├── guides/         # User guides
└── policies/       # Policy documents
```

## Security Notes

1. **Public Buckets**: All buckets are public for read access
2. **Upload Restrictions**: Only authenticated users can upload files
3. **File Ownership**: Users can only modify/delete their own uploads
4. **File Size Limits**: Enforced at the bucket level
5. **MIME Type Restrictions**: Only allowed file types can be uploaded

## Troubleshooting

### Upload fails with "Policy violation"
- Make sure you're logged in as an authenticated user
- Check that the storage policies are correctly set up

### Files not appearing
- Verify the bucket is set to public
- Check the public URL format: `https://[project-ref].supabase.co/storage/v1/object/public/[bucket]/[path]`

### File size errors
- Check the bucket's file size limit
- Verify the `maxSize` prop on the FileUpload component

### CORS errors
- Supabase storage should handle CORS automatically
- If issues persist, check your Supabase project settings

## Next Steps

- [ ] Set up image optimization (optional)
- [ ] Add image cropping functionality (optional)
- [ ] Implement file management UI in admin panel
- [ ] Add bulk upload capability
- [ ] Set up CDN for faster delivery (optional)

## Support

For more information, visit:
- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Supabase Storage API Reference](https://supabase.com/docs/reference/javascript/storage)
