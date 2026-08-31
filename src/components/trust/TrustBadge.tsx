import type { LucideIcon } from 'lucide-react';

type TrustBadgeProps = {
  icon: LucideIcon;
  label: string;
  description?: string;
};

export function TrustBadge({ icon: Icon, label, description }: TrustBadgeProps) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-primary" aria-hidden="true" />
      <div>
        <p className="text-sm font-medium text-ink">{label}</p>
        {description && <p className="text-xs text-muted">{description}</p>}
      </div>
    </div>
  );
}
