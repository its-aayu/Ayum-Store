import { describe, expect, it } from 'vitest';
import { buildOrderMessage, generateWhatsAppOrderUrl } from '@/services/whatsapp/generateWhatsAppOrderUrl';
import type { CartItem } from '@/types';

const items: CartItem[] = [
  {
    cartItemId: 'ci_1',
    productId: 'AY-OT001',
    name: 'Oversized Graphic Tee',
    price: 699,
    quantity: 1,
    size: 'XL',
    color: 'Black',
    customDesignId: 'AY-CUSTOM-8F29A',
  },
];

describe('buildOrderMessage', () => {
  it('includes product, quantity, variant and custom design details', () => {
    const message = buildOrderMessage({ requestId: 'AY-REQ-8F29A', items, subtotal: 699 });

    expect(message).toContain('AY-REQ-8F29A');
    expect(message).toContain('AY-OT001');
    expect(message).toContain('Oversized Graphic Tee');
    expect(message).toContain('Size: XL');
    expect(message).toContain('Colour: Black');
    expect(message).toContain('Quantity: 1');
    expect(message).toContain('Custom Design ID: AY-CUSTOM-8F29A');
    expect(message).not.toContain('Order confirmed');
  });

  it('lists every item when there are multiple products', () => {
    const message = buildOrderMessage({
      requestId: 'AY-REQ-000000',
      items: [
        ...items,
        {
          cartItemId: 'ci_2',
          productId: 'AY-MG001',
          name: 'Ceramic Mug',
          price: 399,
          quantity: 2,
        },
      ],
      subtotal: 699 + 399 * 2,
    });

    expect(message).toContain('AY-OT001');
    expect(message).toContain('AY-MG001');
  });
});

describe('generateWhatsAppOrderUrl', () => {
  it('builds a wa.me URL containing the encoded order message', () => {
    const url = generateWhatsAppOrderUrl({ requestId: 'AY-REQ-8F29A', items, subtotal: 699 });
    expect(url).toContain('https://wa.me/');
    expect(url).toContain(encodeURIComponent('AY-REQ-8F29A'));
  });
});
