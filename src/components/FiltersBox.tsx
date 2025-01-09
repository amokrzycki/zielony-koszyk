import { Box, Slider, Stack, Typography } from "@mui/material";
import { VolumeDown, VolumeUp } from "@mui/icons-material";
import { useState } from "react";

function FiltersBox() {
  const [value, setValue] = useState<number>(30);

  const handleChange = (_event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  return (
    <Box
      className={"flex-col p-8 h-1/3 rounded-2xl"}
      sx={{ bgcolor: "background.paper" }}
    >
      <Typography variant="h5" component="h2">
        Zakres cenowy:
      </Typography>
      <Stack spacing={2} direction="row" sx={{ alignItems: "center", mb: 1 }}>
        <VolumeDown />
        <Slider aria-label="Volume" value={value} onChange={handleChange} />
        <VolumeUp />
      </Stack>
    </Box>
  );
}

export default FiltersBox;
