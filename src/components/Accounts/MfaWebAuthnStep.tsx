import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { startAuthentication, WebAuthnError } from "@simplewebauthn/browser";
import type { AuthenticationResponseJSON, PublicKeyCredentialRequestOptionsJSON } from "@simplewebauthn/browser";

type Props = {
  options: PublicKeyCredentialRequestOptionsJSON;
  onSubmit: (response: AuthenticationResponseJSON) => Promise<void>;
  onCancel: () => void;
};

function MfaWebAuthnStep({ options, onSubmit, onCancel }: Props) {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleClick = async () => {
    setError("");
    setSubmitting(true);

    let response: AuthenticationResponseJSON;
    try {
      response = await startAuthentication({ optionsJSON: options });
    } catch (err) {
      setSubmitting(false);
      setError(
        err instanceof WebAuthnError && err.name === "NotAllowedError"
          ? "Uwierzytelnienie zostało anulowane."
          : "Nie udało się uruchomić klucza platformowego.",
      );
      return;
    }

    try {
      await onSubmit(response);
    } catch {
      setError("Uwierzytelnienie nie powiodło się.");
      setSubmitting(false);
    }
  };

  return (
    <Box className="flex flex-col items-center gap-4" sx={{ width: "100%" }}>
      <Typography>Potwierdź logowanie kluczem platformowym (np. Windows Hello).</Typography>
      {error && (
        <Typography color="error" role="alert">
          {error}
        </Typography>
      )}
      <Box className="flex gap-2">
        <Button type="button" onClick={onCancel} disabled={submitting}>
          Wróć
        </Button>
        <Button variant="contained" onClick={handleClick} disabled={submitting}>
          {submitting ? "Oczekiwanie…" : "Użyj klucza platformowego"}
        </Button>
      </Box>
    </Box>
  );
}

export default MfaWebAuthnStep;
