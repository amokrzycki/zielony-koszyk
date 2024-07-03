import { Box, ButtonBase, styled, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Categories() {
  const navigate = useNavigate();
  // refactor this, it should use also description
  const categories = [
    {
      name: "Owoce",
      description: "Warzywa sprzedajemy w cenie hurtowej",
      image: "/images/fruits.jpeg",
      category: "owoce",
    },
    {
      name: "Warzywa",
      description: "Oferujemy warzywa pochodzące z ekologicznych upraw",
      image: "/images/vegatables.jpeg",
      category: "warzywa",
    },
    {
      name: "Artykuły spożywcze",
      description:
        "W ofercie posiadamy również produkty greckie m.in. oliwy, miody, herbaty",
      image: "/images/others.jpeg",
      category: "inne",
    },
    {
      name: "Produkty sezonowe",
      description:
        "Susze, kasze, Grochy czyli produkty, które warto mieć w swojej kuchni",
      image: "/images/seasonal.jpeg",
      category: "sezonowe",
    },
    {
      name: "Opakowania zbiorcze",
      description:
        "Produkty pakowane w workach oraz skrzynkach w niższych cenach",
      image: "/images/collective.jpeg",
      category: "worki",
    },
  ];

  const ImageButton = styled(ButtonBase)(({ theme }) => ({
    position: "relative",
    height: 200,
    [theme.breakpoints.down("sm")]: {
      width: "100% !important",
      height: 100,
    },
    "&:hover, &.Mui-focusVisible": {
      zIndex: 1,
      "& .MuiImageBackdrop-root": {
        opacity: 0.15,
      },
      "& .MuiImageMarked-root": {
        opacity: 0,
      },
      "& .MuiTypography-root": {
        border: "4px solid currentColor",
      },
    },
  }));

  const ImageSrc = styled("span")({
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: "cover",
    backgroundPosition: "center 40%",
  });

  const Image = styled("span")(({ theme }) => ({
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.common.white,
  }));

  const ImageBackdrop = styled("span")(({ theme }) => ({
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.4,
    transition: theme.transitions.create("opacity"),
  }));

  const ImageMarked = styled("span")(({ theme }) => ({
    height: 3,
    width: 18,
    backgroundColor: theme.palette.common.white,
    position: "absolute",
    bottom: -2,
    left: "calc(50% - 9px)",
    transition: theme.transitions.create("opacity"),
  }));

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          minWidth: 300,
          width: "100%",
          justifyContent: "space-around",
          height: "500px",
        }}
      >
        {categories.map((category, index) => (
          <ImageButton
            focusRipple
            style={{
              width: "30%",
            }}
            key={index}
            onClick={() => navigate(`/kategoria/${category.category}`)}
          >
            <ImageSrc
              style={{
                backgroundImage: `url(${category.image})`,
              }}
            />
            <ImageBackdrop className="MuiImageBackdrop-root" />
            <Image>
              <Typography
                component="span"
                variant="subtitle1"
                color="inherit"
                sx={{
                  position: "relative",
                  p: 4,
                  pt: 2,
                  pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
                }}
              >
                {category.name}
                <ImageMarked className="MuiImageMarked-root" />
              </Typography>
            </Image>
          </ImageButton>
        ))}
      </Box>
    </>
  );
}

export default Categories;
