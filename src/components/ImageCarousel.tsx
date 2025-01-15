import { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  MobileStepper,
  Paper,
  Typography,
  Fade,
} from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

// TODO: Autoscrolling + smooth transition

const carouselImages = [
  {
    label: "Codzienne dostawy",
    imgPath: "/images/collective.jpeg",
  },
  {
    label: "Świeże owoce",
    imgPath: "/images/fruits.jpeg",
  },
  {
    label: "Artykuły spożywcze w zasięgu ręki",
    imgPath: "/images/others.jpeg",
  },
];

export default function ImageCarousel() {
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = carouselImages.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) =>
      prevActiveStep + 1 >= maxSteps ? 0 : prevActiveStep + 1,
    );
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) =>
      prevActiveStep - 1 < 0 ? maxSteps - 1 : prevActiveStep - 1,
    );
  };

  // Auto-scrolling: advances every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveStep((prevStep) =>
        prevStep + 1 >= maxSteps ? 0 : prevStep + 1,
      );
    }, 5000);

    // Cleanup
    return () => clearInterval(intervalId);
  }, [maxSteps]);

  return (
    <Paper
      square
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        width: "90%",
        margin: "0 auto",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: 400,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {carouselImages.map((item, index) => (
          <Fade in={activeStep === index} timeout={1000} key={item.label}>
            <Box
              component="img"
              src={item.imgPath}
              alt={item.label}
              sx={{
                width: "100%",
                height: 400,
                position: "absolute",
                top: 0,
                left: 0,
                display: activeStep === index ? "block" : "none",
              }}
            />
          </Fade>
        ))}
      </Box>

      <Typography variant="subtitle1" sx={{ mt: 1 }}>
        {carouselImages[activeStep].label}
      </Typography>

      <MobileStepper
        variant="dots"
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        sx={{ width: "100%", mt: 1 }}
        nextButton={
          <IconButton size="small" onClick={handleNext}>
            <KeyboardArrowRight />
          </IconButton>
        }
        backButton={
          <IconButton size="small" onClick={handleBack}>
            <KeyboardArrowLeft />
          </IconButton>
        }
      />
    </Paper>
  );
}
