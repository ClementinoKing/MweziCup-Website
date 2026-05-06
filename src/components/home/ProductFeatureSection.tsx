import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = ['Moon-shaped bell', 'Inward-curved rim', 'Suction holes', 'Easy removal stem'];
const bullets = [
  'Ultra-soft & flexible',
  'BPA-free, latex-free, phthalate-free',
  'Does not disrupt natural pH',
  'Reusable for years',
];

export default function ProductFeatureSection() {
  return (
    <section className="section-gap bg-secondary/20">
      <div className="page-shell">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-border/70 bg-white/90 shadow-sm">
            <CardHeader className="space-y-4">
              <Badge variant="soft" className="bg-secondary/80 text-primary">
                Product details
              </Badge>
              <div className="space-y-2">
                <CardTitle className="text-3xl sm:text-4xl">Meet mweziCup</CardTitle>
                <p className="text-base text-muted-foreground">Designed for comfort. Built for confidence.</p>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                mweziCup is made from premium medical-grade silicone and designed to fit naturally, giving you
                comfortable all-day wear and confidence through your cycle.
              </p>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl bg-secondary/35 p-6">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary">Feature list</h3>
                <ul className="space-y-3 text-sm text-foreground">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-border bg-gradient-to-br from-white to-secondary/40 p-6">
                <div className="h-full rounded-[1.5rem] border border-dashed border-primary/20 bg-white/70 p-6">
                  <div className="mb-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">Placeholder visual</div>
                  <div className="aspect-[4/3] rounded-[1.25rem] bg-mwezi-hero" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-primary p-1 shadow-soft">
            <div className="rounded-[1.6rem] bg-gradient-to-br from-primary via-mwezi-deep to-primary p-6 text-primary-foreground">
              <CardHeader className="p-0">
                <CardTitle className="text-2xl text-primary-foreground">Premium medical-grade silicone</CardTitle>
              </CardHeader>
              <CardContent className="p-0 pt-4">
                <ul className="space-y-4 text-sm leading-6 text-primary-foreground/92">
                  {bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full bg-white" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
