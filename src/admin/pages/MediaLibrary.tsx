import { Filter, ImagePlus, Search, Upload } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import MediaCard from '../components/MediaCard';
import PageHeader from '../components/PageHeader';
import { mockMediaItems } from '../data/mockAdminData';
import type { MediaItem, MediaType } from '../types/admin';
import * as Dialog from '@radix-ui/react-dialog';

const mediaTypes: Array<'All types' | MediaType> = ['All types', 'Image', 'Video', 'Document'];

export default function MediaLibrary() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All types' | MediaType>('All types');
  const [items, setItems] = useState<MediaItem[]>(mockMediaItems);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.alt.toLowerCase().includes(search.toLowerCase());
        const matchesType = typeFilter === 'All types' || item.type === typeFilter;
        return matchesSearch && matchesType;
      }),
    [items, search, typeFilter],
  );

  const handleCopy = async (item: MediaItem) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(item.url);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Asset management"
        title="Media Library"
        description="Browse images, documents, and uploads, then preview or copy URLs for future integration."
        actions={
          <Button className="rounded-full bg-mwezi-primary hover:bg-mwezi-deep">
            <Upload className="h-4 w-4" />
            Upload media
          </Button>
        }
      />

      <Card className="border-border/80 shadow-sm">
        <CardContent className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center">
          <div className="flex flex-1 items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search media..."
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 lg:w-64">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value as typeof typeFilter)}
              className="w-full bg-transparent text-sm text-foreground outline-none"
            >
              {mediaTypes.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {filteredItems.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              onPreview={setPreviewItem}
              onCopy={handleCopy}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No media found"
          description="Try changing the search or filter. In production this area would show the uploaded asset library."
          icon={ImagePlus}
          actionLabel="Upload media"
          onAction={() => undefined}
        />
      )}

      <Dialog.Root open={Boolean(previewItem)} onOpenChange={(open) => !open && setPreviewItem(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border bg-white shadow-2xl focus:outline-none">
            <div className="grid gap-0 md:grid-cols-[1.2fr_0.8fr]">
              <div className="bg-mwezi-cream p-4 md:p-6">
                {previewItem?.type === 'Image' ? (
                  <img src={previewItem.url} alt={previewItem.alt} className="h-full max-h-[70vh] w-full rounded-2xl object-cover" />
                ) : (
                  <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-dashed border-border bg-white p-8 text-center">
                    <div>
                      <p className="text-lg font-semibold text-foreground">{previewItem?.name}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{previewItem?.type}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-5 p-6">
                <Dialog.Title className="text-xl font-semibold text-foreground">{previewItem?.name}</Dialog.Title>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>{previewItem?.alt}</p>
                  <p>
                    {previewItem?.dimensions} · {previewItem?.size}
                  </p>
                  <p>{previewItem?.url}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={async () => previewItem && handleCopy(previewItem)}
                  >
                    Copy URL
                  </Button>
                  <Dialog.Close asChild>
                    <Button className="rounded-full bg-mwezi-primary hover:bg-mwezi-deep">Close</Button>
                  </Dialog.Close>
                </div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete media item?"
        description="This would remove the asset from the media library. In production it should delete the storage record and file safely."
        confirmLabel="Delete item"
        onConfirm={() => deleteTarget && setItems((current) => current.filter((item) => item.id !== deleteTarget.id))}
      />
    </div>
  );
}

