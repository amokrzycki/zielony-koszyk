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
            helperText={form.errors["billing.first_name"]}
            error={
              Boolean(form.errors["billing.first_name"]) &&
              form.isTouched("billing.first_name")
            }
            sx={{ mr: "1em" }}
          />
          <TextField
            label="Nazwisko"
            required
            {...getBillingProps("last_name")}
            helperText={form.errors["billing.last_name"]}
            error={
              Boolean(form.errors["billing.last_name"]) &&
              form.isTouched("billing.last_name")
            }
          />
        </Box>
      )}
      {customerType === CustomerType.COMPANY && (
        <Box>
          <TextField
            label="Nazwa firmy"
            required
            {...getBillingProps("company_name")}
            helperText={form.errors["billing.company_name"]}
            error={
              Boolean(form.errors["billing.company_name"]) &&
              form.isTouched("billing.company_name")
            }
            sx={{ mr: "1em" }}
          />
          <TextField
            label="NIP"
            required
            {...getBillingProps("nip")}
            helperText={form.errors["billing.nip"]}
            error={
              Boolean(form.errors["billing.nip"]) &&
              form.isTouched("billing.nip")
            }
          />
        </Box>
      )}

      <TextField
        label="Numer telefonu"
        {...getBillingProps("phone")}
        helperText={form.errors["billing.phone"]}
        error={
          Boolean(form.errors["billing.phone"]) &&
          form.isTouched("billing.phone")
        }
      />

      <Box>
        <TextField
          label="Ulica"
          {...getBillingProps("street")}
          helperText={form.errors["billing.street"]}
          error={
            Boolean(form.errors["billing.street"]) &&
            form.isTouched("billing.street")
          }
          sx={{ mr: "1em" }}
        />
        <TextField
          label="Numer budynku"
          {...getBillingProps("building_number")}
          helperText={form.errors["billing.building_number"]}
          error={
            Boolean(form.errors["billing.building_number"]) &&
            form.isTouched("billing.building_number")
          }
          sx={{ mr: "1em" }}
        />
        <TextField
          label="Numer mieszkania"
          helperText={form.errors["billing.flat_number"]}
          error={
            Boolean(form.errors["billing.flat_number"]) &&
            form.isTouched("billing.flat_number")
          }
          {...getBillingProps("flat_number")}
        />
      </Box>
      <Box>
        <TextField
          label="Kod pocztowy"
          {...getBillingProps("zip")}
          helperText={form.errors["billing.zip"]}
          error={
            Boolean(form.errors["billing.zip"]) && form.isTouched("billing.zip")
          }
          sx={{ mr: "1em" }}
        />
        <TextField label="Miejscowość" {...getBillingProps("city")} />
      </Box>
    </Box>
  );
}
