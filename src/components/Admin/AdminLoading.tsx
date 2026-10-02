import { Box, Skeleton } from "@mui/material";
import { panelSx } from "@/components/listingStyles.ts";

interface AdminLoadingProps {
  /** Number of skeleton rows to draw under the header strip. */
  rows?: number;
  /** Optional narrow column so the skeleton reads as a table, not a block. */
  compact?: boolean;
}

/**
 * Skeletons beat a spinner here: the work surface keeps its shape while data streams in. `data-swap-hold`
 * makes the enclosing SwapLayers keep the previous page height instead of dipping to the skeleton's.
 */
function AdminLoading({ rows = 6, compact = false }: AdminLoadingProps) {
  return (
    <Box data-swap-hold sx={(theme) => ({ ...panelSx(theme), overflow: "hidden", width: "100%" })}>
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
        <Skeleton variant="rounded" width={120} height={28} />
        <Box sx={{ flex: 1 }} />
        <Skeleton variant="rounded" width={220} height={36} />
      </Box>
      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.25 }}>
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders are static, order never changes
            key={index}
            variant="rounded"
            height={compact ? 24 : 32}
            width={compact ? `${60 + ((index * 13) % 30)}%` : "100%"}
          />
        ))}
      </Box>
    </Box>
  );
}

export default AdminLoading;
