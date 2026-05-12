import { supabase } from './supabase';

export type UploadResult = {
  url: string;
  path: string;
  fullPath: string;
};

export type UploadError = {
  message: string;
  error?: unknown;
};

/**
 * Upload a file to Supabase Storage
 * @param file - The file to upload
 * @param bucket - The storage bucket name (default: 'media')
 * @param folder - Optional folder path within the bucket
 * @returns Promise with upload result or error
 */
export async function uploadFile(
  file: File,
  bucket: string = 'media',
  folder?: string
): Promise<{ data: UploadResult | null; error: UploadError | null }> {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Upload file
    const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) {
      return {
        data: null,
        error: { message: error.message, error },
      };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path);

    return {
      data: {
        url: publicUrl,
        path: data.path,
        fullPath: data.fullPath,
      },
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        error,
      },
    };
  }
}

/**
 * Delete a file from Supabase Storage
 * @param path - The file path in storage
 * @param bucket - The storage bucket name (default: 'media')
 */
export async function deleteFile(
  path: string,
  bucket: string = 'media'
): Promise<{ error: UploadError | null }> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      return { error: { message: error.message, error } };
    }

    return { error: null };
  } catch (error) {
    return {
      error: {
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        error,
      },
    };
  }
}

/**
 * Get public URL for a file
 * @param path - The file path in storage
 * @param bucket - The storage bucket name (default: 'media')
 */
export function getPublicUrl(path: string, bucket: string = 'media'): string {
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path);
  return publicUrl;
}

/**
 * List files in a folder
 * @param folder - The folder path (optional)
 * @param bucket - The storage bucket name (default: 'media')
 */
export async function listFiles(folder?: string, bucket: string = 'media') {
  try {
    const { data, error } = await supabase.storage.from(bucket).list(folder, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    });

    if (error) {
      return { data: null, error: { message: error.message, error } };
    }

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        error,
      },
    };
  }
}

/**
 * Validate file before upload
 * @param file - The file to validate
 * @param options - Validation options
 */
export function validateFile(
  file: File,
  options: {
    maxSize?: number; // in bytes
    allowedTypes?: string[];
  } = {}
): { valid: boolean; error?: string } {
  const { maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] } = options;

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size must be less than ${(maxSize / 1024 / 1024).toFixed(0)}MB`,
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type must be one of: ${allowedTypes.map((t) => t.split('/')[1]).join(', ')}`,
    };
  }

  return { valid: true };
}
