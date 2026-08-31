import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Logo } from './Logo';

type NavItem = { label: string; to: string };

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  navItems: NavItem[];
};

export function MobileMenu({ open, onClose, navItems }: MobileMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onCancel={onClose}
      aria-label="Site menu"
      className={cn(
        'm-0 h-dvh max-h-none w-full max-w-none border-0 bg-surface p-0',
        'backdrop:bg-overlay',
      )}
    >
      <div className="flex items-center justify-between px-4 py-4">
        <Logo />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="rounded-full p-2 text-ink hover:bg-ink/5"
        >
          <X className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <nav className="flex flex-col gap-1 px-4 py-6" aria-label="Mobile">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'rounded-button px-3 py-3 text-lg font-medium',
                isActive ? 'text-brand-primary' : 'text-ink hover:bg-ink/5',
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </dialog>
  );
}
