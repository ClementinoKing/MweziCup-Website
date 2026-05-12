import type { SVGProps } from 'react';

function Astroid(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M12.983 21.186a1 1 0 0 1-1.966 0 10 10 0 0 0-8.203-8.203 1 1 0 0 1 0-1.966 10 10 0 0 0 8.203-8.203 1 1 0 0 1 1.966 0 10 10 0 0 0 8.203 8.203 1 1 0 0 1 0 1.966 10 10 0 0 0-8.203 8.203" />
    </svg>
  );
}

const marqueeItems = [
  'Move freely',
  'Sleep comfortably',
  'Swim confidently',
  'Train without limits',
  'Live life on your terms',
];

function MarqueeSegment() {
  return (
    <div className="flex shrink-0 items-center gap-5 whitespace-nowrap px-6 sm:gap-7 sm:px-8">
      {marqueeItems.map((item, index) => (
        <div key={item} className="flex items-center gap-5 sm:gap-7">
          <span className="text-base font-semibold tracking-[0.1em] text-white transition-[filter] duration-300 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] sm:text-lg">
            {item}
          </span>
          {index < marqueeItems.length - 1 ? <Astroid className="h-5 w-5 shrink-0 text-white/90" /> : null}
        </div>
      ))}
    </div>
  );
}

export default function MarqueeBanner() {
  return (
    <section
      className="group relative z-30 min-h-[60px] overflow-hidden bg-primary/95 py-3.5 shadow-[0_8px_30px_rgba(220,30,61,0.18)] backdrop-blur-md"
      aria-label="Brand highlights"
    >
      <span className="sr-only">Move freely. Sleep comfortably. Swim confidently. Train without limits. Live life on your terms.</span>
      <div className="flex w-max items-center will-change-transform marquee-track group-hover:[animation-play-state:paused]">
        <MarqueeSegment />
        <MarqueeSegment />
      </div>
    </section>
  );
}
