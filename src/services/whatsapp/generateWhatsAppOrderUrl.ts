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

/**
 * Builds the human-readable WhatsApp interest message. Centralized so no component constructs
 * this string itself. V1 is pre-order only — every product is a limited run of 50 pieces, and
 * nothing here is a confirmed order until AYUM replies on WhatsApp.
 */
export function buildOrderMessage(order: OrderDraft): string {
  const itemBlocks = order.items.map(formatItemBlock).join('\n\n');

  return [
    'Hello AYUM!',
    '',
    "I'm interested in the following limited-edition piece(s) — only 50 of each are being made.",
    '',
    `Reference: ${order.requestId}`,
    '',
    itemBlocks,
    '',
    `Estimated Total: ${formatPrice(order.subtotal)}`,
    '',
    "Please let me know about availability and how I can secure this before it's confirmed.",
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

export function generateCustomDesignInterestUrl(): string {
  return buildWhatsAppUrl("Hello AYUM! Create Your Own looks great — please notify me when it's live.");
}
