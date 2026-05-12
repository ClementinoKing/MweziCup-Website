import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  change?: string;
  changeTone?: 'positive' | 'neutral' | 'negative';
  className?: string;
}

export default function StatCard({ label, value, icon: Icon, change, changeTone = 'positive', className }: StatCardProps) {
  return (
    <Card className={cn('shadow-sm', className)}>
      <CardContent className="space-y-4 p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground">
            <Icon className="h-5 w-5" />
          </div>
          {change ? (
            <div
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
                changeTone === 'positive' && 'bg-emerald-50 text-emerald-700',
                changeTone === 'neutral' && 'bg-muted text-muted-foreground',
                changeTone === 'negative' && 'bg-rose-50 text-rose-700',
              )}
            >
              <ArrowUpRight className="h-3.5 w-3.5" />
              {change}
            </div>
          ) : null}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-3xl font-semibold tracking-tight text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
