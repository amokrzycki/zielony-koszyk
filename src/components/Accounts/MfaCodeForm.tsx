import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Box, Button, TextField, Typography } from "@mui/material";
import { ctaButtonSx, ghostButtonSx } from "@/components/listingStyles.ts";

type Props = {
  instruction: string;
  onSubmit: (code: string) => Promise<void>;
  onCancel: () => void;
};

function MfaCodeForm({ instruction, onSubmit, onCancel }: Props) {
  const { t } = useTranslation("account");
  const [code, setCode] = useState("");
  const [failed, setFailed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(code)) return;

    setSubmitting(true);
    setFailed(false);
    try {
      await onSubmit(code);
    } catch {
      setFailed(true);
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="flex flex-col items-center gap-4" sx={{ width: "100%" }}>
      <Typography>{instruction}</Typography>
      <TextField
        autoFocus
        label={t("mfaCode.label")}
        value={code}
        onChange={(event) => {
          setCode(event.target.value.replace(/\D/g, "").slice(0, 6));
          setFailed(false);
        }}
        error={failed}
        helperText={failed ? t("mfaCode.invalid") : ""}
        slotProps={{
          htmlInput: { inputMode: "numeric", autoComplete: "one-time-code", maxLength: 6 },
          formHelperText: { role: "alert" },
        }}
        sx={{ width: "100%", maxWidth: "300px" }}
      />
      <Box className="flex gap-2">
        <Button type="button" onClick={onCancel} disabled={submitting} sx={(theme) => ghostButtonSx(theme)}>
          {t("mfaCode.back")}
        </Button>
        <Button type="submit" variant="contained" disabled={code.length !== 6 || submitting} sx={ctaButtonSx}>
          {submitting ? t("mfaCode.verifying") : t("mfaCode.confirm")}
        </Button>
      </Box>
    </Box>
  );
}

export default MfaCodeForm;
