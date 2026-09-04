import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MessageCircle, Palette, Ruler, Sparkles } from 'lucide-react';
import { Container } from '@/components/common/Container';
import { Image } from '@/components/common/Image';
import { Button } from '@/components/common/Button';
import { SeoHead } from '@/components/common/SeoHead';
import { StructuredData } from '@/components/common/StructuredData';
import { ImageGallery } from '@/components/product/ImageGallery';
import { ComingSoonOverlay } from '@/components/product/ComingSoonOverlay';
import { SizeSelector, ColorSelector } from '@/components/product/VariantSelector';
import { QuantitySelector } from '@/components/product/QuantitySelector';
import { ShippingInfo, ReturnInfo, QualityNote } from '@/components/trust/ProductTrustInfo';
import { WhatsAppFallbackModal } from '@/components/cart/WhatsAppFallbackModal';
import { getProductBySlug } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/money';
import { siteConfig } from '@/config/site';
import { useWhatsAppOrder } from '@/hooks/useWhatsAppOrder';
import { generateOrderRequestId } from '@/utils/id';
import { validateVariantSelection } from '@/utils/variantValidation';
import { track } from '@/services/analytics/track';
import { NotFoundPage } from '@/pages/NotFound/NotFoundPage';

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addItem } = useCart();
  const { openOrder, fallback, closeFallback } = useWhatsAppOrder();

  const product = slug ? getProductBySlug(slug) : undefined;

  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState<string | undefined>();
  const [colorError, setColorError] = useState<string | undefined>();
  const [confirmation, setConfirmation] = useState<'idle' | 'added'>('idle');

  useEffect(() => {
    if (product) track({ name: 'product_view', productId: product.id });
  }, [product]);

  if (!product) {
    return <NotFoundPage />;
  }

  const isLimited = product.tags?.includes('limited');

  function validateSelection(): boolean {
    const result = validateVariantSelection({
      sizes: product!.sizes,
      colors: product!.colors,
      selectedSize: size,
      selectedColor: color,
    });
    setSizeError(result.sizeError);
    setColorError(result.colorError);
    return result.valid;
  }

  function handleAddToCart() {
    if (!validateSelection()) return;
    addItem({
      productId: product!.id,
      name: product!.name,
      price: product!.price,
      size: size ?? undefined,
      color: color ?? undefined,
      image: product!.images[0],
      quantity,
    });
    track({ name: 'add_to_cart', productId: product!.id, quantity });
    setConfirmation('added');
    window.setTimeout(() => setConfirmation('idle'), 2500);
  }

  function handleOrderOnWhatsApp() {
    if (!validateSelection()) return;
    openOrder({
      requestId: generateOrderRequestId(),
      items: [
        {
          cartItemId: 'direct',
          productId: product!.id,
          name: product!.name,
          price: product!.price,
          quantity,
          size: size ?? undefined,
          color: color ?? undefined,
        },
      ],
      subtotal: product!.price * quantity,
    });
  }

  return (
    <>
      <SeoHead
        title={product.name}
        description={product.description}
        image={product.images[0] ? `${siteConfig.siteUrl}${product.images[0]}` : undefined}
      />
      <StructuredData
        id="product-schema"
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.description,
          image: product.images.map((src) => `${siteConfig.siteUrl}${src}`),
          brand: { '@type': 'Brand', name: 'AYUM' },
          offers: {
            '@type': 'Offer',
            priceCurrency: product.currency,
            price: product.price,
            availability: product.comingSoon
              ? 'https://schema.org/PreOrder'
              : product.available
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            url: `${siteConfig.siteUrl}/product/${product.slug}`,
          },
        }}
      />
      <Container className="py-8 sm:py-12">
        <nav className="mb-6 text-xs text-muted" aria-label="Breadcrumb">
          <Link to="/shop" className="hover:text-ink">
            Shop
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {product.comingSoon ? (
            <div className="relative overflow-hidden rounded-card bg-white" style={{ aspectRatio: '4 / 5' }}>
              <Image src={product.images[0]} alt={product.name} aspectRatio="4 / 5" className="scale-110 blur-md" />
              <ComingSoonOverlay />
            </div>
          ) : (
            <ImageGallery images={product.images} name={product.name} />
          )}

          <div>
            <h1 className="text-2xl font-semibold sm:text-3xl">{product.name}</h1>

            {product.comingSoon ? (
              <>
                <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-brand-primary">Coming soon</p>
                <p className="mt-4 text-sm leading-relaxed text-muted">{product.description}</p>
                <p className="mt-6 rounded-button bg-ink/5 px-4 py-3 text-sm text-muted">
                  This design isn't photographed yet, so it can't be previewed or reserved here. Follow AYUM on
                  Instagram or check back soon — it'll open for interest as soon as it's ready.
                </p>
              </>
            ) : (
              <>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <p className="text-xl font-semibold text-ink">{formatPrice(product.price)}</p>
                  {isLimited && (
                    <span className="inline-flex items-center gap-1 rounded-pill bg-brand-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-primary">
                      <Sparkles className="h-3 w-3" aria-hidden="true" />
                      Only 50 made
                    </span>
                  )}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted">{product.description}</p>

                {!product.available && (
                  <p className="mt-4 rounded-button bg-error/10 px-3 py-2 text-sm font-medium text-error">
                    This product is currently unavailable.
                  </p>
                )}

                <div className="mt-6 space-y-6">
                  {product.colors && product.colors.length > 0 && (
                    <ColorSelector colors={product.colors} value={color} onChange={setColor} error={colorError} />
                  )}
                  {product.sizes && product.sizes.length > 0 && (
                    <div>
                      <SizeSelector sizes={product.sizes} value={size} onChange={setSize} error={sizeError} />
                      <button
                        type="button"
                        className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-ink/60 hover:text-ink"
                      >
                        <Ruler className="h-3.5 w-3.5" aria-hidden="true" />
                        Size guide
                      </button>
                    </div>
                  )}
                  <QuantitySelector value={quantity} onChange={setQuantity} />
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button
                    variant="primary"
                    size="lg"
                    className="flex-1"
                    disabled={!product.available}
                    onClick={handleAddToCart}
                  >
                    {confirmation === 'added' ? 'Added to your interest list' : 'Show Interest'}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1"
                    disabled={!product.available}
                    onClick={handleOrderOnWhatsApp}
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    Message on WhatsApp
                  </Button>
                </div>
                <p className="mt-3 text-xs text-muted">
                  This is a pre-order request, not a confirmed purchase — only 50 pieces are being made. AYUM will
                  reach out on WhatsApp to confirm availability and next steps before any payment.
                </p>

                {product.allowCustomDesign && (
                  <Link
                    to="/custom"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-primary hover:underline"
                  >
                    <Palette className="h-4 w-4" aria-hidden="true" />
                    Want your own design on this? Create Your Own
                  </Link>
                )}

                <dl className="mt-8 grid grid-cols-1 gap-3 border-t border-border pt-6 text-sm sm:grid-cols-2">
                  {product.material && (
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-muted">Material</dt>
                      <dd className="mt-0.5 text-ink">{product.material}</dd>
                    </div>
                  )}
                  {product.printMethod && (
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-muted">Print method</dt>
                      <dd className="mt-0.5 text-ink">{product.printMethod}</dd>
                    </div>
                  )}
                  {product.careInstructions && product.careInstructions.length > 0 && (
                    <div className="sm:col-span-2">
                      <dt className="text-xs uppercase tracking-wide text-muted">Care</dt>
                      <dd className="mt-0.5 text-ink">{product.careInstructions.join(' · ')}</dd>
                    </div>
                  )}
                </dl>

                <div className="mt-8 space-y-4 border-t border-border pt-6">
                  <ShippingInfo deliveryEstimate={product.deliveryEstimate} />
                  <ReturnInfo />
                  <QualityNote />
                </div>
              </>
            )}
          </div>
        </div>
      </Container>
      <WhatsAppFallbackModal message={fallback?.message ?? null} onClose={closeFallback} />
    </>
  );
}
