import { Box, TextField, Typography } from "@mui/material";
import type { UseFormReturnType } from "@mantine/form";
import type { Address } from "@/types/Address";
import CustomerTypeRadios from "@/components/common/CustomerTypeRadios";
import Reveal from "@/components/common/Reveal.tsx";
import { CustomerType } from "@/enums/CustomerType";
import type { IFormValues } from "@/components/Order/OrderDetails.tsx";

interface Props {
  form: UseFormReturnType<IFormValues>;
  setCustomerType: (newType: CustomerType) => void;
}

const fieldGrid = { display: "grid", gap: 2 };

export default function ShippingFormFields({ form, setCustomerType }: Props) {
  const shipping = form.values.shipping;
  const customerType = shipping.customer_type;

  const getShippingProps = (fieldName: keyof Address) => form.getInputProps(`shipping.${fieldName}`);

  const handleCustomerTypeChange = (newType: CustomerType) => {
    form.setFieldValue("shipping.customer_type", newType);
    setCustomerType(newType);
  };

  return (
    <Box className="flex flex-col gap-4">
      <Typography component="h2" sx={{ m: 0, fontSize: "1.35rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
        Dane do wysyłki
      </Typography>

      <CustomerTypeRadios customerType={customerType} setCustomerType={handleCustomerTypeChange} />

      {customerType === CustomerType.PERSON && (
        <Reveal>
          <Box sx={{ ...fieldGrid, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
            <TextField
              fullWidth
              label="Imię"
              required
              placeholder="Jan"
              autoComplete="given-name"
              {...getShippingProps("first_name")}
              helperText={form.errors["shipping.first_name"]}
              error={Boolean(form.errors["shipping.first_name"]) && form.isTouched("shipping.first_name")}
            />
            <TextField
              fullWidth
              label="Nazwisko"
              required
              placeholder="Kowalski"
              autoComplete="family-name"
              {...getShippingProps("last_name")}
              helperText={form.errors["shipping.last_name"]}
              error={Boolean(form.errors["shipping.last_name"]) && form.isTouched("shipping.last_name")}
            />
          </Box>
        </Reveal>
      )}

      {customerType === CustomerType.COMPANY && (
        <Reveal>
          <Box sx={{ ...fieldGrid, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
            <TextField
              fullWidth
              label="Nazwa firmy"
              required
              placeholder="Firma XYZ"
              autoComplete="organization"
              {...getShippingProps("company_name")}
              helperText={form.errors["shipping.company_name"]}
              error={Boolean(form.errors["shipping.company_name"]) && form.isTouched("shipping.company_name")}
            />
            <TextField
              fullWidth
              label="NIP"
              required
              placeholder="1234567890"
              {...getShippingProps("nip")}
              helperText={form.errors["shipping.nip"]}
              error={Boolean(form.errors["shipping.nip"]) && form.isTouched("shipping.nip")}
            />
          </Box>
        </Reveal>
      )}

      <Box sx={{ ...fieldGrid, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
        <TextField
          fullWidth
          label="Numer telefonu"
          required
          type="tel"
          placeholder="+48123456789"
          autoComplete="tel"
          {...getShippingProps("phone")}
          helperText={form.errors["shipping.phone"]}
          error={Boolean(form.errors["shipping.phone"]) && form.isTouched("shipping.phone")}
        />
        <TextField
          fullWidth
          label="Adres e-mail"
          required
          type="email"
          placeholder="jan@przyklad.pl"
          autoComplete="email"
          {...form.getInputProps("email")}
          helperText={form.errors.email}
          error={Boolean(form.errors.email) && form.isTouched("email")}
        />
      </Box>

      <Box sx={{ ...fieldGrid, gridTemplateColumns: { xs: "1fr", sm: "2fr 1fr 1fr" } }}>
        <TextField
          fullWidth
          label="Ulica"
          required
          placeholder="ul. Przykładowa"
          autoComplete="address-line1"
          {...getShippingProps("street")}
          helperText={form.errors["shipping.street"]}
          error={Boolean(form.errors["shipping.street"]) && form.isTouched("shipping.street")}
        />
        <TextField
          fullWidth
          label="Nr budynku"
          required
          placeholder="1A"
          {...getShippingProps("building_number")}
          helperText={form.errors["shipping.building_number"]}
          error={Boolean(form.errors["shipping.building_number"]) && form.isTouched("shipping.building_number")}
        />
        <TextField
          fullWidth
          label="Nr mieszkania"
          placeholder="14"
          {...getShippingProps("flat_number")}
          helperText={form.errors["shipping.flat_number"]}
          error={Boolean(form.errors["shipping.flat_number"]) && form.isTouched("shipping.flat_number")}
        />
      </Box>

      <Box sx={{ ...fieldGrid, gridTemplateColumns: { xs: "1fr", sm: "1fr 2fr" } }}>
        <TextField
          fullWidth
          label="Kod pocztowy"
          required
          placeholder="00-000"
          autoComplete="postal-code"
          {...getShippingProps("zip")}
          helperText={form.errors["shipping.zip"]}
          error={Boolean(form.errors["shipping.zip"]) && form.isTouched("shipping.zip")}
        />
        <TextField
          fullWidth
          label="Miejscowość"
          required
          placeholder="Warszawa"
          autoComplete="address-level2"
          {...getShippingProps("city")}
          helperText={form.errors["shipping.city"]}
          error={Boolean(form.errors["shipping.city"]) && form.isTouched("shipping.city")}
        />
      </Box>
    </Box>
  );
}
