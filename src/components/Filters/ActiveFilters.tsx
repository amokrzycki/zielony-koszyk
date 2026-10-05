import { Box, Button, Chip } from "@mui/material";
import { useTranslation } from "react-i18next";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import useProductFilters from "@/hooks/useProductFilters.ts";
import { getActiveFilterChips } from "@/helpers/getActiveFilterChips.ts";
import { accentText, tone } from "@/components/listingStyles.ts";
import { useLocale } from "@/i18n/useLocale.ts";

function ActiveFilters() {
  const { filters, setParams, resetFilters } = useProductFilters();
  const { t } = useTranslation(["catalog", "common"]);
  const locale = useLocale();
  const chips = getActiveFilterChips(filters, { t, locale });

  if (chips.length === 0) return null;

  return (
    <Box className={"flex flex-wrap items-center gap-2"}>
      {chips.map((chip) => (
        <Chip
          key={chip.key}
          className="chip-pop"
          label={chip.label}
          onDelete={() => setParams(chip.clear)}
          deleteIcon={<CloseRoundedIcon />}
          sx={{
            borderRadius: "999px",
            border: "1px solid",
            borderColor: "divider",
            bgcolor: (t) => tone(t, 0.1),
            color: (t) => accentText(t),
            fontWeight: 700,
            "& .MuiChip-deleteIcon": { color: "inherit", "&:hover": { color: "inherit" } },
          }}
        />
      ))}
      <Button
        onClick={resetFilters}
        size="small"
        sx={{
          borderRadius: "999px",
          color: "text.secondary",
          fontWeight: 700,
          textTransform: "none",
          "&:hover": { color: (t) => accentText(t), bgcolor: (t) => tone(t, 0.08) },
        }}>
        {t("filters.clearAll")}
      </Button>
    </Box>
  );
}

export default ActiveFilters;
