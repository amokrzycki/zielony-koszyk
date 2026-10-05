import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Button, Typography } from "@mui/material";
import { startAuthentication, WebAuthnError } from "@simplewebauthn/browser";
import type { AuthenticationResponseJSON, PublicKeyCredentialRequestOptionsJSON } from "@simplewebauthn/browser";
import { ctaButtonSx, ghostButtonSx } from "@/components/listingStyles.ts";

type Props = {
  options: PublicKeyCredentialRequestOptionsJSON;
  onSubmit: (response: AuthenticationResponseJSON) => Promise<void>;
  onCancel: () => void;
};

function MfaWebAuthnStep({ options, onSubmit, onCancel }: Props) {
  const { t } = useTranslation("account");
  const [error, setError] = useState<"cancelled" | "startFailed" | "failed" | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleClick = async () => {
    setError(null);
    setSubmitting(true);

    let response: AuthenticationResponseJSON;
    try {
      response = await startAuthentication({ optionsJSON: options });
    } catch (err) {
      setSubmitting(false);
      setError(err instanceof WebAuthnError && err.name === "NotAllowedError" ? "cancelled" : "startFailed");
      return;
    }

    try {
      await onSubmit(response);
    } catch {
      setError("failed");
      setSubmitting(false);
    }
  };

  return (
    <Box className="flex flex-col items-center gap-4" sx={{ width: "100%" }}>
      <Typography>{t("webauthn.instruction")}</Typography>
      {error && (
        <Typography color="error" role="alert">
          {t(`webauthn.errors.${error}`)}
        </Typography>
      )}
      <Box className="flex gap-2">
        <Button type="button" onClick={onCancel} disabled={submitting} sx={(theme) => ghostButtonSx(theme)}>
          {t("mfaCode.back")}
        </Button>
        <Button variant="contained" onClick={handleClick} disabled={submitting} sx={ctaButtonSx}>
          {submitting ? t("webauthn.waiting") : t("webauthn.use")}
        </Button>
      </Box>
    </Box>
  );
}

export default MfaWebAuthnStep;
