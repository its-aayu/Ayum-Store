import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, ShoppingBag } from 'lucide-react';
import { Container } from '@/components/common/Container';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';
import { useCart } from '@/context/CartContext';
import { cn } from '@/utils/cn';

const NAV_ITEMS = [
  { label: 'Shop', to: '/shop' },
  { label: 'Create Your Own', to: '/custom' },
  { label: 'Services', to: '/services' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur shadow-nav">
      <Container className="flex h-16 items-center justify-between">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="-ml-2 rounded-full p-2 text-ink hover:bg-ink/5 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>

        <Logo className="lg:flex-1" />

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'text-sm font-medium text-ink/80 transition-colors hover:text-ink',
                  isActive && 'text-ink',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end lg:flex-none">
          <Link
            to="/cart"
            className="relative rounded-full p-2 text-ink hover:bg-ink/5"
            aria-label={`Cart, ${itemCount} item${itemCount === 1 ? '' : 's'}`}
          >
            <ShoppingBag className="h-6 w-6" aria-hidden="true" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-brand-primary px-1 text-[10px] font-semibold text-white">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </Container>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} navItems={NAV_ITEMS} />
    </header>
  );
}
