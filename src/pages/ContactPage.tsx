import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ContactPage() {
  return (
    <section className="section-gap">
      <div className="page-shell space-y-10">
        <PageHeader
          eyebrow="Contact"
          title="Get in touch with the mweziCup team."
          subtitle="A simple placeholder page for support, wholesale, and general enquiries."
        />
        <Card className="border-border/70 bg-white/90">
          <CardHeader>
            <CardTitle>Contact details placeholder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
            <p>Email, phone, and social channels can be added here later.</p>
            <p>For now, this page provides a clean destination for the navigation and footer links.</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
