import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <section className="section-gap">
      <div className="page-shell space-y-10">
        <PageHeader
          eyebrow="About mweziCup"
          title="A Malawian brand built around comfort, confidence, and reusable care."
          subtitle="This placeholder page can later expand into the full brand story, mission, and values."
        />
        <Card className="border-border/70 bg-white/90">
          <CardHeader>
            <CardTitle>Brand story placeholder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
            <p>
              mweziCup is positioned as a modern sustainable period care brand focused on premium comfort and practical
              everyday support.
            </p>
            <p>
              This page is intentionally clean and easy to extend when your final copy, founder story, and social proof are ready.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
