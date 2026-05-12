import { ArrowRight, ShieldCheck, Sparkles, MoonStar, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const features = [
  { icon: MoonStar, text: 'Up to 12 hours of comfort' },
  { icon: ShieldCheck, text: 'Body-safe medical-grade silicone' },
  { icon: Sparkles, text: 'Reusable & sustainable for years' },
  { icon: HeartHandshake, text: 'No odor, no itch, no waste' },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white lg:min-h-[760px]">
      <div className="absolute inset-0">
        <img
          src="/img/Mwezi hero image.png"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 flex items-center">
        <div className="page-shell w-full">
          <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)] lg:gap-14">
            <div className="max-w-4xl space-y-7">
              <div className="inline-flex">
                <Badge variant="soft" className="border border-primary/10 bg-white/65 px-4 py-1.5 text-primary shadow-sm backdrop-blur-[2px]">
                  Period freedom, reimagined
                </Badge>
              </div>
              <div className="space-y-5">
                <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                  Period freedom that moves with you.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                  Up to 12 hours of comfortable, reusable period care designed for real life — work, school, sleep,
                  travel, gym, and everything in between.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="default" size="lg" className="rounded-full px-7 shadow-lg shadow-primary/20">
                  <Link to="/product">Shop mweziCup</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full px-7">
                  <Link to="/how-it-works">
                    Learn How It Works
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-2 lg:max-w-[44rem]">
                {features.map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="flex w-full items-center gap-3 rounded-2xl border border-border/70 bg-white/80 px-4 py-3 shadow-sm"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium leading-5 text-foreground">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
