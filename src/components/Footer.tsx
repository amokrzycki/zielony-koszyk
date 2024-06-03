import { Box } from "@mui/material";

function Footer() {
  return (
    <footer id="app-footer">
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          padding: 2,
          backgroundColor: "lightgray",
          "& img": {
            width: 50,
            height: 50,
            objectFit: "cover",
          },
          "& div": {
            cursor: "pointer",
          },
        }}
      >
        <Box>Strona główna</Box>
        <Box>Produkty</Box>
        <Box>O nas</Box>
        <Box>Kontakt</Box>
      </Box>
    </footer>
  );
}

export default Footer;
