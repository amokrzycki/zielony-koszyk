import { type ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import { DUR } from "@/components/listingStyles.ts";

interface SwapLayersProps {
  /** Changing the id swaps the content: the old layer fades out over the new one, which fades in. */
  id: string;
  children: ReactNode;
  /** How the container height follows content: `true` always, `"swap"` during the swap only, `false` never. */
  tween?: boolean | "swap";
}

// flow-root keeps child margins inside the layer, so the measured height is correct.
const LAYER_STYLE = { display: "flow-root" } as const;

/** Outgoing layer fades out over the incoming one; height eases so the panel never jumps. See .swap-* in App.css. */
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

  // Swap-only: release the pinned height once the new layer has real content. Clean up on unmount.
  useEffect(() => () => clearTimeout(releaseTimer.current), []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-observe the fresh layer element whenever the id changes
  useLayoutEffect(() => {
    const el = layerRef.current;
    if (!tween || !el) return;
    const observer = new ResizeObserver(([entry]) => {
      // A data-swap-hold has no height: keep the current one. Ignore holds inside fading-out layers.
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
