import { Box, Typography } from "@mui/material";
import { ArrowForward, CheckRounded } from "@mui/icons-material";
import { Link } from "react-router-dom";

const intro =
  "Zielony Koszyk to sklep internetowy ze świeżymi warzywami, owocami i produktami spożywczymi od lokalnych rolników i sprawdzonych dostawców. Obsługujemy klientów indywidualnych i firmy, a produkty z kraju i z zagranicy dowozimy na terenie Rzeszowa i okolic.";

const offerings = [
  "Świeże owoce i warzywa prosto od lokalnych rolników",
  "Produkty egzotyczne, gdy mają Państwo ochotę na coś nowego",
  "Przyprawy, oliwy z oliwek i suszone produkty, czyli greckie smaki w Państwa kuchni",
  "Specjalności kuchni greckiej",
];

const service = [
  "Opieka nad zamówieniem od pierwszego kontaktu do dostawy",
  "Terminy dostaw dopasowane do Państwa dnia",
  "Dobre ceny i promocje",
  "Darmowa dostawa przy większych zamówieniach",
];

const closing =
  "Zapraszamy do współpracy klientów indywidualnych oraz firmy z branży gastronomicznej, cateringowej i handlowej. Świeże warzywa i greckie smaki znajdą Państwo w Zielonym Koszyku.";

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
              Dzień dobry!
            </Typography>
            <Typography
              sx={{
                mt: 3,
                maxWidth: "62ch",
                color: "text.secondary",
                fontSize: { xs: "1.05rem", sm: "1.15rem" },
                lineHeight: 1.65,
              }}>
              {intro}
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
              alt="Świeże warzywa z oferty Zielonego Koszyka"
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
          <ListPanel title="Nasza oferta:" items={offerings} />
          <ListPanel title="Jakość obsługi:" items={service} />
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
            {closing}
          </Typography>
          <Box
            component={Link}
            to="/produkty"
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
            Zobacz naszą ofertę
            <ArrowForward fontSize="small" />
          </Box>
          <Typography sx={{ mt: 4, fontWeight: 700 }}>Zespół Zielonego Koszyka</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default About;
