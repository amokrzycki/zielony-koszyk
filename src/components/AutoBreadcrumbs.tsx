import { useLocation, Link as RouterLink } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { Typography } from "@mui/material";
import { friendlyRoutingNames } from "../constants/friendlyRoutingNames.ts";

export default function AutoBreadcrumbs() {
  const numericRegex = /^\d+$/;
  const location = useLocation();
  const pathNames = location.pathname.split("/").filter((x) => x);

  function getFriendlyName(segment: string, isLast: boolean): string {
    const decoded = decodeURIComponent(segment);

    if (isLast && numericRegex.test(decoded)) {
      return `Zamówienie #${decoded}`;
    }

    if (friendlyRoutingNames[decoded]) {
      return friendlyRoutingNames[decoded];
    }

    return decoded.charAt(0).toUpperCase() + decoded.slice(1);
  }

  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Link
        component={RouterLink}
        underline="hover"
        color="textSecondary"
        to="/"
      >
        Zielony koszyk
      </Link>

      {pathNames.map((value, index) => {
        const to = `/${pathNames.slice(0, index + 1).join("/")}`;

        const isLast = index === pathNames.length - 1;
        const friendlyName = getFriendlyName(value, isLast);

        return isLast ? (
          <Typography color="textPrimary" key={to}>
            {friendlyName}
          </Typography>
        ) : (
          <Link
            component={RouterLink}
            underline="hover"
            color="inherit"
            to={to}
            key={to}
          >
            {friendlyName}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
