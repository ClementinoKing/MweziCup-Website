import { Link } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Seo from '@/components/seo/Seo';

export default function NotFoundPage() {
  return (
    <section className="section-gap">
      <Seo title="Page not found" description="The requested page could not be found." path="/404" noIndex />
      <div className="page-shell">
        <Card className="border-border/70 bg-white/90 p-8">
          <PageHeader
            eyebrow="404"
            title="Page not found"
            subtitle="The page you requested does not exist. Return to the homepage to continue exploring mweziCup."
          />
          <div className="mt-8">
            <Button asChild className="rounded-full">
              <Link to="/">Go home</Link>
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
