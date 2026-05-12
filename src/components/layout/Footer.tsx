import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const socials = [
  { label: 'Facebook', icon: Facebook, href: '#' },
  { label: 'Twitter', icon: () => (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ), href: '#' },
  { label: 'YouTube', icon: Youtube, href: '#' },
  { label: 'LinkedIn', icon: Linkedin, href: '#' },
];

const navLinks = [
  { label: 'Product', href: '/product' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Contact', href: '/contact' },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#160105] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,145,166,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(220,30,61,0.16),transparent_28%)]" />
      <div className="page-shell relative py-10 sm:py-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          {/* Logo and Social Icons */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8 lg:gap-12">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src="/Mwezi_Cup_logo.svg" 
                alt="Mwezi Cup" 
                className="h-10 w-auto object-contain brightness-0 invert" 
              />
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socials.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 transition-all duration-200 hover:bg-white/20 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm lg:gap-x-8">
            {navLinks.map(({ label, href }) => (
              <Link
                key={label}
                to={href}
                className="text-white/70 transition-colors duration-200 hover:text-white"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Newsletter Signup */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:min-w-[380px]">
            <div className="flex-1">
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <Input
                id="footer-email"
                type="email"
                placeholder="Enter your Email"
                className="h-11 rounded-lg border-white/20 bg-white/5 text-white placeholder:text-white/40 focus-visible:border-white/30 focus-visible:ring-white/20"
              />
            </div>
            <Button 
              type="submit" 
              className="h-11 rounded-lg bg-white px-6 text-sm font-semibold text-gray-900 hover:bg-white/90"
            >
              Subscribe
            </Button>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-white/10 pt-6 text-center text-sm text-white/50 sm:text-left">
          <p>© {new Date().getFullYear()} Mwezi Cup. Period freedom that moves with you.</p>
        </div>
      </div>
    </footer>
  );
}
