import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

interface ErrorProps {
  message?: string;
  errorText?: string;
}

function ErrorView({ message, errorText }: ErrorProps) {
  const { t } = useTranslation();

  return (
    <Box className={"flex w-full h-full items-center justify-center flex-col"}>
      <Typography
        variant={"h3"}
        sx={{
          color: "error.main",
        }}
        gutterBottom>
        {message ?? (errorText ? null : t("errors.generic"))}
      </Typography>
      <Typography
        variant={"body1"}
        sx={{
          color: "error.main",
        }}>
        {errorText}
      </Typography>
    </Box>
  );
}

export default ErrorView;
