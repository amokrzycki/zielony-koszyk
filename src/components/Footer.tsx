import { Box, Link, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import FacebookIcon from "@mui/icons-material/Facebook";
import { useTranslation } from "react-i18next";

const OFFER = ["potatoes", "cabbage", "apples"] as const;

const DELIVERY_LINKS = [
  { id: "delivery", href: "#" },
  { id: "privacy", href: "#" },
  { id: "terms", href: "#" },
] as const;

const headingSx = {
  mb: 1.5,
  color: "primary.main",
  fontSize: "0.8rem",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
};

const linkSx = {
  color: "rgba(255,255,255,0.72)",
  fontSize: "0.95rem",
  textDecoration: "none",
  transition: "color 200ms cubic-bezier(0.16, 1, 0.3, 1)",
  "&:hover": { color: "primary.main" },
  "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 2, borderRadius: "4px" },
};

const listSx = { listStyle: "none", m: 0, p: 0, display: "grid", gap: 1.25 };

function Footer() {
  const { t } = useTranslation();

  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        bgcolor: "#0b1410",
        color: "#fff",
        borderTop: "1px solid",
        borderColor: "rgba(255,255,255,0.10)",
      }}>
      <Box sx={{ maxWidth: 1560, mx: "auto", px: { xs: 3, sm: 6, lg: 10 }, py: { xs: 6, lg: 9 } }}>
        <Grid container spacing={{ xs: 4, md: 6 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box component="img" src="/dark_logo.png" alt={t("app.name")} sx={{ height: 44, width: "auto", mb: 2 }} />
            <Typography
              sx={{ color: "rgba(255,255,255,0.72)", fontSize: "0.95rem", lineHeight: 1.65, maxWidth: "38ch" }}>
              {t("footer.about")}
            </Typography>
          </Grid>

          <Grid size={{ xs: 6, md: 2 }}>
            <Typography component="h2" sx={headingSx}>
              {t("footer.offerTitle")}
            </Typography>
            <Box component="ul" sx={listSx}>
              {OFFER.map((item) => (
                <Typography component="li" key={item} sx={{ color: "rgba(255,255,255,0.72)", fontSize: "0.95rem" }}>
                  {t(`footer.offer.${item}`)}
                </Typography>
              ))}
            </Box>
          </Grid>

          <Grid size={{ xs: 6, md: 3 }}>
            <Typography component="h2" sx={headingSx}>
              {t("footer.deliveryTitle")}
            </Typography>
            <Box component="ul" sx={listSx}>
              {DELIVERY_LINKS.map(({ id, href }) => (
                <Box component="li" key={id}>
                  <Link href={href} underline="none" sx={linkSx}>
                    {t(`footer.links.${id}`)}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Typography component="h2" sx={headingSx}>
              {t("footer.findUs")}
            </Typography>
            <Link
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
              sx={{ ...linkSx, display: "inline-flex", alignItems: "center", gap: 1 }}>
              <FacebookIcon sx={{ fontSize: 20 }} />
              Facebook
            </Link>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ borderTop: "1px solid", borderColor: "rgba(255,255,255,0.10)" }}>
        <Box
          sx={{
            maxWidth: 1560,
            mx: "auto",
            px: { xs: 3, sm: 6, lg: 10 },
            py: 3,
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
            alignItems: "center",
            justifyContent: "space-between",
          }}>
          <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>{t("footer.region")}</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Footer;
