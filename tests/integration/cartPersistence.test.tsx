import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { CartProvider, useCart } from '@/context/CartContext';

function CartSummary() {
  const { items, itemCount, addItem } = useCart();
  return (
    <div>
      <button onClick={() => addItem({ productId: 'AY-MG001', name: 'Ceramic Mug', price: 399, quantity: 1 })}>
        Add mug
      </button>
      <p data-testid="count">{itemCount}</p>
      <p data-testid="names">{items.map((i) => i.name).join(', ')}</p>
    </div>
  );
}

beforeEach(() => {
  window.localStorage.clear();
});

describe('cart localStorage persistence', () => {
  it('survives a full unmount and remount of the CartProvider', async () => {
    const first = render(
      <CartProvider>
        <CartSummary />
      </CartProvider>,
    );

    await act(async () => {
      screen.getByText('Add mug').click();
    });
    expect(screen.getByTestId('count').textContent).toBe('1');

    first.unmount();

    render(
      <CartProvider>
        <CartSummary />
      </CartProvider>,
    );

    expect(screen.getByTestId('count').textContent).toBe('1');
    expect(screen.getByTestId('names').textContent).toBe('Ceramic Mug');
  });

  it('starts empty when localStorage has no cart yet', () => {
    render(
      <CartProvider>
        <CartSummary />
      </CartProvider>,
    );
    expect(screen.getByTestId('count').textContent).toBe('0');
  });

  it('ignores corrupted localStorage content instead of crashing', () => {
    window.localStorage.setItem('ayum:cart', '{not valid json');

    render(
      <CartProvider>
        <CartSummary />
      </CartProvider>,
    );

    expect(screen.getByTestId('count').textContent).toBe('0');
  });
});
