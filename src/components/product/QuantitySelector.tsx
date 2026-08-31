import { Minus, Plus } from 'lucide-react';
import { siteConfig } from '@/config/site';

type QuantitySelectorProps = {
  value: number;
  onChange: (value: number) => void;
};

export function QuantitySelector({ value, onChange }: QuantitySelectorProps) {
  const { min, max } = siteConfig.quantity;

  return (
    <div>
      <span className="text-sm font-medium text-ink" id="quantity-label">
        Quantity
      </span>
      <div className="mt-2 inline-flex h-11 items-center rounded-button border border-ink/20" role="group" aria-labelledby="quantity-label">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label="Decrease quantity"
          className="flex h-full w-10 items-center justify-center text-ink disabled:opacity-30"
        >
          <Minus className="h-4 w-4" aria-hidden="true" />
        </button>
        <span className="w-8 text-center text-sm font-medium tabular-nums" aria-live="polite">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label="Increase quantity"
          className="flex h-full w-10 items-center justify-center text-ink disabled:opacity-30"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
