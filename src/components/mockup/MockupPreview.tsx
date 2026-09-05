import { useEffect, useRef, useState } from 'react';
import { Image } from '@/components/common/Image';

export type PrintArea = { xPct: number; yPct: number; wPct: number; hPct: number };

const DEFAULT_PRINT_AREA: PrintArea = { xPct: 0.31, yPct: 0.3, wPct: 0.38, hPct: 0.38 };

// The product photo below is always rendered at this aspect ratio (see the `aspectRatio="4 / 5"`
// prop just below) — used to convert between the design box's width-fraction and height-fraction
// so a resize keeps the design's own proportions instead of stretching it.
const CONTAINER_ASPECT = 4 / 5;
const MIN_WIDTH_PCT = 0.08;
const MAX_WIDTH_PCT = 0.95;

type Transform = { cxPct: number; cyPct: number; wPct: number; rotationDeg: number };

function defaultTransform(printArea: PrintArea): Transform {
  return {
    cxPct: printArea.xPct + printArea.wPct / 2,
    cyPct: printArea.yPct + printArea.hPct / 2,
    wPct: printArea.wPct,
    rotationDeg: 0,
  };
}

type MockupPreviewProps = {
  productImage: string;
  productName: string;
  designPreviewUrl?: string;
  /** Natural pixel size of the uploaded design, when known — keeps the initial placement from
   * looking stretched before the browser finishes loading the image itself. */
  designWidth?: number;
  designHeight?: number;
  printArea?: PrintArea;
  /** Garment templates render on a dark card; product-card art sits better on white. */
  cardBackground?: 'white' | 'dark';
};

type DragMode = 'move' | 'resize' | 'rotate';

type DragState = {
  mode: DragMode;
  pointerId: number;
  rectWidth: number;
  rectHeight: number;
  startCxPct: number;
  startCyPct: number;
  startWPct: number;
  startRotationDeg: number;
  startPointerX: number;
  startPointerY: number;
  startDistance: number;
  startAngle: number;
};

/**
 * Template-based mockup: overlays the customer's artwork on a garment template within a
 * defined print area. The overlay is fully draggable, resizable (uniform scale, via the
 * corner handle) and rotatable (via the top handle) — the print-area rectangle is shown only
 * as a placement reference, not a hard boundary. Not a true 3D render — see disclaimer below.
 */
export function MockupPreview({
  productImage,
  productName,
  designPreviewUrl,
  designWidth,
  designHeight,
  printArea = DEFAULT_PRINT_AREA,
  cardBackground = 'white',
}: MockupPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<DragState | null>(null);

  const [designAspect, setDesignAspect] = useState(
    designWidth && designHeight ? designWidth / designHeight : 1,
  );
  const [transform, setTransform] = useState<Transform>(() => defaultTransform(printArea));

  // Reset placement whenever a different design is uploaded — a stale position/size/rotation
  // left over from a previous (differently shaped) design would no longer make sense.
  useEffect(() => {
    setTransform(defaultTransform(printArea));
    setDesignAspect(designWidth && designHeight ? designWidth / designHeight : 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [designPreviewUrl]);

  const hPct = (transform.wPct * CONTAINER_ASPECT) / designAspect;

  function beginDrag(mode: DragMode, e: React.PointerEvent<HTMLDivElement>) {
    const container = containerRef.current;
    if (!container) return;
    e.stopPropagation();
    e.preventDefault();
    const rect = container.getBoundingClientRect();
    const centerX = rect.left + transform.cxPct * rect.width;
    const centerY = rect.top + transform.cyPct * rect.height;
    dragState.current = {
      mode,
      pointerId: e.pointerId,
      rectWidth: rect.width,
      rectHeight: rect.height,
      startCxPct: transform.cxPct,
      startCyPct: transform.cyPct,
      startWPct: transform.wPct,
      startRotationDeg: transform.rotationDeg,
      startPointerX: e.clientX,
      startPointerY: e.clientY,
      startDistance: Math.hypot(e.clientX - centerX, e.clientY - centerY),
      startAngle: Math.atan2(e.clientY - centerY, e.clientX - centerX),
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== e.pointerId) return;

    if (drag.mode === 'move') {
      const dxPct = (e.clientX - drag.startPointerX) / drag.rectWidth;
      const dyPct = (e.clientY - drag.startPointerY) / drag.rectHeight;
      setTransform((t) => ({ ...t, cxPct: drag.startCxPct + dxPct, cyPct: drag.startCyPct + dyPct }));
      return;
    }

    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const centerX = rect.left + drag.startCxPct * rect.width;
    const centerY = rect.top + drag.startCyPct * rect.height;

    if (drag.mode === 'resize') {
      const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);
      const scaleFactor = drag.startDistance > 0 ? distance / drag.startDistance : 1;
      const newWPct = Math.min(MAX_WIDTH_PCT, Math.max(MIN_WIDTH_PCT, drag.startWPct * scaleFactor));
      setTransform((t) => ({ ...t, wPct: newWPct }));
      return;
    }

    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    const deltaDeg = ((angle - drag.startAngle) * 180) / Math.PI;
    setTransform((t) => ({ ...t, rotationDeg: drag.startRotationDeg + deltaDeg }));
  }

  function endDrag(e: React.PointerEvent<HTMLDivElement>) {
    if (dragState.current?.pointerId === e.pointerId) dragState.current = null;
  }

  return (
    <div>
      <div
        ref={containerRef}
        className={`relative overflow-hidden rounded-feature ${cardBackground === 'dark' ? 'bg-ink' : 'bg-white'}`}
      >
        <Image src={productImage} alt={productName} aspectRatio="4 / 5" />

        {designPreviewUrl && (
          <>
            {/* Suggested print area — a visual reference only; drag freely past it. */}
            <div
              className="pointer-events-none absolute rounded-md border-2 border-dashed border-current/20"
              style={{
                left: `${printArea.xPct * 100}%`,
                top: `${printArea.yPct * 100}%`,
                width: `${printArea.wPct * 100}%`,
                height: `${printArea.hPct * 100}%`,
                color: cardBackground === 'dark' ? '#F2F1ED' : '#161616',
              }}
            />

            <div
              className="absolute touch-none"
              style={{
                left: `${(transform.cxPct - transform.wPct / 2) * 100}%`,
                top: `${(transform.cyPct - hPct / 2) * 100}%`,
                width: `${transform.wPct * 100}%`,
                height: `${hPct * 100}%`,
                transform: `rotate(${transform.rotationDeg}deg)`,
              }}
              onPointerDown={(e) => beginDrag('move', e)}
              onPointerMove={handlePointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
            >
              <img
                src={designPreviewUrl}
                alt="Your design applied to the product"
                draggable={false}
                onLoad={(e) => {
                  const img = e.currentTarget;
                  if (img.naturalWidth && img.naturalHeight) {
                    setDesignAspect(img.naturalWidth / img.naturalHeight);
                  }
                }}
                className="h-full w-full cursor-move select-none object-contain drop-shadow-sm"
              />

              {/* Resize handle — drag to scale uniformly */}
              <div
                className="absolute -bottom-3 -right-3 flex h-6 w-6 touch-none items-center justify-center rounded-full border-2 border-white bg-brand-primary shadow-sm"
                style={{ cursor: 'nwse-resize' }}
                role="slider"
                aria-label={`Resize ${productName} design`}
                aria-valuenow={Math.round(transform.wPct * 100)}
                tabIndex={0}
                onPointerDown={(e) => beginDrag('resize', e)}
                onPointerMove={handlePointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
              />

              {/* Rotate handle — drag around the design's centre to tilt it */}
              <div className="absolute -top-9 left-1/2 h-4 w-px -translate-x-1/2 bg-brand-primary/60" aria-hidden="true" />
              <div
                className="absolute -top-12 left-1/2 flex h-6 w-6 -translate-x-1/2 touch-none items-center justify-center rounded-full border-2 border-white bg-brand-primary shadow-sm"
                style={{ cursor: 'grab' }}
                role="slider"
                aria-label={`Rotate ${productName} design`}
                aria-valuenow={Math.round(transform.rotationDeg)}
                tabIndex={0}
                onPointerDown={(e) => beginDrag('rotate', e)}
                onPointerMove={handlePointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
              />
            </div>
          </>
        )}
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <p className="text-xs text-muted">
          Drag to move, the corner handle to resize, and the top handle to rotate. Preview is for
          visual reference — actual print may vary slightly.
        </p>
        {designPreviewUrl && (
          <button
            type="button"
            onClick={() => setTransform(defaultTransform(printArea))}
            className="shrink-0 text-xs font-medium text-brand-primary hover:underline"
          >
            Reset placement
          </button>
        )}
      </div>
    </div>
  );
}
