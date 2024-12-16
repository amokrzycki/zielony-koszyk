import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Nav() {
  const navigate = useNavigate();
  return (
    <Box
      id="navigation-wrapper"
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "center",
        "& img": {
          width: 20,
          height: 20,
          objectFit: "cover",
        },
        "& a": {
          textDecoration: "none",
          color: "text.primary",
        },
      }}
    >
      <a
        href="/"
        onClick={(e) => {
          e.preventDefault();
          navigate("/");
        }}
      >
        Strona główna
      </a>
      <a
        href="/produkty"
        onClick={(e) => {
          e.preventDefault();
          navigate("/produkty");
        }}
      >
        Produkty
      </a>
      <a
        href="/kontakt"
        onClick={(e) => {
          e.preventDefault();
          navigate("/kontakt");
        }}
      >
        Kontakt
      </a>
      <a
        href="/o-nas"
        onClick={(e) => {
          e.preventDefault();
          navigate("/o-nas");
        }}
      >
        O nas
      </a>
    </Box>
  );
}

export default Nav;
