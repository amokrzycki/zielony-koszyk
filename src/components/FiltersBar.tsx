import { Box, Typography } from "@mui/material";
import Search from "./Products/Search.tsx";

function FiltersBar() {
  return (
    <Box
      id="search-wrapper"
      className={"flex justify-between items-center gap-2 p-8 rounded-2xl"}
      sx={{
        bgcolor: "background.paper",
      }}
    >
      <Box>
        <Typography variant="h5" component="h2">
          Sortowanie:
        </Typography>
        Sortowanie domyślne
      </Box>
      <Box>
        <Typography variant="h5" component="h2">
          Pokaż:
        </Typography>
        20
      </Box>
      <Search />
    </Box>
  );
}

export default FiltersBar;
