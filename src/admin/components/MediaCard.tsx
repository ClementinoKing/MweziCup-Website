import { Copy, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import StatusBadge from './StatusBadge';
import type { MediaItem } from '../types/admin';

interface MediaCardProps {
  item: MediaItem;
  onPreview: (item: MediaItem) => void;
  onCopy: (item: MediaItem) => void;
  onDelete: (item: MediaItem) => void;
}

export default function MediaCard({ item, onPreview, onCopy, onDelete }: MediaCardProps) {
  return (
    <Card className="overflow-hidden border-border/80 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-soft">
      <div className="aspect-[4/3] bg-mwezi-blush">
        {item.type === 'Image' ? (
          <img src={item.url} alt={item.alt} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center">
            <div>
              <StatusBadge status={item.type} className="mb-3" />
              <p className="text-sm font-medium text-foreground">{item.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{item.size}</p>
            </div>
          </div>
        )}
      </div>
      <CardContent className="space-y-4 p-4">
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-1 text-sm font-semibold text-foreground">{item.name}</h3>
            <StatusBadge status={item.type} />
          </div>
          <p className="text-xs text-muted-foreground">
            {item.dimensions} · {item.size}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="h-9 rounded-full" onClick={() => onPreview(item)}>
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button variant="outline" size="sm" className="h-9 rounded-full" onClick={() => onCopy(item)}>
            <Copy className="h-4 w-4" />
            Copy URL
          </Button>
          <Button variant="ghost" size="sm" className="h-9 rounded-full text-rose-700 hover:bg-rose-50 hover:text-rose-700" onClick={() => onDelete(item)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

