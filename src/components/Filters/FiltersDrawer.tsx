import { Box, Button, Drawer, IconButton, Typography } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useTranslation } from "react-i18next";
import { FiltersContent } from "@/components/Filters/FiltersBox.tsx";

interface FiltersDrawerProps {
  open: boolean;
  onClose: () => void;
}

function FiltersDrawer({ open, onClose }: FiltersDrawerProps) {
  const { t } = useTranslation("catalog");

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            borderRadius: "24px 24px 0 0",
            pb: "env(safe-area-inset-bottom)",
          },
        },
      }}>
      <Box className={"flex max-h-[85vh] flex-col p-5 sm:p-6"}>
        <Box className={"mb-4 flex items-center justify-between"}>
          <Typography component="h2" sx={{ fontSize: "1.15rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            {t("filters.title")}
          </Typography>
          <IconButton onClick={onClose} aria-label={t("filters.close")} size="small">
            <CloseRoundedIcon />
          </IconButton>
        </Box>
        <Box className={"flex-1 overflow-y-auto"}>
          <FiltersContent />
        </Box>
        <Button
          onClick={onClose}
          variant="contained"
          fullWidth
          sx={{
            mt: 3,
            borderRadius: "999px",
            bgcolor: "primary.main",
            color: "#0b1410",
            fontWeight: 800,
            textTransform: "none",
            boxShadow: "none",
            "&:hover": { bgcolor: "primary.main", boxShadow: "none" },
          }}>
          {t("filters.showProducts")}
        </Button>
      </Box>
    </Drawer>
  );
}

export default FiltersDrawer;
