import { cn } from '@/utils/cn';
import type { ProductColor } from '@/types';

type SizeSelectorProps = {
  sizes: string[];
  value: string | null;
  onChange: (size: string) => void;
  error?: string;
};

export function SizeSelector({ sizes, value, onChange, error }: SizeSelectorProps) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-ink">Size</legend>
      <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Size">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            role="radio"
            aria-checked={value === size}
            onClick={() => onChange(size)}
            className={cn(
              'h-10 min-w-10 rounded-button border px-3 text-sm font-medium transition-colors',
              value === size
                ? 'border-ink bg-ink text-white'
                : 'border-ink/20 text-ink hover:border-ink/50',
            )}
          >
            {size}
          </button>
        ))}
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-error" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}

type ColorSelectorProps = {
  colors: ProductColor[];
  value: string | null;
  onChange: (color: string) => void;
  error?: string;
};

export function ColorSelector({ colors, value, onChange, error }: ColorSelectorProps) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-ink">Colour{value ? ` — ${value}` : ''}</legend>
      <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Colour">
        {colors.map((color) => (
          <button
            key={color.name}
            type="button"
            role="radio"
            aria-checked={value === color.name}
            aria-label={color.name}
            title={color.name}
            onClick={() => onChange(color.name)}
            className={cn(
              'h-9 w-9 rounded-full border-2 transition-transform',
              value === color.name ? 'border-brand-primary scale-110' : 'border-transparent',
            )}
            style={{ boxShadow: `0 0 0 1px var(--color-border) inset` }}
          >
            <span
              className="block h-full w-full rounded-full"
              style={{ backgroundColor: color.hex ?? '#ccc' }}
            />
          </button>
        ))}
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-error" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}
