import type { ReactNode } from "react";
import { Box, Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { accentText, panelSx, tone } from "@/components/listingStyles.ts";

interface AdminErrorProps {
  message: string;
  /** Optional recovery step, named plainly. */
  hint?: string;
  onRetry?: () => void;
}

function AdminError({ message, hint, onRetry }: AdminErrorProps) {
  return (
    <Box
      role="alert"
      sx={(theme) => ({
        ...panelSx(theme),
        p: { xs: 3, sm: 4 },
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 1.5,
        maxWidth: 640,
      })}>
      <Box sx={{ fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.01em" }}>{message}</Box>
      {hint && <Box sx={{ color: "text.secondary", fontSize: "0.9rem", lineHeight: 1.5 }}>{hint}</Box>}
      {onRetry && (
        <Button
          onClick={onRetry}
          startIcon={<RefreshIcon />}
          variant="outlined"
          sx={(theme) => ({
            borderRadius: "999px",
            fontWeight: 700,
            borderColor: "divider",
            color: accentText(theme),
            "&:hover": { borderColor: accentText(theme), bgcolor: tone(theme, 0.08) },
          })}>
          Spróbuj ponownie
        </Button>
      )}
    </Box>
  );
}

export function AdminErrorPlain({ children }: { children: ReactNode }) {
  return <Box sx={{ color: "text.secondary", fontSize: "0.9rem" }}>{children}</Box>;
}

export default AdminError;
