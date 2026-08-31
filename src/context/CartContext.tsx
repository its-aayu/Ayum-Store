import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { CartItem } from '@/types';
import { generateCartItemId } from '@/utils/id';
import { siteConfig } from '@/config/site';

const STORAGE_KEY = 'ayum:cart';

export type AddToCartInput = Omit<CartItem, 'cartItemId' | 'quantity'> & { quantity?: number };

type CartContextValue = {
  items: CartItem[];
  addItem: (input: AddToCartInput) => void;
  removeItem: (cartItemId: string) => void;
  increaseQuantity: (cartItemId: string) => void;
  decreaseQuantity: (cartItemId: string) => void;
  setQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
};

const CartContext = createContext<CartContextValue | null>(null);

function readInitialCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function sameLine(a: AddToCartInput, b: CartItem): boolean {
  return (
    a.productId === b.productId &&
    a.size === b.size &&
    a.color === b.color &&
    a.customDesignId === b.customDesignId
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readInitialCart);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // localStorage may be unavailable (private mode, quota) — cart just won't persist.
    }
  }, [items]);

  const addItem = (input: AddToCartInput) => {
    setItems((prev) => {
      const existing = prev.find((item) => sameLine(input, item));
      const quantityToAdd = input.quantity ?? 1;
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === existing.cartItemId
            ? {
                ...item,
                quantity: Math.min(siteConfig.quantity.max, item.quantity + quantityToAdd),
              }
            : item,
        );
      }
      const newItem: CartItem = {
        ...input,
        cartItemId: generateCartItemId(),
        quantity: Math.min(siteConfig.quantity.max, Math.max(siteConfig.quantity.min, quantityToAdd)),
      };
      return [...prev, newItem];
    });
  };

  const removeItem = (cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const setQuantity = (cartItemId: string, quantity: number) => {
    const bounded = Math.min(siteConfig.quantity.max, Math.max(siteConfig.quantity.min, quantity));
    setItems((prev) => prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: bounded } : item)));
  };

  const increaseQuantity = (cartItemId: string) => {
    const item = items.find((i) => i.cartItemId === cartItemId);
    if (item) setQuantity(cartItemId, item.quantity + 1);
  };

  const decreaseQuantity = (cartItemId: string) => {
    const item = items.find((i) => i.cartItemId === cartItemId);
    if (item) setQuantity(cartItemId, item.quantity - 1);
  };

  const clearCart = () => setItems([]);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    setQuantity,
    clearCart,
    subtotal,
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
