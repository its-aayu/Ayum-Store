import type { CartItem } from './cart';

export type OrderDraft = {
  requestId: string;
  items: CartItem[];
  subtotal: number;
  createdAt: string;
};
