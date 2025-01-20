import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
  Typography,
} from "@mui/material";
import { CustomerType } from "@/enums/CustomerType.ts";

interface CustomerTypeRadiosProps {
  customerType: CustomerType;
  setCustomerType: (type: CustomerType) => void;
  error?: string;
  touched?: boolean;
}

function CustomerTypeRadios({
  customerType,
  setCustomerType,
  error,
  touched,
}: CustomerTypeRadiosProps) {
  return (
    <Box className="flex items-center">
      <Typography variant="body1" sx={{ mr: "1em" }}>
        Typ klienta:
      </Typography>

      <FormControl
        required
        error={Boolean(error) && touched}
        component="fieldset"
        variant="standard"
        sx={{ display: "flex", flexDirection: "row" }}
      >
        <FormControlLabel
          control={
            <Radio
              checked={customerType === CustomerType.PERSON}
              onChange={() => setCustomerType(CustomerType.PERSON)}
            />
          }
          label="Osoba prywatna"
        />

        <FormControlLabel
          control={
            <Radio
              checked={customerType === CustomerType.COMPANY}
              onChange={() => setCustomerType(CustomerType.COMPANY)}
            />
          }
          label="Firma"
        />

        <FormHelperText sx={{ m: 0 }}>{error}</FormHelperText>
      </FormControl>
    </Box>
  );
}

export default CustomerTypeRadios;
