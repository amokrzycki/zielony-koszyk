import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import { accentText, tone } from "@/components/listingStyles.ts";

interface AdminEmptyProps {
  icon: ReactNode;
  title: string;
  hint?: string;
  action?: ReactNode;
}

/** A blank table should teach, not just sit empty: medallion, plain heading, one next step. */
function AdminEmpty({ icon, title, hint, action }: AdminEmptyProps) {
  return (
    <Box
      sx={{
        display: "grid",
        placeItems: "center",
        gap: 1.5,
        py: 8,
        px: 3,
        textAlign: "center",
      }}>
      <Box
        aria-hidden
        sx={(theme) => ({
          display: "grid",
          placeItems: "center",
          width: 64,
          height: 64,
          borderRadius: "50%",
          bgcolor: tone(theme, 0.1),
          color: accentText(theme),
          "& svg": { fontSize: 30 },
        })}>
        {icon}
      </Box>
      <Box>
        <Typography sx={{ fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.01em" }}>{title}</Typography>
        {hint && (
          <Typography sx={{ mt: 0.75, color: "text.secondary", fontSize: "0.9rem", maxWidth: "44ch" }}>
            {hint}
          </Typography>
        )}
      </Box>
      {action}
    </Box>
  );
}

export default AdminEmpty;
