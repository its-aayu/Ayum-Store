import { useState } from 'react';
import { cn } from '@/utils/cn';
import { ImageOff } from 'lucide-react';

type ImageProps = {
  src: string;
  alt: string;
  aspectRatio?: string;
  className?: string;
  sizes?: string;
  srcSet?: string;
  priority?: boolean;
};

export function Image({ src, alt, aspectRatio = '1 / 1', className, sizes, srcSet, priority = false }: ImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  return (
    <div
      className={cn('relative w-full overflow-hidden bg-ink/5', className)}
      style={{ aspectRatio }}
    >
      {status !== 'error' ? (
        <img
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={cn(
            'h-full w-full object-cover transition-opacity duration-[var(--duration-base)]',
            status === 'loaded' ? 'opacity-100' : 'opacity-0',
          )}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted">
          <ImageOff className="h-6 w-6" aria-hidden="true" />
          <span className="text-xs">Image unavailable</span>
        </div>
      )}
    </div>
  );
}
