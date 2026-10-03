import { Box, TextField, Typography } from "@mui/material";
import type { UseFormReturnType } from "@mantine/form";
import type { Address } from "@/types/Address";
import { CustomerType } from "@/enums/CustomerType";
import CustomerTypeRadios from "@/components/common/CustomerTypeRadios";
import Reveal from "@/components/common/Reveal.tsx";
import type { IFormValues } from "@/components/Order/OrderDetails.tsx";

interface Props {
  form: UseFormReturnType<IFormValues>;
  setCustomerType: (newType: CustomerType) => void;
}

const fieldGrid = { display: "grid", gap: 2 };

export default function BillingFormFields({ form, setCustomerType }: Props) {
  const billing = form.values.billing;
  const customerType = billing.customer_type;

  const getBillingProps = (fieldName: keyof Address) => form.getInputProps(`billing.${fieldName}`);

  const handleCustomerTypeChange = (newType: CustomerType) => {
    form.setFieldValue("billing.customer_type", newType);
    setCustomerType(newType);
  };

  return (
    <Box className="flex flex-col gap-4" sx={{ mt: 3 }}>
      <Typography component="h2" sx={{ m: 0, fontSize: "1.35rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
        Dane do faktury
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
              {...getBillingProps("first_name")}
              helperText={form.errors["billing.first_name"]}
              error={Boolean(form.errors["billing.first_name"]) && form.isTouched("billing.first_name")}
            />
            <TextField
              fullWidth
              label="Nazwisko"
              required
              placeholder="Kowalski"
              autoComplete="family-name"
              {...getBillingProps("last_name")}
              helperText={form.errors["billing.last_name"]}
              error={Boolean(form.errors["billing.last_name"]) && form.isTouched("billing.last_name")}
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
              {...getBillingProps("company_name")}
              helperText={form.errors["billing.company_name"]}
              error={Boolean(form.errors["billing.company_name"]) && form.isTouched("billing.company_name")}
            />
            <TextField
              fullWidth
              label="NIP"
              required
              placeholder="1234567890"
              {...getBillingProps("nip")}
              helperText={form.errors["billing.nip"]}
              error={Boolean(form.errors["billing.nip"]) && form.isTouched("billing.nip")}
            />
          </Box>
        </Reveal>
      )}

      <TextField
        fullWidth
        label="Numer telefonu"
        required
        type="tel"
        placeholder="+48123456789"
        autoComplete="tel"
        {...getBillingProps("phone")}
        helperText={form.errors["billing.phone"]}
        error={Boolean(form.errors["billing.phone"]) && form.isTouched("billing.phone")}
      />

      {/* Ulica, numer budynku i mieszkania */}
      <Box sx={{ ...fieldGrid, gridTemplateColumns: { xs: "1fr", sm: "2fr 1fr 1fr" } }}>
        <TextField
          fullWidth
          label="Ulica"
          required
          placeholder="ul. Przykładowa"
          autoComplete="address-line1"
          {...getBillingProps("street")}
          helperText={form.errors["billing.street"]}
          error={Boolean(form.errors["billing.street"]) && form.isTouched("billing.street")}
        />
        <TextField
          fullWidth
          label="Nr budynku"
          required
          placeholder="1A"
          {...getBillingProps("building_number")}
          helperText={form.errors["billing.building_number"]}
          error={Boolean(form.errors["billing.building_number"]) && form.isTouched("billing.building_number")}
        />
        <TextField
          fullWidth
          label="Nr mieszkania"
          placeholder="14"
          {...getBillingProps("flat_number")}
          helperText={form.errors["billing.flat_number"]}
          error={Boolean(form.errors["billing.flat_number"]) && form.isTouched("billing.flat_number")}
        />
      </Box>

      <Box sx={{ ...fieldGrid, gridTemplateColumns: { xs: "1fr", sm: "1fr 2fr" } }}>
        <TextField
          fullWidth
          label="Kod pocztowy"
          required
          placeholder="00-000"
          autoComplete="postal-code"
          {...getBillingProps("zip")}
          helperText={form.errors["billing.zip"]}
          error={Boolean(form.errors["billing.zip"]) && form.isTouched("billing.zip")}
        />
        <TextField
          fullWidth
          label="Miejscowość"
          required
          placeholder="Warszawa"
          autoComplete="address-level2"
          {...getBillingProps("city")}
          helperText={form.errors["billing.city"]}
          error={Boolean(form.errors["billing.city"]) && form.isTouched("billing.city")}
        />
      </Box>
    </Box>
  );
}
