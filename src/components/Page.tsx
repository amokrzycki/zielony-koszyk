import Header from "./Header.tsx";
import { useEffect, useRef } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import Footer from "./Footer.tsx";
import { Toaster } from "react-hot-toast";
import SwapLayers from "./common/SwapLayers.tsx";
import { DUR } from "./listingStyles.ts";
import { useMode } from "../providers/ModeProvider.tsx";

function Page() {
  const { mode } = useMode();
  const outlet = useOutlet();
  // Every route swaps, except inside the admin and account shells: those keep their frame and swap their own outlet.
  const { pathname } = useLocation();
  const root = pathname.split("/")[1];
  const section = root === "admin" || root === "konto" ? root : pathname;
  // Reset scroll once the old page has faded out: instant, so it never fights the height ease with a smooth scroll.
  const first = useRef(true);
  // biome-ignore lint/correctness/useExhaustiveDependencies: keyed on section so it re-runs per swap, not per render
  useEffect(() => {
    if (first.current) {
      first.current = false; // keep the browser's own scroll restoration on a reload
      return;
    }
    const timer = setTimeout(() => window.scrollTo({ top: 0, behavior: "instant" }), DUR.fast);
    return () => clearTimeout(timer);
  }, [section]);

  return (
    <>
      <Toaster
        toastOptions={{
          style: {
            background: mode === "dark" ? "#333" : "#fff",
            color: mode === "dark" ? "#fff" : "#333",
          },
          success: {
            duration: 3000,
          },
        }}
      />
      <Header />
      <SwapLayers id={section} tween="swap">
        {outlet}
      </SwapLayers>
      <Footer />
    </>
  );
}

export default Page;
