import type { ReactNode } from "react";
import { Backdrop, Box, Fade, IconButton, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DUR, EASE, accentText, tone } from "@/components/listingStyles.ts";

interface AdminModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  maxWidth?: number | string;
  footer?: ReactNode;
}

/**
 * The one modal shape for the console: warm paper, 24px, hairline border, soft panel
 * shadow, a heavy title and a labelled close. MUI's Modal owns focus trapping, Escape
 * and the backdrop so the panel only has to carry the visual language.
 */
function AdminModal({ open, onClose, title, subtitle, children, maxWidth = 480, footer }: AdminModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-label={title}
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { transitionDuration: { enter: DUR.base, exit: DUR.fast } } }}>
      <Fade in={open} timeout={{ enter: DUR.base, exit: DUR.fast }}>
        <Box
          sx={(theme) => ({
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: maxWidth,
            maxWidth: "calc(100vw - 32px)",
            maxHeight: "calc(100vh - 64px)",
            overflowY: "auto",
            p: { xs: 3, sm: 3.5 },
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "24px",
            boxShadow:
              theme.palette.mode === "dark" ? "0 18px 44px rgba(0,0,0,0.55)" : "0 18px 44px rgba(15,40,28,0.12)",
            backgroundImage:
              theme.palette.mode === "dark"
                ? "radial-gradient(circle at 100% 0%, rgba(0,206,124,0.10), transparent 40%)"
                : "radial-gradient(circle at 100% 0%, rgba(0,206,124,0.07), transparent 40%)",
          })}>
          <IconButton
            onClick={onClose}
            aria-label="Zamknij"
            size="small"
            sx={(theme) => ({
              position: "absolute",
              top: 12,
              right: 12,
              color: "text.secondary",
              transition: `color 200ms ${EASE}, background-color 200ms ${EASE}`,
              "&:hover": { color: accentText(theme), backgroundColor: tone(theme, 0.1) },
            })}>
            <CloseIcon fontSize="small" />
          </IconButton>
          <Box component="header" sx={{ pr: 5 }}>
            <Box
              component="h2"
              sx={{
                m: 0,
                fontSize: "1.35rem",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}>
              {title}
            </Box>
            {subtitle && (
              <Box component="p" sx={{ m: 0, mt: 1, color: "text.secondary", fontSize: "0.9rem", lineHeight: 1.5 }}>
                {subtitle}
              </Box>
            )}
          </Box>
          <Box sx={{ mt: 3 }}>{children}</Box>
          {footer && <Box sx={{ mt: 3.5, display: "flex", justifyContent: "flex-end", gap: 1.5 }}>{footer}</Box>}
        </Box>
      </Fade>
    </Modal>
  );
}

export default AdminModal;
