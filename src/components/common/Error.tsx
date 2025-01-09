import { Box, Typography } from "@mui/material";

interface ErrorProps {
  message?: string;
  errorText?: string;
}

function Error({ message, errorText }: ErrorProps) {
  return (
    <Box className={"flex w-full h-full items-center justify-center flex-col"}>
      <Typography
        variant={"h3"}
        sx={{
          color: "error.main",
        }}
        gutterBottom
      >
        {message}
      </Typography>
      <Typography
        variant={"body1"}
        sx={{
          color: "error.main",
        }}
      >
        {errorText}
      </Typography>
    </Box>
  );
}

export default Error;
