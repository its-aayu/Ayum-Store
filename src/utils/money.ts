import { siteConfig } from '@/config/site';

/** Integer INR values only — never floating point currency math. */
export function formatPrice(amount: number): string {
  return `${siteConfig.currencySymbol}${Math.round(amount).toLocaleString('en-IN')}`;
}
