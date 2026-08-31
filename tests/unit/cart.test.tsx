import { describe, expect, it, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '@/context/CartContext';
import { siteConfig } from '@/config/site';

function wrapper({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}

beforeEach(() => {
  window.localStorage.clear();
});

describe('useCart', () => {
  it('adds an item and computes subtotal / item count', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem({ productId: 'AY-TS001', name: 'Classic Crest Tee', price: 799, quantity: 2 });
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.itemCount).toBe(2);
    expect(result.current.subtotal).toBe(1598);
  });

  it('merges items with the same product/variant instead of duplicating', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem({ productId: 'AY-TS001', name: 'Classic Crest Tee', price: 799, size: 'M', quantity: 1 });
      result.current.addItem({ productId: 'AY-TS001', name: 'Classic Crest Tee', price: 799, size: 'M', quantity: 1 });
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
  });

  it('keeps different variants of the same product as separate lines', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem({ productId: 'AY-TS001', name: 'Classic Crest Tee', price: 799, size: 'M', quantity: 1 });
      result.current.addItem({ productId: 'AY-TS001', name: 'Classic Crest Tee', price: 799, size: 'L', quantity: 1 });
    });

    expect(result.current.items).toHaveLength(2);
  });

  it('bounds quantity to the configured maximum', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem({ productId: 'AY-TS001', name: 'Classic Crest Tee', price: 799, quantity: siteConfig.quantity.max + 5 });
    });

    expect(result.current.items[0].quantity).toBe(siteConfig.quantity.max);
  });

  it('removes an item by cartItemId', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem({ productId: 'AY-TS001', name: 'Classic Crest Tee', price: 799, quantity: 1 });
    });
    const id = result.current.items[0].cartItemId;

    act(() => {
      result.current.removeItem(id);
    });

    expect(result.current.items).toHaveLength(0);
  });

  it('clamps quantity to a minimum of 1 when decreasing', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem({ productId: 'AY-TS001', name: 'Classic Crest Tee', price: 799, quantity: 1 });
    });
    const id = result.current.items[0].cartItemId;

    act(() => {
      result.current.decreaseQuantity(id);
      result.current.decreaseQuantity(id);
    });

    expect(result.current.items[0].quantity).toBe(1);
  });
});
