import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';

type LogoProps = {
  className?: string;
  /** 'dark' = full colour lockup for light backgrounds, 'light' = mark + white wordmark for dark backgrounds. */
  variant?: 'dark' | 'light';
};

export function Logo({ className, variant = 'dark' }: LogoProps) {
  if (variant === 'light') {
    return (
      <Link to="/" className={cn('flex items-center gap-2', className)} aria-label="AYUM home">
        <img src="/assets/brand/mark.png" alt="" className="h-7 w-auto" />
        <span className="font-display text-xl tracking-wide text-white">AYUM</span>
      </Link>
    );
  }

  return (
    <Link to="/" className={cn('block h-8 w-auto', className)} aria-label="AYUM home">
      <img src="/assets/brand/logo-full.png" alt="AYUM" className="h-full w-auto" />
    </Link>
  );
}
