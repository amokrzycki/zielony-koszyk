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
import { CustomerType } from "@/enums/CustomerType.ts";

interface CustomerTypeProps {
  form: UseFormReturnType<
    IChangeAddressesFormValues,
    (values: IChangeAddressesFormValues) => IChangeAddressesFormValues
  >;
  setCustomerType: (type: CustomerType) => void;
}

function CustomerTypeRadios({ form, setCustomerType }: CustomerTypeProps) {
  return (
    <Box className={"flex items-center"}>
      <Typography variant={"body1"} sx={{ mr: "1em" }}>
        Typ klienta:
      </Typography>
      <FormControl
        required
        error={
          Boolean(form.errors.customer_type) && form.isTouched("customer_type")
        }
        component="fieldset"
        variant={"standard"}
        sx={{ display: "flex", flexDirection: "row" }}
      >
        <FormControlLabel
          control={
            <Radio
              value={CustomerType.PERSON}
              {...form.getInputProps("customer_type")}
              checked={form.getValues().customer_type === CustomerType.PERSON}
              onChange={() => {
                form.setFieldValue("customer_type", CustomerType.PERSON);
                setCustomerType(CustomerType.PERSON);
              }}
            />
          }
          label={"Osoba prywatna"}
        />
        <FormControlLabel
          control={
            <Radio
              {...form.getInputProps("customer_type")}
              value={CustomerType.COMPANY}
              checked={form.getValues().customer_type === CustomerType.COMPANY}
              onChange={() => {
                form.setFieldValue("customer_type", CustomerType.COMPANY);
                setCustomerType(CustomerType.COMPANY);
              }}
            />
          }
          label={"Firma"}
        />
        <FormHelperText sx={{ m: 0 }}>
          {form.errors.customer_type}
        </FormHelperText>
      </FormControl>
    </Box>
  );
}

export default CustomerTypeRadios;
