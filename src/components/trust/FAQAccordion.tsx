import { ChevronDown } from 'lucide-react';
import type { FaqItem } from '@/data/faq';

export function FAQAccordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-border">
      {items.map((item) => (
        <details key={item.question} className="group py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
            <span className="text-sm font-medium text-ink sm:text-base">{item.question}</span>
            <ChevronDown
              className="h-5 w-5 shrink-0 text-ink/50 transition-transform group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-muted">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
