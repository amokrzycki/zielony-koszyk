import { Box, CircularProgress } from "@mui/material";

/** Spinner that floats over the SwapLayers box, pinned top; `data-swap-hold` keeps the panel height. */
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
