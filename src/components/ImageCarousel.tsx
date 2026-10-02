import { useEffect, useRef, useState } from "react";
import { Box, IconButton, Typography, useMediaQuery, keyframes } from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight, ArrowForward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const carouselImages = [
  {
    label: "Codzienne dostawy",
    imgPath: "/images/karuzela1.jpeg",
  },
  {
    label: "Produkty sezonowe z dostawą do domu",
    imgPath: "/images/karuzela2.jpeg",
  },
  {
    label: "Artykuły spożywcze w zasięgu ręki",
    imgPath: "/images/karuzela3.jpeg",
  },
];

const SLIDE_COUNT = carouselImages.length;
const SLIDE_MS = 6000;
const SWIPE_PX = 40;

const fill = keyframes`
  from { width: 0% }
  to   { width: 100% }
`;

export default function ImageCarousel() {
  const [activeStep, setActiveStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef<number | null>(null);
  const remainingMs = useRef(SLIDE_MS);
  const lastStep = useRef(0);
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const navigate = useNavigate();

  const go = (step: number) => setActiveStep((step + SLIDE_COUNT) % SLIDE_COUNT);
  const handleNext = () => setActiveStep((s) => (s + 1) % SLIDE_COUNT);
  const handleBack = () => setActiveStep((s) => (s - 1 + SLIDE_COUNT) % SLIDE_COUNT);

  useEffect(() => {
    if (lastStep.current !== activeStep) {
      lastStep.current = activeStep;
      remainingMs.current = SLIDE_MS;
    }
    if (paused || reduceMotion) return;
    const startedAt = Date.now();
    const id = setTimeout(() => setActiveStep((s) => (s + 1) % SLIDE_COUNT), remainingMs.current);
    return () => {
      clearTimeout(id);
      // Freeze the countdown while paused instead of restarting it.
      remainingMs.current = Math.max(0, remainingMs.current - (Date.now() - startedAt));
    };
  }, [activeStep, paused, reduceMotion]);

  return (
    <Box
      component="section"
      aria-roledescription="karuzela"
      aria-label="Dostawa i oferta"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={(e) => (touchStart.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchStart.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStart.current;
        if (Math.abs(delta) > SWIPE_PX) setActiveStep((s) => (s + (delta < 0 ? 1 : -1) + SLIDE_COUNT) % SLIDE_COUNT);
        touchStart.current = null;
      }}
      sx={{
        position: "relative",
        width: "100%",
        minHeight: { xs: 460, sm: 560, lg: 660 },
        display: "flex",
        alignItems: "flex-end",
        overflow: "hidden",
        bgcolor: "#0b1410",
        isolation: "isolate",
      }}>
      {carouselImages.map((item, index) => {
        const isActive = activeStep === index;
        return (
          <Box
            key={item.imgPath}
            aria-hidden={!isActive}
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: isActive ? 1 : 0,
              opacity: isActive ? 1 : 0,
              visibility: isActive ? "visible" : "hidden",
              transition: reduceMotion ? "none" : "opacity 900ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}>
            <Box
              component="img"
              src={item.imgPath}
              alt=""
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 45%",
                transform: isActive && !reduceMotion ? "scale(1.05)" : "scale(1)",
                transition: reduceMotion ? "none" : "transform 7s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          </Box>
        );
      })}

      {/* Scrim: keeps body copy above 4.5:1 on every slide regardless of the photo. */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          background:
            "linear-gradient(to top, rgba(5,12,9,0.94) 0%, rgba(5,12,9,0.78) 32%, rgba(5,12,9,0.28) 62%, rgba(5,12,9,0.06) 100%)",
        }}
      />

      <Box
        className="w-full flex flex-col xl:flex-row xl:items-end xl:justify-between gap-8 xl:gap-16"
        sx={{
          position: "relative",
          zIndex: 3,
          px: { xs: 3, sm: 6, lg: 10 },
          pt: { xs: 20, lg: 28 },
          pb: { xs: 4, lg: 7 },
          maxWidth: 1560,
          mx: "auto",
        }}>
        <Box sx={{ maxWidth: "min(720px, 100%)" }}>
          <Typography
            component="h1"
            sx={{
              m: 0,
              color: "#fff",
              fontSize: "clamp(2.1rem, 5.4vw, 4.25rem)",
              fontWeight: 900,
              lineHeight: 1.03,
              letterSpacing: "-0.035em",
              textWrap: "balance",
              textShadow: "0 2px 24px rgba(0,0,0,0.55)",
            }}>
            {carouselImages[activeStep].label}
          </Typography>
          <Typography
            sx={{
              mt: 3,
              color: "rgba(255,255,255,0.88)",
              fontSize: { xs: "1rem", sm: "1.125rem" },
              lineHeight: 1.55,
              maxWidth: "46ch",
              textShadow: "0 1px 12px rgba(0,0,0,0.5)",
            }}>
            Warzywa, owoce i produkty spożywcze prosto z gospodarstw. Dostawa na terenie Rzeszowa i okolic.
          </Typography>
          <Box className="flex flex-wrap items-center gap-3 mt-7">
            <Box
              component="button"
              type="button"
              onClick={() => navigate("/produkty")}
              className="group inline-flex items-center gap-2 rounded-full px-7 py-3 text-[0.95rem] font-bold focus-visible:outline-2 focus-visible:outline-offset-4"
              sx={{
                bgcolor: "primary.main",
                color: "#0b1410",
                cursor: "pointer",
                transition: "transform 300ms cubic-bezier(0.16, 1, 0.3, 1)",
                "&:hover": { transform: "translateY(-2px)" },
                "&:focus-visible": { outlineColor: "primary.main" },
                "& .MuiSvgIcon-root": { transition: "transform 300ms" },
                "&:hover .MuiSvgIcon-root": { transform: "translateX(4px)" },
              }}>
              Zobacz produkty
              <ArrowForward fontSize="small" />
            </Box>
            <Box
              component="button"
              type="button"
              onClick={() => navigate("/o-nas")}
              className="rounded-full px-6 py-3 text-[0.95rem] font-bold focus-visible:outline-2 focus-visible:outline-offset-4"
              sx={{
                bgcolor: "rgba(255,255,255,0.14)",
                color: "#fff",
                cursor: "pointer",
                backdropFilter: "blur(6px)",
                transition: "background-color 300ms, transform 300ms cubic-bezier(0.16, 1, 0.3, 1)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.26)", transform: "translateY(-2px)" },
                "&:focus-visible": { outlineColor: "#fff" },
              }}>
              O nas
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 2, sm: 3 }, width: { xs: "100%", lg: 420 } }}>
          <IconButton
            onClick={handleBack}
            aria-label="Poprzednie zdjęcie"
            sx={{
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.4)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.18)" },
            }}>
            <KeyboardArrowLeft />
          </IconButton>

          <Box className="flex items-center gap-2 grow" role="tablist" aria-label="Wybierz zdjęcie">
            {carouselImages.map((item, index) => (
              <Box
                component="button"
                type="button"
                key={item.imgPath}
                role="tab"
                aria-selected={activeStep === index}
                aria-label={item.label}
                onClick={() => go(index)}
                sx={{
                  position: "relative",
                  flex: 1,
                  height: 4,
                  borderRadius: 999,
                  overflow: "hidden",
                  cursor: "pointer",
                  bgcolor: "rgba(255,255,255,0.32)",
                  p: 0,
                  border: 0,
                  "&:focus-visible": { outline: "2px solid #fff", outlineOffset: 4 },
                  "&:hover": { bgcolor: "rgba(255,255,255,0.55)" },
                }}>
                {index === activeStep && (
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 999,
                      bgcolor: "primary.main",
                      animation: reduceMotion ? "none" : `${fill} ${SLIDE_MS}ms linear forwards`,
                      animationPlayState: paused ? "paused" : "running",
                    }}
                  />
                )}
              </Box>
            ))}
          </Box>

          <IconButton
            onClick={handleNext}
            aria-label="Następne zdjęcie"
            sx={{
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.4)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.18)" },
            }}>
            <KeyboardArrowRight />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
