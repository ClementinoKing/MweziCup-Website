import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function FinalCTASection() {
  return (
    <section className="section-gap bg-white">
      <div className="page-shell">
        <Card className="overflow-hidden border-primary/15 bg-mwezi-hero p-2 shadow-soft">
          <div className="rounded-[2rem] bg-gradient-to-br from-white via-secondary/30 to-primary/10 px-6 py-10 sm:px-10 sm:py-14">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Ready to experience period freedom?</h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
                Choose period care that is comfortable, reusable, body-safe, and designed for life uninterrupted.
              </p>
              <div className="mt-8 flex justify-center">
                <Button asChild size="lg" className="rounded-full px-8">
                  <Link to="/product">
                    Shop mweziCup
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
