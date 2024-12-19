import { Box, Typography } from "@mui/material";

function About() {
  return (
    <Box id="main-wrapper">
      <Box
        className={"main-container"}
        sx={{
          bgcolor: "background.paper",
        }}
      >
        <Box className={"main-container"}>
          <Typography variant="h4" gutterBottom>
            Dzień dobry!
          </Typography>
          <Typography variant="body1" gutterBottom>
            Przedstawiamy Państwu sklep internetowy „Zielony Koszyk”,
            specjalizujący się w dostarczaniu świeżych warzyw, owoców i innych
            produktów spożywczych. Naszym celem jest zapewnienie najwyższej
            jakości asortymentu dla klientów indywidualnych i biznesowych. Od
            lat współpracujemy z lokalnymi rolnikami oraz sprawdzonymi
            dostawcami, dzięki czemu w naszej ofercie znajdą Państwo zarówno
            produkty pochodzenia krajowego, jak i zagranicznego. Dostarczamy
            nasze produkty na terenie Rzeszowa i okolic.
          </Typography>
          <Typography variant="h5" gutterBottom>
            Nasza oferta:
          </Typography>
          <Typography variant="body1" gutterBottom>
            - Świeże owoce i warzywa,
          </Typography>
          <Typography variant="body1" gutterBottom>
            - Produkty egzotyczne,
          </Typography>
          <Typography variant="body1" gutterBottom>
            - Przyprawy, oliwy z oliwek i suszone produkty,
          </Typography>
          <Typography variant="body1" gutterBottom>
            - Specjalności kuchni greckiej i wiele innych.
          </Typography>
          <Typography variant={"h5"} gutterBottom>
            Dbamy o najwyższą jakość obsługi, oferując:
          </Typography>
          <Typography variant="body1" gutterBottom>
            - Profesjonalną obsługę zamówień,
          </Typography>
          <Typography variant="body1" gutterBottom>
            - Elastyczne terminy realizacji dostaw,
          </Typography>
          <Typography variant="body1" gutterBottom>
            - Atrakcyjne ceny i promocje,
          </Typography>
          <Typography variant="body1" gutterBottom>
            - Darmową dostawę przy większych zamówieniach.
          </Typography>
          <Typography variant={"body1"} gutterBottom>
            Zapraszamy do współpracy klientów indywidualnych oraz firmy z branży
            gastronomicznej, cateringowej i handlowej. Sprawdź naszą ofertę i
            przekonaj się, dlaczego „Zielony Koszyk” to najlepszy wybór na
            rynku!
          </Typography>
          <Typography variant={"h6"} gutterBottom>
            Zespół Zielonego Koszyka
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default About;
