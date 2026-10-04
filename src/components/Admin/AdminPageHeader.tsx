import type { ReactNode } from "react";
import { Box } from "@mui/material";
import { accentText, tone } from "@/components/listingStyles.ts";

interface AdminPageHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

function AdminPageHeader({ icon, title, subtitle, actions }: AdminPageHeaderProps) {
  return (
    <Box
      component="header"
      sx={{
        display: "flex",
        alignItems: { xs: "flex-start", sm: "center" },
        flexWrap: "wrap",
        gap: 2,
        mb: 3,
      }}>
      <Box
        aria-hidden
        sx={(theme) => ({
          display: "grid",
          placeItems: "center",
          width: 48,
          height: 48,
          flexShrink: 0,
          borderRadius: "50%",
          bgcolor: tone(theme, 0.12),
          color: accentText(theme),
          "& svg": { fontSize: 24 },
        })}>
        {icon}
      </Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Box
          component="h1"
          sx={{
            m: 0,
            fontSize: { xs: "1.5rem", md: "1.75rem" },
            fontWeight: 800,
            letterSpacing: "-0.025em",
            lineHeight: 1.15,
          }}>
          {title}
        </Box>
        {subtitle && (
          <Box component="p" sx={{ m: 0, mt: 0.75, color: "text.secondary", fontSize: "0.92rem", lineHeight: 1.5 }}>
            {subtitle}
          </Box>
        )}
      </Box>
      {actions && <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>{actions}</Box>}
    </Box>
  );
}

export default AdminPageHeader;
