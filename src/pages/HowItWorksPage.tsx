import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Seo from '@/components/seo/Seo';

const steps = [
  'Fold the cup into a comfortable shape.',
  'Insert it with a gentle angle.',
  'Wear for up to 12 hours depending on your flow.',
  'Remove, rinse, sterilise, and reuse.',
];

export default function HowItWorksPage() {
  return (
    <section className="section-gap">
      <Seo
        title="How it works"
        description="See how to fold, insert, wear, remove, and care for your Mwezi Cup with confidence."
        path="/how-it-works"
        keywords={['how menstrual cup works', 'how to use menstrual cup', 'cup care']}
      />
      <div className="page-shell space-y-10">
        <PageHeader
          eyebrow="How it works"
          title="Simple steps for confident reusable period care."
          subtitle="Use this placeholder page to explain the cup flow, comfort, and care routine in a polished way."
        />
        <Card className="border-border/70 bg-white/90">
          <CardHeader>
            <CardTitle>The basic routine</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="grid gap-4 sm:grid-cols-2">
              {steps.map((step, index) => (
                <li key={step} className="rounded-3xl border border-border/70 bg-secondary/25 p-5 text-sm leading-6 text-foreground">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-primary">Step {index + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
