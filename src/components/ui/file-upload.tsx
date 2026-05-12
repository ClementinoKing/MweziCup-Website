import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { uploadFile, validateFile, type UploadResult } from '@/lib/storage';

interface FileUploadProps {
  onUploadComplete?: (result: UploadResult) => void;
  onUploadError?: (error: string) => void;
  bucket?: string;
  folder?: string;
  accept?: string;
  maxSize?: number; // in MB
  allowedTypes?: string[];
  currentUrl?: string;
  className?: string;
}

export function FileUpload({
  onUploadComplete,
  onUploadError,
  bucket = 'media',
  folder,
  accept = 'image/*',
  maxSize = 5,
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  currentUrl,
  className,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    // Validate file
    const validation = validateFile(file, {
      maxSize: maxSize * 1024 * 1024,
      allowedTypes,
    });

    if (!validation.valid) {
      onUploadError?.(validation.error || 'Invalid file');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    try {
      const { data, error } = await uploadFile(file, bucket, folder);

      if (error) {
        onUploadError?.(error.message);
        setPreview(null);
      } else if (data) {
        onUploadComplete?.(data);
      }
    } catch (error) {
      onUploadError?.(error instanceof Error ? error.message : 'Upload failed');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClear = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn('relative', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        disabled={uploading}
      />

      {preview ? (
        <div className="relative rounded-2xl border border-border bg-muted/30 dark:bg-muted/20 p-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
            <img src={preview} alt="Preview" className="h-full w-full object-cover" />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {uploading ? 'Uploading...' : 'Image uploaded'}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={uploading}
              className="rounded-full"
            >
              <X className="h-4 w-4" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={cn(
            'relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 dark:bg-muted/20 p-8 transition-colors',
            dragActive && 'border-primary bg-primary/5',
            uploading && 'pointer-events-none opacity-50'
          )}
        >
          {uploading ? (
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          ) : (
            <>
              <div className="rounded-full bg-primary/10 p-3">
                <ImageIcon className="h-6 w-6 text-primary" />
              </div>
              <p className="mt-4 text-sm font-medium text-foreground">
                Drop your image here, or{' '}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-primary hover:underline"
                >
                  browse
                </button>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {allowedTypes.map((t) => t.split('/')[1].toUpperCase()).join(', ')} up to {maxSize}MB
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
