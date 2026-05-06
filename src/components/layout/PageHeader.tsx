import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle: string;
  align?: 'left' | 'center';
  className?: string;
};

export default function PageHeader({ eyebrow, title, subtitle, align = 'left', className }: PageHeaderProps) {
  return (
    <div className={cn('space-y-4', align === 'center' && 'mx-auto max-w-3xl text-center', className)}>
      {eyebrow ? (
        <Badge variant="soft" className="bg-secondary/80 text-secondary-foreground">
          {eyebrow}
        </Badge>
      ) : null}
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">{title}</h1>
        <p className="text-base leading-7 text-muted-foreground sm:text-lg">{subtitle}</p>
      </div>
    </div>
  );
}
