import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '@/types';
import { Image } from '@/components/common/Image';
import { formatPrice } from '@/utils/money';
import { cn } from '@/utils/cn';

export function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);
  const secondImage = product.images[1];

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block"
      aria-label={`${product.name}, ${formatPrice(product.price)}${product.available ? '' : ', currently unavailable'}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden rounded-card bg-white">
        <Image
          src={hovered && secondImage ? secondImage : product.images[0]}
          alt={product.name}
          aspectRatio="4 / 5"
          className="transition-transform duration-[var(--duration-slow)] ease-[var(--ease-premium)] group-hover:scale-[1.03]"
        />
        {product.featured && (
          <span className="absolute left-3 top-3 rounded-pill bg-surface/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink">
            Featured
          </span>
        )}
        {!product.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/40">
            <span className="rounded-pill bg-surface px-3 py-1 text-xs font-medium text-ink">Unavailable</span>
          </div>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <p className={cn('text-sm font-medium text-ink', !product.available && 'text-ink/50')}>{product.name}</p>
          {product.tags && product.tags.length > 0 && (
            <p className="mt-0.5 text-xs uppercase tracking-wide text-muted">{product.tags[0]}</p>
          )}
        </div>
        <p className="text-sm font-semibold text-ink">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
