import { UseFormReturnType } from "@mantine/form";
import { IChangeAddressesFormValues } from "@/components/Accounts/Address/ChangeAddresses.tsx";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
  Typography,
} from "@mui/material";

interface AddressTypeRadiosProps {
  form: UseFormReturnType<
    IChangeAddressesFormValues,
    (values: IChangeAddressesFormValues) => IChangeAddressesFormValues
  >;
}

function AddressTypeRadios({ form }: AddressTypeRadiosProps) {
  return (
    <Box className={"flex items-center"}>
      <Typography variant={"body1"} sx={{ mr: "1em" }}>
        Adres używany w:
      </Typography>
      <FormControl
        required
        error={Boolean(form.errors.type) && form.isTouched("type")}
        component="fieldset"
        variant={"standard"}
        sx={{ display: "flex", flexDirection: "row" }}
      >
        <FormControlLabel
          control={
            <Radio
              {...form.getInputProps("type")}
              value={"BILLING"}
              checked={form.getValues().type === "BILLING"}
            />
          }
          label={"rachunku"}
        />
        <FormControlLabel
          control={
            <Radio
              {...form.getInputProps("type")}
              value={"DELIVERY"}
              checked={form.getValues().type === "DELIVERY"}
            />
          }
          label={"dostawie"}
        />
        <FormHelperText sx={{ m: 0 }}>{form.errors.type}</FormHelperText>
      </FormControl>
    </Box>
  );
}

export default AddressTypeRadios;
