import { Box, Typography } from "@mui/material";
import { ArrowForward, CheckRounded } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocalePath } from "@/i18n/useLocale.ts";

const OFFER_ITEMS = ["fresh", "exotic", "greekPantry", "greekSpecialities"] as const;
const SERVICE_ITEMS = ["care", "schedule", "prices", "freeDelivery"] as const;

function ListPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <Box
      sx={{
        height: "100%",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "24px",
        p: { xs: 3, md: 4 },
      }}>
      <Typography
        component="h2"
        sx={{
          mb: 2.5,
          fontSize: { xs: "1.3rem", md: "1.55rem" },
          fontWeight: 800,
          lineHeight: 1.2,
          letterSpacing: "-0.02em",
          textWrap: "balance",
        }}>
        {title}
      </Typography>
      <Box component="ul" className="grid gap-3" sx={{ listStyle: "none", m: 0, p: 0 }}>
        {items.map((item) => (
          <Box component="li" key={item} className="flex items-start gap-3">
            <Box
              sx={{
                display: "grid",
                placeItems: "center",
                width: 26,
                height: 26,
                flexShrink: 0,
                mt: "1px",
                borderRadius: "50%",
                color: "primary.main",
                bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(0,206,124,0.16)" : "rgba(0,206,124,0.12)"),
                "& svg": { fontSize: 16 },
              }}>
              <CheckRounded />
            </Box>
            <Typography sx={{ color: "text.primary", lineHeight: 1.5, maxWidth: "46ch" }}>{item}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function About() {
  const { t } = useTranslation("catalog");
  const to = useLocalePath();

  return (
    <Box id="main-wrapper">
      <Box
        component="section"
        sx={{
          width: "100%",
          maxWidth: 1560,
          mx: "auto",
          px: { xs: 3, sm: 6, lg: 10 },
          pt: { xs: 8, lg: 14 },
          pb: { xs: 7, lg: 11 },
        }}>
        <Box
          className="grid items-center gap-8 lg:gap-14"
          sx={{ gridTemplateColumns: { xs: "1fr", lg: "1.05fr 0.95fr" } }}>
          <Box>
            <Typography
              component="h1"
              sx={{
                m: 0,
                fontSize: "clamp(2.4rem, 6vw, 4.25rem)",
                fontWeight: 900,
                lineHeight: 1.03,
                letterSpacing: "-0.035em",
                textWrap: "balance",
              }}>
              {t("about.greeting")}
            </Typography>
            <Typography
              sx={{
                mt: 3,
                maxWidth: "62ch",
                color: "text.secondary",
                fontSize: { xs: "1.05rem", sm: "1.15rem" },
                lineHeight: 1.65,
              }}>
              {t("about.intro")}
            </Typography>
          </Box>

          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "28px",
              aspectRatio: { xs: "4 / 3", lg: "4 / 5" },
              boxShadow: (t) =>
                t.palette.mode === "dark" ? "0 24px 60px rgba(0,0,0,0.5)" : "0 24px 60px rgba(15,40,28,0.16)",
            }}>
            <Box
              component="img"
              src="/images/vegatables.jpeg"
              alt={t("about.imageAlt")}
              sx={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 55%" }}
            />
          </Box>
        </Box>
      </Box>

      <Box
        component="section"
        sx={{
          width: "100%",
          maxWidth: 1560,
          mx: "auto",
          px: { xs: 3, sm: 6, lg: 10 },
          py: { xs: 8, lg: 14 },
          borderTop: "1px solid",
          borderColor: "divider",
        }}>
        <Box
          className="grid gap-4 lg:gap-6"
          sx={{ gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, alignItems: "stretch" }}>
          <ListPanel title={t("about.offer.title")} items={OFFER_ITEMS.map((item) => t(`about.offer.items.${item}`))} />
          <ListPanel
            title={t("about.service.title")}
            items={SERVICE_ITEMS.map((item) => t(`about.service.items.${item}`))}
          />
        </Box>
      </Box>

      <Box
        component="section"
        sx={{
          width: "100%",
          maxWidth: 1560,
          mx: "auto",
          px: { xs: 3, sm: 6, lg: 10 },
          pb: { xs: 10, lg: 16 },
        }}>
        <Box
          sx={{
            borderRadius: "28px",
            border: "1px solid",
            borderColor: "divider",
            textAlign: "center",
            p: { xs: 4, md: 7 },
            background: (t) =>
              t.palette.mode === "dark"
                ? "linear-gradient(180deg, rgba(0,206,124,0.12), rgba(0,206,124,0.02))"
                : "linear-gradient(180deg, rgba(0,206,124,0.10), rgba(0,206,124,0.03))",
          }}>
          <Typography
            sx={{
              mx: "auto",
              maxWidth: "58ch",
              fontSize: { xs: "1.2rem", md: "1.5rem" },
              fontWeight: 600,
              lineHeight: 1.5,
              letterSpacing: "-0.01em",
              textWrap: "balance",
            }}>
            {t("about.closing")}
          </Typography>
          <Box
            component={Link}
            to={to("products")}
            className="group inline-flex items-center gap-2 rounded-full no-underline mt-7 px-7 py-3 text-[0.95rem] font-bold focus-visible:outline-2 focus-visible:outline-offset-4"
            sx={{
              bgcolor: "primary.main",
              color: "#0b1410",
              transition: "transform 300ms cubic-bezier(0.16, 1, 0.3, 1)",
              "&:hover": { transform: "translateY(-2px)" },
              "&:focus-visible": { outlineColor: "primary.main" },
              "& .MuiSvgIcon-root": { transition: "transform 300ms" },
              "&:hover .MuiSvgIcon-root": { transform: "translateX(4px)" },
            }}>
            {t("about.cta")}
            <ArrowForward fontSize="small" />
          </Box>
          <Typography sx={{ mt: 4, fontWeight: 700 }}>{t("about.team")}</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default About;
