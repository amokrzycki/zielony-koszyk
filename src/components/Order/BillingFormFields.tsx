import { Box, TextField, Typography } from "@mui/material";
import { UseFormReturnType } from "@mantine/form";
import { Address } from "@/types/Address";
import { CustomerType } from "@/enums/CustomerType";
import CustomerTypeRadios from "@/components/common/CustomerTypeRadios";
import { IFormValues } from "@/components/Order/OrderDetails.tsx";

interface Props {
  form: UseFormReturnType<IFormValues>;
  setCustomerType: (newType: CustomerType) => void;
}

export default function BillingFormFields({ form, setCustomerType }: Props) {
  const billing = form.values.billing;
  const customerType = billing.customer_type;

  const getBillingProps = (fieldName: keyof Address) =>
    form.getInputProps(`billing.${fieldName}`);

  const handleCustomerTypeChange = (newType: CustomerType) => {
    form.setFieldValue("billing.customer_type", newType);
    setCustomerType(newType);
  };

  return (
    <Box className="flex flex-col gap-4" sx={{ mt: 2 }}>
      <Typography variant="h5">Dane do faktury</Typography>

      <CustomerTypeRadios
        customerType={customerType}
        setCustomerType={handleCustomerTypeChange}
      />

      {customerType === CustomerType.PERSON && (
        <Box>
          <TextField
            label="Imię"
            required
            {...getBillingProps("first_name")}
            sx={{ mr: "1em" }}
          />
          <TextField
            label="Nazwisko"
            required
            {...getBillingProps("last_name")}
          />
        </Box>
      )}
      {customerType === CustomerType.COMPANY && (
        <Box>
          <TextField
            label="Nazwa firmy"
            required
            {...getBillingProps("company_name")}
            sx={{ mr: "1em" }}
          />
          <TextField label="NIP" required {...getBillingProps("nip")} />
        </Box>
      )}

      <TextField label="Numer telefonu" {...getBillingProps("phone")} />

      <Box>
        <TextField
          label="Ulica"
          {...getBillingProps("street")}
          sx={{ mr: "1em" }}
        />
        <TextField
          label="Numer budynku"
          {...getBillingProps("building_number")}
          sx={{ mr: "1em" }}
        />
        <TextField
          label="Numer mieszkania"
          {...getBillingProps("flat_number")}
        />
      </Box>
      <Box>
        <TextField
          label="Kod pocztowy"
          {...getBillingProps("zip")}
          sx={{ mr: "1em" }}
        />
        <TextField label="Miejscowość" {...getBillingProps("city")} />
      </Box>
    </Box>
  );
}
