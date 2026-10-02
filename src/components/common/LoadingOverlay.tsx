import { Box, CircularProgress } from "@mui/material";

/**
 * Spinner that floats over the enclosing SwapLayers box instead of occupying layout, so the panel keeps
 * its height while data loads. Pinned near the top, not centred: a held page can be thousands of px tall. `data-swap-hold` tells SwapLayers not to resize to this (empty) layer.
 */
function LoadingOverlay() {
  return (
    <Box
      data-swap-hold
      sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "start center", pt: { xs: 8, md: 12 } }}>
      <CircularProgress />
    </Box>
  );
}

export default LoadingOverlay;
