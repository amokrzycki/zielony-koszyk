import { type ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import { DUR } from "@/components/listingStyles.ts";

interface SwapLayersProps {
  /** Changing the id swaps the content: the old layer fades out over the new one, which fades in. */
  id: string;
  children: ReactNode;
  /**
   * How the container height follows the content.
   * - `true`: always (measured and eased), for panels whose content loads in after the swap.
   * - `"swap"`: only for the swap itself, then released to auto. For page-level wrappers whose
   *   descendants already tween their own height, so the two never fight.
   * - `false`: never.
   */
  tween?: boolean | "swap";
}

// flow-root: child margins (e.g. a page's `margin: 60px auto`) stay inside the layer, so the measured height is the
// real one. Without it they collapse through and are missed, which clipped the page and made it jump on release.
const LAYER_STYLE = { display: "flow-root" } as const;

/**
 * Smooth content swap. The outgoing layer stays mounted as an overlay and fades out; the incoming one
 * fades in. The container height is measured and eased between the old and new content heights, so the
 * panel never jumps and never dips through an intermediate (loader) height.
 * The first render never animates. See .swap-* in App.css.
 */
function SwapLayers({ id, children, tween = true }: SwapLayersProps) {
  const swapOnly = tween === "swap";
  const [shown, setShown] = useState({ id, children });
  const [leaving, setLeaving] = useState<typeof shown | null>(null);
  const [swapped, setSwapped] = useState(false);
  const [settling, setSettling] = useState(false);
  const [height, setHeight] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);
  const layerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const lastHeight = useRef<number | null>(null);
  const mounted = useRef(false);
  const releaseTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Adjust state during render when the id changes: park the old layer as `leaving`.
  if (shown.id !== id) {
    setLeaving(shown);
    setShown({ id, children });
    setSwapped(true);
    setSettling(true);
  }

  useEffect(() => {
    if (!leaving) return;
    const timer = setTimeout(() => setLeaving(null), DUR.slow);
    return () => clearTimeout(timer);
  }, [leaving]);

  // Swap-only mode: pin the old height before paint so the swap has a start value, release once it has run.
  // biome-ignore lint/correctness/useExhaustiveDependencies: runs once per id change
  useLayoutEffect(() => {
    clearTimeout(releaseTimer.current);
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (swapOnly && lastHeight.current !== null) setHeight(lastHeight.current);
  }, [id]);

  // Swap-only mode: the release timer starts when the new layer has real content (see the observer below),
  // so a page that is still loading under an overlay keeps the pinned height. Clean up on unmount.
  useEffect(() => () => clearTimeout(releaseTimer.current), []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-observe the fresh layer element whenever the id changes
  useLayoutEffect(() => {
    const el = layerRef.current;
    if (!tween || !el) return;
    const observer = new ResizeObserver(([entry]) => {
      // A loading overlay has no height of its own: keep the current one (or lock the box's min-height on first load).
      // Ignore holds inside fading-out layers: they are on their way out and must not pin the height.
      const holding = [...el.querySelectorAll("[data-swap-hold]")].some((node) => !node.closest(".swap-out"));
      if (holding) {
        if (!swapOnly) setHeight((prev) => prev ?? boxRef.current?.offsetHeight ?? null);
        return;
      }
      const next = Math.round(entry.borderBoxSize[0].blockSize);
      lastHeight.current = next;
      if (swapOnly) {
        if (!settling) return;
        clearTimeout(releaseTimer.current);
        releaseTimer.current = setTimeout(() => {
          setSettling(false);
          setHeight(null);
          setAnimating(false);
        }, DUR.move + 60);
      }
      setHeight((prev) => {
        if (prev !== null && prev !== next) setAnimating(true);
        return next;
      });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [id, tween, swapOnly, settling]);

  return (
    <div
      ref={boxRef}
      className={tween ? "swap-box" : undefined}
      style={{
        position: "relative",
        height: tween && height !== null ? height : undefined,
        overflow: animating ? "hidden" : undefined,
      }}
      onTransitionEnd={(e) => e.target === e.currentTarget && !swapOnly && setAnimating(false)}>
      {leaving && (
        <div key={leaving.id} className="swap-out" style={LAYER_STYLE} aria-hidden inert>
          {leaving.children}
        </div>
      )}
      <div key={id} ref={layerRef} className={swapped ? "swap-in" : undefined} style={LAYER_STYLE}>
        {children}
      </div>
    </div>
  );
}

export default SwapLayers;
