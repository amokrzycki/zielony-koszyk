import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocalePath } from "@/i18n/useLocale.ts";
import { LocalShipping, Verified, WorkspacePremium } from "@mui/icons-material";
import Categories from "./Categories.tsx";
import ImageCarousel from "@/components/ImageCarousel.tsx";

const assurances = [
  { icon: <LocalShipping />, id: "delivery" },
  { icon: <Verified />, id: "organic" },
  { icon: <WorkspacePremium />, id: "wholesale" },
] as const;

function Homepage() {
  const { t } = useTranslation("catalog");
  const to = useLocalePath();

  return (
    <Box id="main-wrapper" className="flex flex-col items-center">
      <ImageCarousel />

      <Box
        component="ul"
        className="grid gap-4 w-full"
        sx={{
          listStyle: "none",
          m: 0,
          p: { xs: "28px 24px", sm: "36px 48px", lg: "44px 64px" },
          maxWidth: 1560,
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          "& > li": { display: "flex", alignItems: "center", gap: 2 },
        }}>
        {assurances.map(({ icon, id }) => (
          <Box component="li" key={id} className="flex items-center gap-3">
            <Box
              sx={{
                display: "grid",
                placeItems: "center",
                width: 44,
                height: 44,
                flexShrink: 0,
                borderRadius: "50%",
                color: "primary.main",
                bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(0,206,124,0.14)" : "rgba(0,206,124,0.12)"),
                "& svg": { fontSize: 22 },
              }}>
              {icon}
            </Box>
            <Typography component="span" sx={{ fontSize: "0.95rem", lineHeight: 1.45, color: "text.secondary" }}>
              {t(`home.assurances.${id}`)}
            </Typography>
          </Box>
        ))}
      </Box>

      <Categories />

      <Box
        component="section"
        className="w-full text-center"
        sx={{
          px: 3,
          py: { xs: 8, lg: 14 },
          maxWidth: 1560,
          mx: "auto",
          borderTop: "1px solid",
          borderColor: "divider",
        }}>
        <Typography
          component="h2"
          sx={{
            m: 0,
            mx: "auto",
            maxWidth: "20ch",
            fontSize: "clamp(1.9rem, 3.6vw, 2.9rem)",
            fontWeight: 900,
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            textWrap: "balance",
          }}>
          {t("home.wholesale.title")}
        </Typography>
        <Typography sx={{ mt: 2, mx: "auto", maxWidth: "54ch", color: "text.secondary", lineHeight: 1.6 }}>
          {t("home.wholesale.text")}
        </Typography>
        <Box
          component={Link}
          to={to("about")}
          className="inline-flex items-center gap-2 rounded-full no-underline mt-7 px-7 py-3 text-[0.95rem] font-bold focus-visible:outline-2 focus-visible:outline-offset-4"
          sx={{
            color: "text.primary",
            border: "1px solid",
            borderColor: "divider",
            transition: "transform 300ms cubic-bezier(0.16, 1, 0.3, 1), border-color 300ms, color 300ms",
            "&:hover": { borderColor: "primary.main", color: "primary.main", transform: "translateY(-2px)" },
            "&:focus-visible": { outlineColor: "primary.main" },
          }}>
          {t("home.wholesale.cta")}
        </Box>
      </Box>
    </Box>
  );
}

export default Homepage;
