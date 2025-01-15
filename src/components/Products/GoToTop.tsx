import { useState, useEffect } from "react";
import { Fab, Grow } from "@mui/material";
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <Grow
      in={visible}
      style={{ transformOrigin: "0 0 0" }}
      {...(visible ? { timeout: 1000 } : {})}
    >
      <Fab
        color={"primary"}
        className={"bottom-8 right-8"}
        sx={{ position: "fixed" }}
        aria-label={"Go to top"}
        onClick={scrollToTop}
      >
        <ArrowUpwardIcon />
      </Fab>
    </Grow>
  );
}
