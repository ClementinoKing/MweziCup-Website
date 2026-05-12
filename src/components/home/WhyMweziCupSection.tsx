import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

type RevealState = {
  ref: RefObject<HTMLElement>;
  visible: boolean;
};

function useSectionReveal(): RevealState {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

type Tile = {
  value?: string;
  title: string;
  label: string;
  description?: string;
  className: string;
  spanClassName: string;
  titleClassName?: string;
  descriptionClassName?: string;
  valueClassName?: string;
};

const sectionBg =
  'bg-[linear-gradient(180deg,rgba(253,229,234,0.28)_0%,rgba(255,255,255,1)_36%)]';

const cardBase =
  'rounded-[28px] border border-[#fde5ea] shadow-[0_10px_28px_rgba(53,19,26,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#ef91a6]/70 hover:shadow-[0_18px_44px_rgba(53,19,26,0.10)]';

const tiles: Tile[] = [
  {
    value: '12h',
    title: 'All-day confidence',
    label: 'Long-lasting comfort',
    description: 'Reliable wear for full days, travel, and movement.',
    className: 'bg-[#dc1e3d] text-white',
    spanClassName: 'lg:col-span-3',
    valueClassName: 'text-6xl sm:text-7xl text-white',
    titleClassName: 'text-2xl sm:text-3xl text-white',
    descriptionClassName: 'text-white/86',
  },
  {
    value: '1',
    title: 'Body-safe material',
    label: 'Medical-grade silicone',
    description: 'Soft, clean, and designed to sit naturally.',
    className: 'bg-[#fff8fa] text-[#35131a]',
    spanClassName: 'lg:col-span-3',
    valueClassName: 'text-5xl sm:text-6xl text-[#dc1e3d]',
    titleClassName: 'text-xl sm:text-2xl',
    descriptionClassName: 'text-[#8b5c65]',
  },
  {
    value: '0',
    title: 'Disposable waste',
    label: 'Reusable by design',
    description: 'Built to replace single-use products.',
    className: 'bg-white text-[#35131a]',
    spanClassName: 'lg:col-span-2 lg:row-start-2',
    valueClassName: 'text-4xl sm:text-5xl text-[#dc1e3d]',
    titleClassName: 'text-lg sm:text-xl',
    descriptionClassName: 'text-[#9b6670]',
  },
  {
    title: 'The feeling',
    label: 'Designed for real life',
    description: 'Minimal in appearance. Considered in structure. Quietly premium in everyday use.',
    className: 'bg-[#fff8fa] text-[#35131a]',
    spanClassName: 'lg:col-span-2 lg:row-start-2',
    titleClassName: 'text-lg sm:text-xl',
    descriptionClassName: 'text-[#8b5c65]',
  },
  {
    title: 'Live freely',
    label: 'Freedom without limits',
    description: 'Move, sleep, swim, and train with confidence.',
    className: 'bg-[#cbfa8e] text-[#35131a]',
    spanClassName: 'lg:col-span-2 lg:row-start-2',
    titleClassName: 'text-lg sm:text-xl',
    descriptionClassName: 'text-[#6f3b45]',
  },
];

function Reveal({
  children,
  visible,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  visible: boolean;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={`transition-all duration-700 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function TileCard({
  value,
  title,
  label,
  description,
  className,
  titleClassName,
  descriptionClassName,
  valueClassName,
}: Tile) {
  const isDark = className.includes('text-white');

  return (
    <Card className={`${cardBase} h-full p-6 ${className}`}>
      <div className="flex h-full min-h-[180px] flex-col justify-between">
        <div className="space-y-4">
          {value ? <div className={`font-semibold tracking-[-0.06em] ${valueClassName ?? 'text-5xl sm:text-6xl'}`}>{value}</div> : null}
          <div className="space-y-2">
            <h3 className={`font-semibold tracking-tight ${titleClassName ?? 'text-xl sm:text-2xl'}`}>{title}</h3>
            {description ? (
              <p className={`max-w-md text-sm leading-6 ${descriptionClassName ?? 'text-[#9b6670]'}`}>{description}</p>
            ) : null}
          </div>
        </div>

        <div>
          <div className={`mb-3 h-px w-full ${isDark ? 'bg-white/20' : 'bg-[#ef91a6]/30'}`} />
          <p className={`text-sm font-medium ${isDark ? 'text-white/85' : 'text-[#6f3b45]'}`}>{label}</p>
        </div>
      </div>
    </Card>
  );
}

export default function WhyMweziCupSection() {
  const { ref, visible } = useSectionReveal();

  return (
    <section ref={ref} className={`relative overflow-hidden py-16 sm:py-20 lg:py-24 ${sectionBg}`}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-[#fde5ea]/70 blur-3xl" />
        <div className="absolute bottom-8 right-0 h-80 w-80 rounded-full bg-[#ef91a6]/18 blur-3xl" />
      </div>

      <div className="relative">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal visible={visible} className="mb-12 w-full">
            <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
              <Badge className="mb-5 rounded-full border border-[#fde5ea] bg-white px-4 py-1.5 text-sm font-medium text-[#dc1e3d] shadow-sm">
                Why choose mweziCup
              </Badge>
              <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-[#35131a] sm:text-5xl lg:text-6xl">
                Designed for freedom, comfort, and everyday confidence.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[#8b5c65] sm:text-lg">
                A softer reusable period cup made to feel calm, secure, and unobtrusive so your day does not have to stop.
              </p>
            </div>
          </Reveal>
        </div>
        <div className="page-shell">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)] lg:items-stretch">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:grid-rows-[minmax(260px,auto)_minmax(260px,auto)]">
              {tiles.map((tile, index) => (
                <Reveal key={tile.title} visible={visible} delay={index * 90} className={tile.spanClassName}>
                  <TileCard {...tile} />
                </Reveal>
              ))}
            </div>

            <Reveal visible={visible} delay={460} className="lg:row-span-2">
              <div className="relative h-full min-h-[540px] overflow-hidden rounded-[28px] border border-[#fde5ea] bg-[#fde5ea] shadow-[0_24px_70px_rgba(53,19,26,0.12)] lg:min-h-[540px]">
                <img
                  src="/img/Why Section.jpg"
                  alt="MweziCup product packaging"
                  className="h-full w-full object-cover object-[60%_22%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#35131a]/38 via-[#dc1e3d]/8 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 rounded-[1.5rem] border border-white/20 bg-white/14 p-5 text-white backdrop-blur-md">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">Made for real life</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight">
                    Comfort that fits into your routine.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
