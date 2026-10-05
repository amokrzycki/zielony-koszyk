import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocalePath } from "@/i18n/useLocale.ts";
import { ArrowOutward } from "@mui/icons-material";

const categories = [
  { image: "/images/fruits.jpeg", category: "owoce" },
  { image: "/images/vegatables.jpeg", category: "warzywa" },
  { image: "/images/others.jpeg", category: "inne" },
  { image: "/images/seasonal.jpeg", category: "sezonowe" },
  { image: "/images/collective.jpeg", category: "worki" },
] as const;

// Column spans match categories array order.
const gridArea = [
  { sm: "span 2", lg: "span 3" },
  { sm: "span 2", lg: "span 3" },
  { sm: "span 2", lg: "span 2" },
  { sm: "span 2", lg: "span 2" },
  { sm: "span 2", lg: "span 2" },
];

function Categories() {
  const { t } = useTranslation("catalog");
  const to = useLocalePath();

  return (
    <Box
      component="section"
      id="kategorie"
      sx={{ width: "100%", maxWidth: 1560, mx: "auto", px: { xs: 3, sm: 6, lg: 10 }, py: { xs: 8, lg: 14 } }}>
      <Box className="flex flex-wrap items-end justify-between gap-4 mb-8 lg:mb-10">
        {/* ch scales with the display size, so a ch cap would over-wrap the heading. Fixed px instead. */}
        <Box sx={{ maxWidth: "min(600px, 100%)" }}>
          <Typography
            component="h2"
            sx={{
              m: 0,
              fontSize: "clamp(1.9rem, 3.6vw, 2.9rem)",
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              textWrap: "balance",
            }}>
            {t("homeCategories.title")}
          </Typography>
          <Typography sx={{ mt: 2, color: "text.secondary", maxWidth: "52ch", lineHeight: 1.6 }}>
            {t("homeCategories.subtitle")}
          </Typography>
        </Box>

        <Box
          component={Link}
          to={to("products")}
          className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[0.9rem] font-bold no-underline transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4"
          sx={{
            color: "text.primary",
            border: "1px solid",
            borderColor: "divider",
            "&:hover": { borderColor: "primary.main", color: "primary.main" },
            "&:focus-visible": { outlineColor: "primary.main" },
          }}>
          {t("homeCategories.all")}
          <ArrowOutward fontSize="small" />
        </Box>
      </Box>

      <Box
        className="grid gap-3 lg:gap-4"
        sx={{ gridTemplateColumns: { xs: "1fr", sm: "repeat(4, 1fr)", lg: "repeat(6, 1fr)" } }}>
        {categories.map((category, index) => {
          const name = t(`homeCategories.items.${category.category}.name`);
          const description = t(`homeCategories.items.${category.category}.description`);
          return (
            <Box
              component={Link}
              to={to("products", undefined, { search: `category=${category.category}` })}
              key={category.category}
              aria-label={t("homeCategories.aria", { name, description })}
              className="group relative overflow-hidden rounded-2xl no-underline"
              sx={{
                gridColumn: { xs: "auto", sm: gridArea[index].sm, lg: gridArea[index].lg },
                minHeight: { xs: 200, sm: 240, lg: 260 },
                height: "100%",
                display: "flex",
                alignItems: "flex-end",
                boxShadow: (t) =>
                  t.palette.mode === "dark" ? "0 10px 30px rgba(0,0,0,0.45)" : "0 10px 30px rgba(15,40,28,0.10)",
                transition: "transform 300ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 300ms",
                "&:hover, &:focus-visible": {
                  transform: "translateY(-4px)",
                  boxShadow: (t) =>
                    t.palette.mode === "dark" ? "0 18px 44px rgba(0,0,0,0.6)" : "0 18px 44px rgba(15,40,28,0.16)",
                  "& .MuiCategoryPhoto-root": { transform: "scale(1.06)" },
                  "& .MuiCategoryScrim-root": { opacity: 0.72 },
                },
                "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 3 },
              }}>
              <Box
                className="MuiCategoryPhoto-root"
                sx={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url(${category.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center 42%",
                  transition: "transform 500ms cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />
              <Box
                className="MuiCategoryScrim-root"
                aria-hidden
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(4,14,9,0.92) 0%, rgba(4,14,9,0.55) 45%, rgba(4,14,9,0.2) 100%)",
                  transition: "opacity 300ms",
                }}
              />

              <Box sx={{ position: "relative", p: { xs: 3, lg: 4 }, width: "100%" }}>
                <Typography
                  component="h3"
                  sx={{
                    color: "#fff",
                    fontSize: { xs: "1.25rem", lg: index === 0 ? "1.75rem" : "1.3rem" },
                    fontWeight: 800,
                    lineHeight: 1.15,
                    letterSpacing: "-0.02em",
                    textWrap: "balance",
                  }}>
                  {name}
                </Typography>
                <Typography
                  sx={{
                    mt: 1,
                    color: "rgba(255,255,255,0.92)",
                    fontSize: "0.9rem",
                    lineHeight: 1.5,
                    maxWidth: "34ch",
                  }}>
                  {description}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default Categories;
