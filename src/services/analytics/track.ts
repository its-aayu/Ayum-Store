export type AnalyticsEvent =
  | { name: 'page_view'; path: string }
  | { name: 'product_view'; productId: string }
  | { name: 'category_view'; category: string }
  | { name: 'add_to_cart'; productId: string; quantity: number }
  | { name: 'remove_from_cart'; productId: string }
  | { name: 'custom_upload_started' }
  | { name: 'custom_upload_success'; designId: string }
  | { name: 'custom_upload_failed'; reason: string }
  | { name: 'whatsapp_order_clicked'; requestId: string }
  | { name: 'service_inquiry_clicked'; service?: string };

/**
 * Single funnel for all analytics events. Swap the console call for a real
 * provider (GA4, Plausible, etc.) here — nothing else in the app should
 * talk to an analytics SDK directly.
 */
export function track(event: AnalyticsEvent): void {
  if (import.meta.env.DEV) {
    console.info('[analytics]', event.name, event);
  }
  // Production wiring point: forward `event` to the configured analytics provider.
}
