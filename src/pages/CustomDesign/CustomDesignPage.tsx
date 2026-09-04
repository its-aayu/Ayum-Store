import { useState } from 'react';
import { Upload, Shirt, ShieldCheck, MessageCircle, ShoppingBag, Clock } from 'lucide-react';
import { Container } from '@/components/common/Container';
import { Image } from '@/components/common/Image';
import { Button } from '@/components/common/Button';
import { SeoHead } from '@/components/common/SeoHead';
import { FileUploader } from '@/components/custom-design/FileUploader';
import { CopyrightConfirmation } from '@/components/custom-design/CopyrightConfirmation';
import { MockupPreview } from '@/components/mockup/MockupPreview';
import { SizeSelector, ColorSelector } from '@/components/product/VariantSelector';
import { QuantitySelector } from '@/components/product/QuantitySelector';
import { QualityNote } from '@/components/trust/ProductTrustInfo';
import { WhatsAppFallbackModal } from '@/components/cart/WhatsAppFallbackModal';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useCart } from '@/context/CartContext';
import { useWhatsAppOrder } from '@/hooks/useWhatsAppOrder';
import { products } from '@/data/products';
import { formatPrice } from '@/utils/money';
import { generateOrderRequestId } from '@/utils/id';
import { validateVariantSelection } from '@/utils/variantValidation';
import { getGarmentTemplate } from '@/utils/garmentTemplate';
import { generateCustomDesignInterestUrl } from '@/services/whatsapp/generateWhatsAppOrderUrl';
import { cn } from '@/utils/cn';

const customizableProducts = products.filter((p) => p.allowCustomDesign && p.available);

// The upload → preview → order flow below is fully built and tested, but not opened to
// customers yet. Flip this to re-enable it — nothing else needs to change.
const CUSTOM_DESIGN_ENABLED = false;

const HOW_IT_WORKS = [
  { icon: Upload, title: 'Upload', body: 'Add your artwork — PNG, JPG, WEBP or PDF, up to 10 MB.' },
  { icon: Shirt, title: 'Choose & Preview', body: 'Pick a product and see your design placed on it instantly.' },
  { icon: ShieldCheck, title: 'We Review', body: 'A person checks print quality and rights before anything ships.' },
  { icon: MessageCircle, title: 'Confirm on WhatsApp', body: "We confirm price and delivery — you're not charged until then." },
];

function StepHeading({ number, title }: { number: number; title: string }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-semibold text-white">
        {number}
      </span>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-ink">{title}</h2>
    </div>
  );
}

export function CustomDesignPage() {
  const upload = useFileUpload();
  const { addItem } = useCart();
  const { openOrder, fallback, closeFallback } = useWhatsAppOrder();

  const [productId, setProductId] = useState(customizableProducts[0]?.id ?? '');
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [copyrightAccepted, setCopyrightAccepted] = useState(false);
  const [sizeError, setSizeError] = useState<string>();
  const [colorError, setColorError] = useState<string>();
  const [copyrightError, setCopyrightError] = useState<string>();
  const [confirmation, setConfirmation] = useState<'idle' | 'added'>('idle');

  const product = customizableProducts.find((p) => p.id === productId);
  const garmentTemplate = product ? getGarmentTemplate(product.category) : null;

  function validate(): boolean {
    const variantResult = validateVariantSelection({
      sizes: product?.sizes,
      colors: product?.colors,
      selectedSize: size,
      selectedColor: color,
    });
    setSizeError(variantResult.sizeError);
    setColorError(variantResult.colorError);

    let valid = variantResult.valid;
    if (upload.state !== 'success') valid = false;
    if (!copyrightAccepted) {
      setCopyrightError('Please confirm you have the rights to this design before continuing.');
      valid = false;
    } else {
      setCopyrightError(undefined);
    }
    return valid;
  }

  function handleAddToCart() {
    if (!validate() || !product || !upload.design) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      size: size ?? undefined,
      color: color ?? undefined,
      image: upload.design.previewUrl ?? product.images[0],
      customDesignId: upload.design.id,
      quantity,
    });
    setConfirmation('added');
    window.setTimeout(() => setConfirmation('idle'), 2500);
  }

  function handleOrderOnWhatsApp() {
    if (!validate() || !product || !upload.design) return;
    openOrder({
      requestId: generateOrderRequestId(),
      items: [
        {
          cartItemId: 'direct',
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
          size: size ?? undefined,
          color: color ?? undefined,
          customDesignId: upload.design.id,
        },
      ],
      subtotal: product.price * quantity,
    });
  }

  return (
    <>
      <SeoHead
        title="Create Your Own"
        description="Upload your own design and bring it to life on premium AYUM apparel and products."
      />

      {/* Intro — banner behind the text */}
      <section className="relative isolate min-h-[420px] overflow-hidden bg-ink text-white sm:min-h-[480px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/custom/custom-design-banner.jpg')" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-ink/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/20 to-ink/75" />

        <Container className="relative flex min-h-[420px] flex-col items-center justify-center gap-4 py-16 text-center sm:min-h-[480px] sm:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Create Your Own</p>
          <h1 className="max-w-2xl font-display text-4xl font-semibold leading-[1.05] sm:text-5xl">
            Your design. Our craft.
          </h1>
          <p className="max-w-lg text-sm text-white/80 sm:text-base">
            Upload your artwork, preview it instantly, and we'll review it personally before anything goes to
            print — launching soon.
          </p>
        </Container>
      </section>

      {/* How it works */}
      <section className="bg-white py-12 sm:py-16">
        <Container>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.title} className="flex gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-primary/10">
                  <step.icon className="h-5 w-5 text-brand-primary" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-ink">{step.title}</h2>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {CUSTOM_DESIGN_ENABLED ? (
      <Container className="py-10 sm:py-14">
        <div className="mx-auto grid max-w-4xl gap-10 lg:grid-cols-2">
          <div className="space-y-8">
            <section>
              <StepHeading number={1} title="Upload your design" />
              <FileUploader
                state={upload.state}
                progress={upload.progress}
                error={upload.error}
                onSelectFile={upload.selectFile}
                onRetry={upload.retry}
                previewUrl={upload.design?.previewUrl}
              />
              <ul className="mt-4 space-y-1 text-xs text-muted">
                <li>For the best print result:</li>
                <li>• Upload the original/highest-quality file.</li>
                <li>• PNG is preferred for transparent artwork.</li>
                <li>• Avoid screenshots when possible.</li>
                <li>• Avoid blurry or heavily compressed images.</li>
                <li>• Final print suitability is subject to review.</li>
              </ul>
            </section>

            {customizableProducts.length > 0 && (
              <section>
                <StepHeading number={2} title="Choose a product" />
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {customizableProducts.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setProductId(p.id);
                        setSize(null);
                        setColor(null);
                      }}
                      aria-pressed={p.id === productId}
                      className={cn(
                        'overflow-hidden rounded-button border text-left transition-colors',
                        p.id === productId
                          ? 'border-ink ring-1 ring-ink'
                          : 'border-ink/15 hover:border-ink/40',
                      )}
                    >
                      <Image src={p.images[0]} alt="" aspectRatio="4 / 3" />
                      <div className="p-2">
                        <p className="truncate text-xs font-medium text-ink">{p.name}</p>
                        <p className="text-xs text-muted">{formatPrice(p.price)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {product && (
              <section>
                <StepHeading number={3} title="Variant & quantity" />
                <div className="space-y-5">
                  {product.colors && product.colors.length > 0 && (
                    <ColorSelector colors={product.colors} value={color} onChange={setColor} error={colorError} />
                  )}
                  {product.sizes && product.sizes.length > 0 && (
                    <SizeSelector sizes={product.sizes} value={size} onChange={setSize} error={sizeError} />
                  )}
                  <QuantitySelector value={quantity} onChange={setQuantity} />
                </div>
              </section>
            )}

            <section>
              <StepHeading number={4} title="Confirm rights" />
              <CopyrightConfirmation
                checked={copyrightAccepted}
                onChange={setCopyrightAccepted}
                error={copyrightError}
              />
            </section>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Preview</h2>
            {product ? (
              <MockupPreview
                productImage={garmentTemplate?.image ?? product.images[0]}
                productName={product.name}
                designPreviewUrl={upload.design?.previewUrl}
                printArea={garmentTemplate?.printArea}
                cardBackground={garmentTemplate ? 'dark' : 'white'}
              />
            ) : (
              <p className="text-sm text-muted">Choose a product to see a preview.</p>
            )}

            {product && (
              <div className="mt-6 rounded-feature border border-border bg-white p-5">
                <h3 className="text-sm font-semibold">Order Request</h3>
                <dl className="mt-3 space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted">Product</dt>
                    <dd className="text-ink">{product.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted">Quantity</dt>
                    <dd className="text-ink">{quantity}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted">Website Price</dt>
                    <dd className="font-medium text-ink">{formatPrice(product.price * quantity)}</dd>
                  </div>
                </dl>

                <div className="mt-5 flex flex-col gap-3">
                  <Button variant="primary" size="lg" onClick={handleAddToCart}>
                    <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                    {confirmation === 'added' ? 'Added to cart' : 'Add to cart'}
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleOrderOnWhatsApp}>
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    Continue on WhatsApp
                  </Button>
                </div>

                <div className="mt-5 border-t border-border pt-4">
                  <QualityNote />
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
      ) : (
        <Container className="py-14 sm:py-20">
          <div className="mx-auto max-w-lg rounded-feature border border-border bg-white p-8 text-center sm:p-10">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary/10">
              <Clock className="h-6 w-6 text-brand-primary" aria-hidden="true" />
            </span>
            <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-brand-primary">Coming soon</p>
            <h2 className="mt-2 text-xl font-semibold text-ink sm:text-2xl">
              Upload-your-own-design isn't open yet
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              We're finishing print-quality review and mockup previews before opening this to everyone. Leave your
              details on WhatsApp and we'll notify you the moment it's live.
            </p>
            <a
              href={generateCustomDesignInterestUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-button bg-brand-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-primary/90"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Notify me on WhatsApp
            </a>
          </div>
        </Container>
      )}
      <WhatsAppFallbackModal message={fallback?.message ?? null} onClose={closeFallback} />
    </>
  );
}
