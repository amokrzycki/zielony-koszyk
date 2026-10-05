import { Box, FormControl, FormControlLabel, FormHelperText, Radio, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { CustomerType } from "@/enums/CustomerType.ts";

interface CustomerTypeRadiosProps {
  customerType: CustomerType;
  setCustomerType: (type: CustomerType) => void;
  error?: string;
  touched?: boolean;
}

function CustomerTypeRadios({ customerType, setCustomerType, error, touched }: CustomerTypeRadiosProps) {
  const { t } = useTranslation();

  return (
    <Box className="flex flex-wrap items-center gap-x-4 gap-y-1">
      <Typography variant="body1">{t("customerType.label")}</Typography>

      <FormControl
        required
        error={Boolean(error) && touched}
        component="fieldset"
        variant="standard"
        sx={{ display: "flex", flexDirection: "row" }}>
        <FormControlLabel
          control={
            <Radio
              checked={customerType === CustomerType.PERSON}
              onChange={() => setCustomerType(CustomerType.PERSON)}
            />
          }
          label={t("customerType.person")}
        />

        <FormControlLabel
          control={
            <Radio
              checked={customerType === CustomerType.COMPANY}
              onChange={() => setCustomerType(CustomerType.COMPANY)}
            />
          }
          label={t("customerType.company")}
        />

        <FormHelperText sx={{ m: 0 }}>{error}</FormHelperText>
      </FormControl>
    </Box>
  );
}

export default CustomerTypeRadios;
