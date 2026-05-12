import { Link } from 'react-router-dom';
import { ArrowRight, Facebook, Instagram, MessageCircle, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const socials = [
  { label: 'Instagram', icon: Instagram, href: '#' },
  { label: 'Facebook', icon: Facebook, href: '#' },
  { label: 'YouTube', icon: Youtube, href: '#' },
  { label: 'WhatsApp', icon: MessageCircle, href: '#' },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#160105] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,145,166,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(220,30,61,0.16),transparent_28%)]" />
      <div className="page-shell relative py-14 sm:py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_1.1fr_0.95fr] lg:gap-12">
          <div className="space-y-6 lg:pr-8 lg:border-r lg:border-white/10">
            <img src="/Mwezi_Cup_logo.svg" alt="mweziCup logo" className="h-12 w-auto object-contain brightness-0 invert" />
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-white/65">Flow in comfort</p>

            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">Follow us</div>
              <div className="flex items-center gap-3">
                {socials.map(({ label, icon: Icon, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/5 text-white/80 transition duration-200 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/12 hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5 lg:px-4 lg:border-r lg:border-white/10">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight text-white">About mweziCup</h3>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-white/78 sm:text-base">
              mweziCup is a premium reusable menstrual cup brand built for real life, with a focus on comfort, body-safe
              materials, sustainability, and confidence through every cycle. We are creating period care that feels modern,
              supportive, and easy to live with.
            </p>
            <div className="flex flex-wrap gap-3 pt-2 text-sm">
              {['About us', 'Blog', 'Product', 'FAQs'].map((item) => (
                <Link
                  key={item}
                  to={item === 'About us' ? '/about' : item === 'Blog' ? '/blog' : item === 'Product' ? '/product' : '/faqs'}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white/78 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight text-white">Contact</h3>
              <div className="space-y-4 text-sm leading-6 text-white/78">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">Call</div>
                  <p className="mt-1">+0123 456 789 00</p>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">Email</div>
                  <p className="mt-1">hello@mwezicup.com</p>
                </div>
              </div>
            </div>

            <form className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Stay in touch</label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Write Email"
                  aria-label="Email address"
                  className="flex-1 border-white/10 bg-white/5 text-white placeholder:text-white/45 focus-visible:border-white/25 focus-visible:ring-white/20"
                />
                <Button type="submit" size="icon" className="h-11 w-11 rounded-full bg-primary hover:bg-mwezi-deep">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="flex flex-col gap-3 text-sm text-white/65 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} mweziCup. All rights reserved.</p>
          <p>Flow in comfort.</p>
        </div>
      </div>
    </footer>
  );
}
