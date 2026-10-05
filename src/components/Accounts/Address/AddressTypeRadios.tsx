import type { UseFormReturnType } from "@mantine/form";
import type { IChangeAddressesFormValues } from "@/components/Accounts/Address/AddressForm.tsx";
import { useTranslation } from "react-i18next";
import { Box, FormControl, FormControlLabel, FormHelperText, Radio, Typography } from "@mui/material";

interface AddressTypeRadiosProps {
  form: UseFormReturnType<IChangeAddressesFormValues>;
}

function AddressTypeRadios({ form }: AddressTypeRadiosProps) {
  const { t } = useTranslation("account");
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1 }}>
      <Typography variant="body1" sx={{ mr: 1 }}>
        {t("addressType.label")}
      </Typography>
      <FormControl
        required
        error={Boolean(form.errors.type) && form.isTouched("type")}
        component="fieldset"
        variant={"standard"}
        sx={{ display: "flex", flexDirection: "row" }}>
        <FormControlLabel
          control={
            <Radio {...form.getInputProps("type")} value={"BILLING"} checked={form.getValues().type === "BILLING"} />
          }
          label={t("addressType.billing")}
        />
        <FormControlLabel
          control={
            <Radio {...form.getInputProps("type")} value={"DELIVERY"} checked={form.getValues().type === "DELIVERY"} />
          }
          label={t("addressType.delivery")}
        />
        <FormHelperText sx={{ m: 0 }}>{form.errors.type}</FormHelperText>
      </FormControl>
    </Box>
  );
}

export default AddressTypeRadios;
