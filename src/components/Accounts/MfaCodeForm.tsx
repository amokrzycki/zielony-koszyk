import { useState, type FormEvent } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";

type Props = {
  onSubmit: (code: string) => Promise<void>;
  onCancel: () => void;
};

function MfaCodeForm({ onSubmit, onCancel }: Props) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(code)) return;

    setSubmitting(true);
    setError("");
    try {
      await onSubmit(code);
    } catch {
      setError("Kod jest nieprawidłowy lub wygasł");
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="flex flex-col items-center gap-4" sx={{ width: "100%" }}>
      <Typography>Wpisz sześciocyfrowy kod wysłany e-mailem.</Typography>
      <TextField
        autoFocus
        label="Kod jednorazowy"
        value={code}
        onChange={(event) => {
          setCode(event.target.value.replace(/\D/g, "").slice(0, 6));
          setError("");
        }}
        error={Boolean(error)}
        helperText={error}
        slotProps={{
          htmlInput: { inputMode: "numeric", autoComplete: "one-time-code", maxLength: 6 },
          formHelperText: { role: "alert" },
        }}
        sx={{ width: "100%", maxWidth: "300px" }}
      />
      <Box className="flex gap-2">
        <Button type="button" onClick={onCancel} disabled={submitting}>
          Wróć
        </Button>
        <Button type="submit" variant="contained" disabled={code.length !== 6 || submitting}>
          {submitting ? "Weryfikowanie…" : "Potwierdź"}
        </Button>
      </Box>
    </Box>
  );
}

export default MfaCodeForm;
