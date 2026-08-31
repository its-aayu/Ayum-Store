import { Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import { TrustBadge } from './TrustBadge';

export function ShippingInfo({ deliveryEstimate }: { deliveryEstimate?: string }) {
  return (
    <TrustBadge
      icon={Truck}
      label="Delivery"
      description={deliveryEstimate ? `Estimated ${deliveryEstimate}` : 'Estimated 5–8 business days'}
    />
  );
}

export function ReturnInfo() {
  return (
    <TrustBadge
      icon={RotateCcw}
      label="Returns & exchanges"
      description="Standard products are eligible under our Returns policy."
    />
  );
}

export function QualityNote() {
  return (
    <TrustBadge
      icon={ShieldCheck}
      label="Quality checked"
      description="Every order is reviewed before it goes to print."
    />
  );
}
