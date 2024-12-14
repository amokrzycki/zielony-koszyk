import { useLocation, Link as RouterLink } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { Typography } from "@mui/material";
import capitalizeFirstLetter from "../utils/capitalizeFirstLetter.ts";

export default function Breadcumbs() {
  const location = useLocation();
  const pathNames = location.pathname.split("/").filter((x) => x);

  // TODO: Map path names to normalized names

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
        return isLast ? (
          <Typography color="textPrimary" key={to}>
            {decodeURIComponent(capitalizeFirstLetter(value))}
          </Typography>
        ) : (
          <Link
            component={RouterLink}
            underline="hover"
            color="inherit"
            to={to}
            key={to}
          >
            {decodeURIComponent(capitalizeFirstLetter(value))}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
