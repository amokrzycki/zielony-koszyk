import { useLocation, Link as RouterLink } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLocalePath } from "@/i18n/useLocale.ts";
import { matchRoute } from "@/i18n/routes.ts";

/** One crumb per URL prefix that is itself a known route; the label comes from the route id, never from the slug. */
export default function AutoBreadcrumbs() {
  const { t } = useTranslation();
  const to = useLocalePath();
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.slice(1).flatMap((_, index) => {
    const path = `/${segments.slice(0, index + 2).join("/")}`;
    const match = matchRoute(path);
    return match ? [{ path, id: match.id }] : [];
  });

  return (
    <Breadcrumbs aria-label={t("breadcrumbs.label")}>
      <Link component={RouterLink} underline="hover" color="textSecondary" to={to("home")}>
        {t("breadcrumbs.root")}
      </Link>

      {crumbs.map(({ path, id }, index) =>
        index === crumbs.length - 1 ? (
          <Typography color="textPrimary" key={path}>
            {t(`breadcrumbs.${id}`)}
          </Typography>
        ) : (
          <Link component={RouterLink} underline="hover" color="inherit" to={path} key={path}>
            {t(`breadcrumbs.${id}`)}
          </Link>
        ),
      )}
    </Breadcrumbs>
  );
}
