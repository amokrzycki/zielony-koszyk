import { type ComponentProps, useEffect, useRef, useState } from "react";
import { Box, type SxProps, type Theme } from "@mui/material";
import { DUR, EASE } from "@/components/listingStyles.ts";

/** <img> that fades in once decoded, so product photos do not pop in over their tinted tile. */
function FadeImage({ sx, onLoad, ...props }: Omit<ComponentProps<"img">, "ref"> & { sx?: SxProps<Theme> }) {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  // Cached images can finish before React attaches onLoad.
  useEffect(() => {
    if (ref.current?.complete) setLoaded(true);
  }, []);

  return (
    <Box
      component="img"
      ref={ref}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
      sx={[
        { opacity: loaded ? 1 : 0, transition: `opacity ${DUR.slow}ms ${EASE}` },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    />
  );
}

export default FadeImage;
