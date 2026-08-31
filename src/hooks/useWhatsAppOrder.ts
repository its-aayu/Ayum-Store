import { useState } from 'react';
import { buildOrderMessage, generateWhatsAppOrderUrl, type OrderDraft } from '@/services/whatsapp/generateWhatsAppOrderUrl';
import { track } from '@/services/analytics/track';

export function useWhatsAppOrder() {
  const [fallback, setFallback] = useState<{ message: string } | null>(null);

  function openOrder(order: OrderDraft) {
    const url = generateWhatsAppOrderUrl(order);
    track({ name: 'whatsapp_order_clicked', requestId: order.requestId });

    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win) {
      setFallback({ message: buildOrderMessage(order) });
    }
  }

  function closeFallback() {
    setFallback(null);
  }

  return { openOrder, fallback, closeFallback };
}
