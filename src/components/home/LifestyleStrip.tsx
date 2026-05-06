const items = ['Move freely', 'Sleep comfortably', 'Swim confidently', 'Train without limits', 'Live life on your terms'];

export default function LifestyleStrip() {
  return (
    <section className="border-y border-border/60 bg-secondary/20">
      <div className="page-shell py-5">
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-medium text-foreground">
          {items.map((item) => (
            <div key={item} className="rounded-full border border-border/60 bg-white/80 px-4 py-2 shadow-sm">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
