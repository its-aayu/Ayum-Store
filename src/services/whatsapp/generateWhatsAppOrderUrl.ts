import type { CartItem } from '@/types';
import { siteConfig } from '@/config/site';
import { formatPrice } from '@/utils/money';

export type OrderDraft = {
  requestId: string;
  items: CartItem[];
  subtotal: number;
};

function buildWhatsAppUrl(message: string): string {
  const number = siteConfig.contact.whatsappNumber;
  const encoded = encodeURIComponent(message);
  return number ? `https://wa.me/${number}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
}

function formatItemBlock(item: CartItem): string {
  const lines = [`${item.productId} — ${item.name}`];
  if (item.size) lines.push(`Size: ${item.size}`);
  if (item.color) lines.push(`Colour: ${item.color}`);
  lines.push(`Quantity: ${item.quantity}`);
  lines.push(`Website Price: ${formatPrice(item.price * item.quantity)}`);
  if (item.customDesignId) {
    lines.push('Custom Design: Yes');
    lines.push(`Custom Design ID: ${item.customDesignId}`);
  }
  return lines.join('\n');
}

/** Builds the human-readable WhatsApp order message. Centralized so no component constructs this string itself. */
export function buildOrderMessage(order: OrderDraft): string {
  const itemBlocks = order.items.map(formatItemBlock).join('\n\n');

  return [
    'Hello AYUM!',
    '',
    'I would like to place an order.',
    '',
    `Order Reference: ${order.requestId}`,
    '',
    itemBlocks,
    '',
    `Order Total: ${formatPrice(order.subtotal)}`,
    '',
    'Please confirm availability, final price and delivery details.',
  ].join('\n');
}

export function generateWhatsAppOrderUrl(order: OrderDraft): string {
  return buildWhatsAppUrl(buildOrderMessage(order));
}

export function generateServiceInquiryUrl(serviceName?: string): string {
  const message = serviceName
    ? `Hello AYUM! I'd like to discuss ${serviceName} for my project.`
    : "Hello AYUM! I'd like to discuss a project with your creative studio.";
  return buildWhatsAppUrl(message);
}

export function generateGeneralContactUrl(): string {
  return buildWhatsAppUrl('Hello AYUM! I have a question.');
}
