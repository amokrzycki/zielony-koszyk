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

// TODO: Add helper text to fields and error handling

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
            sx={{ mr: "1em" }}
          />
          <TextField
            label="Nazwisko"
            required
            placeholder="Kowalski"
            {...getShippingProps("last_name")}
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
          />
          <TextField label="NIP" required {...getShippingProps("nip")} />
        </Box>
      )}

      <TextField
        label="Email"
        placeholder="placeholder@gmail.com"
        {...form.getInputProps("email")}
      />

      <TextField
        label="Numer telefonu"
        placeholder="+48123456789"
        {...getShippingProps("phone")}
      />

      {/* Ulica, numer, mieszkanie */}
      <Box>
        <TextField
          label="Ulica"
          {...getShippingProps("street")}
          sx={{ mr: "1em" }}
        />
        <TextField
          label="Numer budynku"
          {...getShippingProps("building_number")}
          sx={{ mr: "1em" }}
        />
        <TextField
          label="Numer mieszkania"
          {...getShippingProps("flat_number")}
        />
      </Box>

      <Box>
        <TextField
          label="Kod pocztowy"
          {...getShippingProps("zip")}
          sx={{ mr: "1em" }}
        />
        <TextField label="Miejscowość" {...getShippingProps("city")} />
      </Box>
    </Box>
  );
}
