import { Box, Button } from "@mui/material";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import { useTranslation } from "react-i18next";
import Search from "./Search.tsx";
import SortSelector from "@/components/Filters/SortSelector.tsx";
import { accentText, panelSx, tone } from "@/components/listingStyles.ts";

interface FiltersBarProps {
  onOpenFilters: () => void;
  activeFilterCount: number;
}

function FiltersBar({ onOpenFilters, activeFilterCount }: FiltersBarProps) {
  const { t } = useTranslation("catalog");

  return (
    <Box id="search-wrapper" className={"flex flex-wrap items-center gap-3 p-3 sm:p-4"} sx={panelSx}>
      <Search />
      <Box className={"flex w-full items-center gap-2 sm:ml-auto sm:w-auto"}>
        <Button
          onClick={onOpenFilters}
          startIcon={<TuneRoundedIcon />}
          aria-label={
            activeFilterCount > 0
              ? t("filters.openButtonAriaActive", { active: activeFilterCount })
              : t("filters.openButtonAria")
          }
          sx={{
            display: { lg: "none" },
            flexShrink: 0,
            borderRadius: "999px",
            border: "1px solid",
            borderColor: activeFilterCount > 0 ? "primary.main" : "divider",
            color: activeFilterCount > 0 ? (t) => accentText(t) : "text.primary",
            bgcolor: activeFilterCount > 0 ? (t) => tone(t, 0.12) : "transparent",
            px: 2,
            fontWeight: 700,
            textTransform: "none",
            whiteSpace: "nowrap",
            "&:hover": { borderColor: "primary.main", bgcolor: (t) => tone(t, 0.1) },
          }}>
          {activeFilterCount > 0
            ? t("filters.openButtonActive", { active: activeFilterCount })
            : t("filters.openButton")}
        </Button>
        <SortSelector />
      </Box>
    </Box>
  );
}

export default FiltersBar;
