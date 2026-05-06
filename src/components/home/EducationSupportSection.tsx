import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const cards = [
  {
    title: 'Easy to use',
    copy: 'Fold. Insert. Wear. Rinse. Reuse. It’s that simple.',
  },
  {
    title: 'Free guides & support',
    copy: 'Step-by-step videos and illustrated guides in Chichewa and English.',
  },
  {
    title: 'A community that supports you',
    copy: 'From your first fold to full confidence, we’ve got your back.',
  },
];

export default function EducationSupportSection() {
  return (
    <section className="section-gap bg-white">
      <div className="page-shell">
        <div className="mb-8 space-y-3">
          <Badge variant="soft" className="bg-secondary/80 text-primary">
            Education & support
          </Badge>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Practical support that makes the switch feel easy.</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {cards.map((card) => (
            <Card key={card.title} className="border-border/70 bg-white/90 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-glow">
              <CardHeader>
                <CardTitle className="text-xl">{card.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-6 text-muted-foreground">{card.copy}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
