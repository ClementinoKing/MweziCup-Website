import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetMenuIcon, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const navigationItems = [
  { label: 'Home', to: '/' },
  { label: 'About us', to: '/about' },
  { label: 'How it Works', to: '/how-it-works' },
  { label: 'Product', to: '/product' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="page-shell">
        <div className="flex h-20 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <img src="/Mwezi_Cup_logo.svg" alt="mweziCup logo" className="h-12 w-auto object-contain" />
          </Link>

          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="gap-0">
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.to}>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        cn('rounded-full px-4 py-2 text-sm font-medium transition-colors', isActive && 'bg-secondary text-primary')
                      }
                    >
                      {item.label}
                    </NavLink>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-2">
            <Button asChild variant="default" className="hidden rounded-full px-5 text-sm md:inline-flex">
              <Link to="/product">Shop Now</Link>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full border border-border bg-background hover:bg-secondary/70" aria-label="View cart">
              <ShoppingBag className="h-5 w-5" />
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full border border-border bg-background lg:hidden">
                  <SheetMenuIcon />
                </Button>
              </SheetTrigger>
          <SheetContent side="right" className="bg-background">
            <SheetHeader className="space-y-3 text-left">
                  <img src="/Mwezi_Cup_logo.svg" alt="mweziCup logo" className="h-12 w-auto object-contain" />
                </SheetHeader>
                <Separator className="my-4" />
                <nav className="flex flex-col gap-2">
                  {navigationItems.map((item) => (
                    <SheetClose asChild key={item.to}>
                      <NavLink
                        to={item.to}
                        className={({ isActive }) =>
                          cn(
                            'rounded-2xl px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary/60',
                            isActive && 'bg-secondary text-primary',
                          )
                        }
                      >
                        {item.label}
                      </NavLink>
                    </SheetClose>
                  ))}
                </nav>
                <div className="mt-6 flex flex-col gap-3">
                  <Button asChild variant="default" className="rounded-full">
                    <Link to="/product">Shop Now</Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-full">
                    <Link to="/how-it-works">Learn How It Works</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
