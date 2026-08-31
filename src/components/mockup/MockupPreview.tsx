import { Image } from '@/components/common/Image';

export type PrintArea = { xPct: number; yPct: number; wPct: number; hPct: number };

const DEFAULT_PRINT_AREA: PrintArea = { xPct: 0.31, yPct: 0.3, wPct: 0.38, hPct: 0.38 };

type MockupPreviewProps = {
  productImage: string;
  productName: string;
  designPreviewUrl?: string;
  printArea?: PrintArea;
  /** Garment templates render on a dark card; product-card art sits better on white. */
  cardBackground?: 'white' | 'dark';
};

/**
 * Template-based mockup: overlays the customer's artwork on a garment template
 * within a defined print area. Not a true 3D render — see disclaimer below.
 */
export function MockupPreview({
  productImage,
  productName,
  designPreviewUrl,
  printArea = DEFAULT_PRINT_AREA,
  cardBackground = 'white',
}: MockupPreviewProps) {
  return (
    <div>
      <div
        className={`relative overflow-hidden rounded-feature ${cardBackground === 'dark' ? 'bg-ink' : 'bg-white'}`}
      >
        <Image src={productImage} alt={productName} aspectRatio="4 / 5" />
        {designPreviewUrl && (
          <div
            className="pointer-events-none absolute"
            style={{
              left: `${printArea.xPct * 100}%`,
              top: `${printArea.yPct * 100}%`,
              width: `${printArea.wPct * 100}%`,
              height: `${printArea.hPct * 100}%`,
            }}
          >
            <img
              src={designPreviewUrl}
              alt="Your design applied to the product"
              className="h-full w-full object-contain drop-shadow-sm"
            />
          </div>
        )}
      </div>
      <p className="mt-3 text-xs text-muted">
        Preview is for visual reference. Actual print may vary slightly.
      </p>
    </div>
  );
}
