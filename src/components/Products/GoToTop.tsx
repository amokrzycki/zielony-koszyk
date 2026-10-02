import { useState, useEffect } from "react";
import { Fab, Fade } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

export default function GoToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

  return (
    <Fade in={visible} timeout={{ enter: 200, exit: 150 }} unmountOnExit>
      <Fab
        color={"primary"}
        className={"bottom-8 right-8"}
        sx={{ position: "fixed" }}
        aria-label={"Go to top"}
        onClick={scrollToTop}>
        <ArrowUpwardIcon />
      </Fab>
    </Fade>
  );
}
