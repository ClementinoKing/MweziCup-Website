import PageHeader from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const bullets = ['Medical-grade silicone', 'Reusable for years', 'Body-safe comfort', 'Designed for real life'];

export default function ProductPage() {
  return (
    <section className="section-gap">
      <div className="page-shell space-y-10">
        <PageHeader
          eyebrow="Product"
          title="Meet the cup designed to support your full day."
          subtitle="A placeholder product page for specifications, sizing, care, and purchasing details."
        />
        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <Card className="border-border/70 bg-white/90">
            <CardHeader>
              <Badge variant="soft" className="bg-secondary/80 text-primary w-fit">
                Product overview
              </Badge>
              <CardTitle className="text-2xl">Comfort-led reusable period care</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {bullets.map((bullet) => (
                <div key={bullet} className="rounded-3xl border border-border/70 bg-secondary/25 p-5 text-sm text-foreground">
                  {bullet}
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="border-border/70 bg-gradient-to-br from-primary to-mwezi-deep text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-2xl text-primary-foreground">Placeholder purchase panel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-primary-foreground/90">
              <p>This section can later hold pricing, size options, bundle offers, and checkout entry points.</p>
              <div className="rounded-3xl bg-white/10 p-5">Visual placeholder for product imagery or highlights.</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
