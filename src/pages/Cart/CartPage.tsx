import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Container } from '@/components/common/Container';
import { Image } from '@/components/common/Image';
import { Button, buttonClasses } from '@/components/common/Button';
import { SeoHead } from '@/components/common/SeoHead';
import { WhatsAppFallbackModal } from '@/components/cart/WhatsAppFallbackModal';
import { useCart } from '@/context/CartContext';
import { useWhatsAppOrder } from '@/hooks/useWhatsAppOrder';
import { formatPrice } from '@/utils/money';
import { generateOrderRequestId } from '@/utils/id';
import { track } from '@/services/analytics/track';

export function CartPage() {
  const { items, subtotal, increaseQuantity, decreaseQuantity, removeItem } = useCart();
  const { openOrder, fallback, closeFallback } = useWhatsAppOrder();

  function handleContinueToWhatsApp() {
    openOrder({ requestId: generateOrderRequestId(), items, subtotal });
  }

  if (items.length === 0) {
    return (
      <>
        <SeoHead title="Your Cart" description="Your AYUM cart." noIndex />
        <Container className="flex min-h-[50vh] flex-col items-center justify-center gap-4 py-24 text-center">
          <ShoppingBag className="h-10 w-10 text-ink/30" aria-hidden="true" />
          <p className="text-sm text-muted">Your cart is empty.</p>
          <Link to="/shop" className={buttonClasses('primary', 'md')}>
            Explore Designs
          </Link>
        </Container>
      </>
    );
  }

  return (
    <>
      <SeoHead title="Your Cart" description="Review your AYUM order before continuing on WhatsApp." noIndex />
      <Container className="py-10 sm:py-14">
        <h1 className="text-2xl font-semibold sm:text-3xl">Order Request</h1>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
          <ul className="divide-y divide-border">
            {items.map((item) => (
              <li key={item.cartItemId} className="flex gap-4 py-5">
                {item.image && (
                  <div className="w-20 shrink-0 sm:w-24">
                    <Image src={item.image} alt={item.name} aspectRatio="4 / 5" className="rounded-md" />
                  </div>
                )}
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink">{item.name}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {[item.size, item.color].filter(Boolean).join(' · ')}
                    </p>
                    {item.customDesignId && (
                      <p className="mt-1 text-xs font-medium text-brand-primary">Custom design attached</p>
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center rounded-button border border-ink/20">
                      <button
                        type="button"
                        onClick={() => decreaseQuantity(item.cartItemId)}
                        aria-label={`Decrease quantity of ${item.name}`}
                        className="flex h-8 w-8 items-center justify-center text-ink disabled:opacity-30"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                      <span className="w-6 text-center text-xs font-medium tabular-nums">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => increaseQuantity(item.cartItemId)}
                        aria-label={`Increase quantity of ${item.name}`}
                        className="flex h-8 w-8 items-center justify-center text-ink"
                      >
                        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-semibold text-ink">{formatPrice(item.price * item.quantity)}</p>
                      <button
                        type="button"
                        onClick={() => {
                          track({ name: 'remove_from_cart', productId: item.productId });
                          removeItem(item.cartItemId);
                        }}
                        aria-label={`Remove ${item.name} from cart`}
                        className="text-ink/40 hover:text-error"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="h-fit rounded-feature border border-border bg-white p-6">
            <h2 className="text-base font-semibold">Order Summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="font-medium text-ink">{formatPrice(subtotal)}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-muted">Shipping/payment: confirmed on WhatsApp.</p>
            <Button variant="primary" size="lg" className="mt-6 w-full" onClick={handleContinueToWhatsApp}>
              Continue to WhatsApp
            </Button>
          </div>
        </div>
      </Container>
      <WhatsAppFallbackModal message={fallback?.message ?? null} onClose={closeFallback} />
    </>
  );
}
