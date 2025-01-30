import { Box, TextField, Typography } from "@mui/material";
import { UseFormReturnType } from "@mantine/form";
import { Address } from "@/types/Address";
import CustomerTypeRadios from "@/components/common/CustomerTypeRadios";
import { CustomerType } from "@/enums/CustomerType";
import { IFormValues } from "@/components/Order/OrderDetails.tsx";

interface Props {
  form: UseFormReturnType<IFormValues>;
  setCustomerType: (newType: CustomerType) => void;
}

export default function ShippingFormFields({ form, setCustomerType }: Props) {
  const shipping = form.values.shipping;
  const customerType = shipping.customer_type;

  const getShippingProps = (fieldName: keyof Address) =>
    form.getInputProps(`shipping.${fieldName}`);

  const handleCustomerTypeChange = (newType: CustomerType) => {
    form.setFieldValue("shipping.customer_type", newType);
    setCustomerType(newType);
  };

  return (
    <Box className="flex flex-col gap-4">
      <Typography variant="h5">Dane do wysyłki</Typography>

      {/* Radio: osoba prywatna/firma */}
      <CustomerTypeRadios
        customerType={customerType}
        setCustomerType={handleCustomerTypeChange}
      />

      {customerType === CustomerType.PERSON && (
        <Box>
          <TextField
            label="Imię"
            required
            placeholder="Jan"
            {...getShippingProps("first_name")}
            helperText={form.errors["shipping.first_name"]}
            error={
              Boolean(form.errors["shipping.first_name"]) &&
              form.isTouched("shipping.first_name")
            }
            sx={{ mr: "1em" }}
          />
          <TextField
            label="Nazwisko"
            required
            placeholder="Kowalski"
            {...getShippingProps("last_name")}
            helperText={form.errors["shipping.last_name"]}
            error={
              Boolean(form.errors["shipping.last_name"]) &&
              form.isTouched("shipping.last_name")
            }
          />
        </Box>
      )}

      {customerType === CustomerType.COMPANY && (
        <Box>
          <TextField
            label="Nazwa firmy"
            required
            {...getShippingProps("company_name")}
            sx={{ mr: "1em" }}
            helperText={form.errors["shipping.company_name"]}
            error={
              Boolean(form.errors["shipping.company_name"]) &&
              form.isTouched("shipping.company_name")
            }
          />
          <TextField label="NIP" required {...getShippingProps("nip")} />
        </Box>
      )}

      <TextField
        label="Email"
        placeholder="placeholder@gmail.com"
        {...form.getInputProps("email")}
        helperText={form.errors.email}
        error={Boolean(form.errors.email) && form.isTouched("email")}
      />

      <TextField
        label="Numer telefonu"
        placeholder="+48123456789"
        {...getShippingProps("phone")}
        helperText={form.errors["shipping.phone"]}
        error={
          Boolean(form.errors["shipping.phone"]) &&
          form.isTouched("shipping.phone")
        }
      />

      {/* Ulica, numer, mieszkanie */}
      <Box>
        <TextField
          label="Ulica"
          {...getShippingProps("street")}
          helperText={form.errors["shipping.street"]}
          error={
            Boolean(form.errors["shipping.street"]) &&
            form.isTouched("shipping.street")
          }
          sx={{ mr: "1em" }}
        />
        <TextField
          label="Numer budynku"
          {...getShippingProps("building_number")}
          helperText={form.errors["shipping.building_number"]}
          error={
            Boolean(form.errors["shipping.building_number"]) &&
            form.isTouched("shipping.building_number")
          }
          sx={{ mr: "1em" }}
        />
        <TextField
          label="Numer mieszkania"
          {...getShippingProps("flat_number")}
          helperText={form.errors["shipping.flat_number"]}
          error={
            Boolean(form.errors["shipping.flat_number"]) &&
            form.isTouched("shipping.flat_number")
          }
        />
      </Box>

      <Box>
        <TextField
          label="Kod pocztowy"
          {...getShippingProps("zip")}
          helperText={form.errors["shipping.zip"]}
          error={
            Boolean(form.errors["shipping.zip"]) &&
            form.isTouched("shipping.zip")
          }
          sx={{ mr: "1em" }}
        />
        <TextField
          label="Miejscowość"
          {...getShippingProps("city")}
          helperText={form.errors["shipping.city"]}
          error={
            Boolean(form.errors["shipping.city"]) &&
            form.isTouched("shipping.city")
          }
        />
      </Box>
    </Box>
  );
}
