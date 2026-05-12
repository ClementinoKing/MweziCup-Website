import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type StatusTone = 'default' | 'success' | 'warning' | 'danger' | 'muted' | 'info';

const toneClasses: Record<StatusTone, string> = {
  default: 'border-border bg-background text-foreground',
  success: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
  warning: 'border-amber-500/20 bg-amber-500/10 text-amber-300',
  danger: 'border-rose-500/20 bg-rose-500/10 text-rose-300',
  muted: 'border-border bg-muted text-muted-foreground',
  info: 'border-blue-500/20 bg-blue-500/10 text-blue-300',
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = status.toLowerCase();
  let tone: StatusTone = 'default';

  if (['published', 'active', 'visible', 'read'].includes(normalized)) tone = 'success';
  else if (['draft', 'new', 'invited'].includes(normalized)) tone = 'warning';
  else if (['archived', 'disabled', 'unsubscribed', 'hidden'].includes(normalized)) tone = 'danger';
  else if (normalized === 'replied') tone = 'info';
  else if (normalized === 'never') tone = 'muted';

  return <Badge className={cn('rounded-full border px-2.5 py-1 text-xs font-medium', toneClasses[tone], className)}>{status}</Badge>;
}
