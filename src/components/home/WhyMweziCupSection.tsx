import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, TimerReset, Waves, Flower2, BookHeart, Trash2 } from 'lucide-react';

const cards = [
  { title: 'Up to 12 hours of comfort', icon: TimerReset },
  { title: 'Made from medical-grade silicone', icon: ShieldCheck },
  { title: 'Reusable & sustainable', icon: Flower2 },
  { title: 'Designed to fit naturally', icon: Waves },
  { title: 'Beginner friendly', icon: BookHeart },
  { title: 'No disposal stress', icon: Trash2 },
];

export default function WhyMweziCupSection() {
  return (
    <section className="section-gap bg-white">
      <div className="page-shell">
        <div className="mb-8 space-y-3">
          <Badge variant="soft" className="bg-secondary/80 text-primary">
            Why women love mweziCup
          </Badge>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Comfort that feels thoughtful from every angle.</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map(({ title, icon: Icon }) => (
            <Card key={title} className="group border-border/70 bg-white/90 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-glow">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="pt-2 text-xl">{title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-6 text-muted-foreground">
                Designed to support comfort, confidence, and convenience across your cycle.
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
