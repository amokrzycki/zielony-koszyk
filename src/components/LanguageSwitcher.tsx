import { Box, Button, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { rememberLocale } from "@/i18n/index.ts";
import { LOCALE_NAMES, LOCALES, type Locale } from "@/i18n/locale.ts";
import { useLocale, useSwitchLocalePath } from "@/i18n/useLocale.ts";
import { navPillSx } from "./navStyles.ts";

interface LanguageSwitcherProps {
  /** Called after a language is chosen, e.g. to close the drawer. */
  onSelect?: () => void;
}

/** Compact PL / EN toggle. Switching keeps the current page: same route, params, query and hash. */
function LanguageSwitcher({ onSelect }: LanguageSwitcherProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const locale = useLocale();
  const switchPath = useSwitchLocalePath();

  const select = (target: Locale) => {
    if (target === locale) return;
    rememberLocale(target);
    navigate(switchPath(target));
    onSelect?.();
  };

  return (
    <Box role="group" aria-label={t("language.label")} sx={{ display: "inline-flex", alignItems: "center", gap: 0.25 }}>
      {LOCALES.map((code) => (
        <Button
          key={code}
          lang={code}
          title={LOCALE_NAMES[code]}
          aria-label={LOCALE_NAMES[code]}
          aria-pressed={code === locale}
          className={code === locale ? "active" : undefined}
          onClick={() => select(code)}
          sx={{ ...navPillSx(theme), minWidth: 0, px: 1.25, letterSpacing: "0.04em" }}>
          {code.toUpperCase()}
        </Button>
      ))}
    </Box>
  );
}

export default LanguageSwitcher;
