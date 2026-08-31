import { useState } from 'react';
import { Image } from '@/components/common/Image';
import { cn } from '@/utils/cn';

export function ImageGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <Image src={images[active]} alt={name} aspectRatio="4 / 5" className="rounded-card" priority />
      {images.length > 1 && (
        <div className="mt-3 flex gap-2" role="tablist" aria-label="Product images">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              role="tab"
              aria-selected={active === index}
              aria-label={`View image ${index + 1} of ${images.length}`}
              onClick={() => setActive(index)}
              className={cn(
                'h-16 w-16 overflow-hidden rounded-md border-2',
                active === index ? 'border-brand-primary' : 'border-transparent',
              )}
            >
              <Image src={src} alt="" aspectRatio="1 / 1" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
