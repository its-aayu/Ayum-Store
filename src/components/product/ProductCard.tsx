import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '@/types';
import { Image } from '@/components/common/Image';
import { ComingSoonOverlay } from './ComingSoonOverlay';
import { formatPrice } from '@/utils/money';
import { cn } from '@/utils/cn';

export function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);
  const secondImage = product.images[1];
  const isLimited = product.tags?.includes('limited');

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block"
      aria-label={`${product.name}, ${formatPrice(product.price)}${
        product.comingSoon ? ', coming soon' : product.available ? '' : ', currently unavailable'
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden rounded-card bg-white">
        <Image
          src={hovered && secondImage && !product.comingSoon ? secondImage : product.images[0]}
          alt={product.name}
          aspectRatio="4 / 5"
          className={cn(
            'transition-transform duration-[var(--duration-slow)] ease-[var(--ease-premium)]',
            product.comingSoon ? 'scale-110 blur-md' : 'group-hover:scale-[1.03]',
          )}
        />
        {product.comingSoon ? (
          <ComingSoonOverlay />
        ) : (
          <>
            {isLimited && (
              <span className="absolute left-3 top-3 rounded-pill bg-brand-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                Only 50 made
              </span>
            )}
            {!product.available && (
              <div className="absolute inset-0 flex items-center justify-center bg-ink/40">
                <span className="rounded-pill bg-surface px-3 py-1 text-xs font-medium text-ink">Unavailable</span>
              </div>
            )}
          </>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <p className={cn('text-sm font-medium text-ink', (!product.available || product.comingSoon) && 'text-ink/50')}>
            {product.name}
          </p>
          {product.comingSoon && <p className="mt-0.5 text-xs uppercase tracking-wide text-muted">Coming soon</p>}
        </div>
        {!product.comingSoon && <p className="text-sm font-semibold text-ink">{formatPrice(product.price)}</p>}
      </div>
    </Link>
  );
}
