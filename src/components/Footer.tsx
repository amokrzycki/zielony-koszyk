import React from "react";
import { Box, Grid, Link, Typography } from "@mui/material";

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "background.paper",
        padding: "20px",
        marginTop: "auto",
        textAlign: "center",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <Typography variant="h6" gutterBottom>
            Zielony koszyk
          </Typography>
          <Typography variant="body2">
            Zielony Koszyk oferuje warzywa i owoce, jak również susze, grochy,
            przyprawy, oliwę z oliwek oraz inne produkty greckie.
          </Typography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography variant="h6" gutterBottom>
            Oferujemy m.in:
          </Typography>
          <Typography variant="body2">Ziemniaki</Typography>
          <Typography variant="body2">Kapustę</Typography>
          <Typography variant="body2">Jabłka</Typography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography variant="h6" gutterBottom>
            Szybka dostawa
          </Typography>
          <Link href="#" underline="hover">
            Dostawa i płatność
          </Link>
          <Link href="#" underline="hover">
            Polityka prywatności
          </Link>
          <Link href="#" underline="hover">
            Regulamin
          </Link>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography variant="h6" gutterBottom>
            Znajdź nas:
          </Typography>
          <Link href="https://www.facebook.com" underline="hover">
            Facebook
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
