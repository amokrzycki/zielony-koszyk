import { useState, type FormEvent } from "react";
import { startRegistration, WebAuthnError, type RegistrationResponseJSON } from "@simplewebauthn/browser";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { apiErrorMessage } from "@/helpers/apiError.ts";
import { MfaMethod } from "@/enums/MfaMethod.ts";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks.ts";
import type { RootState } from "@/store/store.ts";
import { updateUserDetails } from "./accountSlice.ts";
import {
  type TotpEnrollmentResponse,
  useStartTotpEnrollmentMutation,
  useStartWebAuthnRegistrationMutation,
  useUpdateMfaMethodMutation,
  useVerifyTotpEnrollmentMutation,
  useVerifyWebAuthnRegistrationMutation,
} from "./accountsApiSlice.ts";
import MfaCodeForm from "./MfaCodeForm.tsx";
import SwapLayers from "@/components/common/SwapLayers.tsx";

const methods = [MfaMethod.EMAIL_OTP, MfaMethod.TOTP, MfaMethod.WEBAUTHN, MfaMethod.NONE] as const;

function MfaSettings() {
  const { t, i18n } = useTranslation("account");
  const dispatch = useAppDispatch();
  const method: MfaMethod = useAppSelector((state: RootState) => state.auth.user.mfa_method);
  const [selectedMethod, setSelectedMethod] = useState(method);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [enrollment, setEnrollment] = useState<TotpEnrollmentResponse | null>(null);
  const [isRegisteringWebAuthn, setIsRegisteringWebAuthn] = useState(false);
  const [updateMethod, { isLoading: isUpdating }] = useUpdateMfaMethodMutation();
  const [startEnrollment, { isLoading: isStartingTotp }] = useStartTotpEnrollmentMutation();
  const [verifyEnrollment] = useVerifyTotpEnrollmentMutation();
  const [startWebAuthnRegistration] = useStartWebAuthnRegistrationMutation();
  const [verifyWebAuthnRegistration] = useVerifyWebAuthnRegistrationMutation();
  const isBusy = isUpdating || isStartingTotp || isRegisteringWebAuthn;
  const isNoChange =
    selectedMethod === method && (selectedMethod === MfaMethod.NONE || selectedMethod === MfaMethod.EMAIL_OTP);

  const finish = (newMethod: MfaMethod, message: string) => {
    dispatch(updateUserDetails({ mfa_method: newMethod }));
    setPassword("");
    setError("");
    toast.success(message);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    try {
      if (selectedMethod === MfaMethod.TOTP) {
        setEnrollment(await startEnrollment(password).unwrap());
        setPassword("");
        return;
      }

      if (selectedMethod === MfaMethod.WEBAUTHN) {
        setIsRegisteringWebAuthn(true);
        const { challenge_id, options } = await startWebAuthnRegistration(password).unwrap();
        setPassword("");

        let response: RegistrationResponseJSON;
        try {
          response = await startRegistration({ optionsJSON: options });
        } catch (registrationError) {
          setError(
            registrationError instanceof WebAuthnError && registrationError.name === "NotAllowedError"
              ? t("mfa.errors.registrationCancelled")
              : t("mfa.errors.registrationFailed"),
          );
          return;
        }

        await verifyWebAuthnRegistration({ challengeId: challenge_id, response }).unwrap();
        finish(MfaMethod.WEBAUTHN, t("mfa.success.webauthn"));
        return;
      }

      await updateMethod({ method: selectedMethod, password }).unwrap();
      finish(selectedMethod, selectedMethod === MfaMethod.NONE ? t("mfa.success.none") : t("mfa.success.emailOtp"));
    } catch (e) {
      setError(apiErrorMessage(i18n.t, e, t("mfa.errors.saveFailed")));
    } finally {
      setIsRegisteringWebAuthn(false);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 720, mx: "auto", textAlign: "left" }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ alignItems: { xs: "flex-start", sm: "center" }, justifyContent: "space-between", mb: 4 }}>
        <Box>
          <Typography component="h1" variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {t("mfa.title")}
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: "65ch" }}>
            {t("mfa.subtitle")}
          </Typography>
        </Box>
        <Chip
          color={method === MfaMethod.NONE ? "default" : "success"}
          label={
            method === MfaMethod.NONE
              ? t("mfa.disabledChip")
              : t("mfa.activeChip", { method: t(`mfa.activeLabels.${method}`) })
          }
          sx={{ maxWidth: "100%", height: "auto", py: 0.5, "& .MuiChip-label": { whiteSpace: "normal" } }}
        />
      </Stack>

      <SwapLayers id={enrollment ? "totp" : "method"} tween={false}>
        {enrollment ? (
          <Stack spacing={3}>
            <Box>
              <Typography component="h2" variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                {t("mfa.totp.title")}
              </Typography>
              <Typography color="text.secondary">{t("mfa.totp.note")}</Typography>
            </Box>
            <Alert severity="info">{t("mfa.totp.alert")}</Alert>
            <TextField
              fullWidth
              multiline
              label={t("mfa.totp.uri")}
              value={enrollment.otpauth_uri}
              slotProps={{ htmlInput: { readOnly: true } }}
            />
            <TextField
              fullWidth
              label={t("mfa.totp.secret")}
              value={enrollment.secret}
              slotProps={{ htmlInput: { readOnly: true } }}
            />
            <MfaCodeForm
              instruction={t("mfa.totp.instruction")}
              onCancel={() => {
                setEnrollment(null);
                setSelectedMethod(method);
              }}
              onSubmit={async (code) => {
                await verifyEnrollment({ challengeId: enrollment.challenge_id, code }).unwrap();
                setEnrollment(null);
                finish(MfaMethod.TOTP, t("mfa.success.totp"));
              }}
            />
          </Stack>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel
                component="legend"
                sx={{
                  color: "text.primary",
                  "&.Mui-focused": { color: "text.primary" },
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  mb: 1.5,
                }}>
                {t("mfa.chooseMethod")}
              </FormLabel>
              <Paper variant="outlined" sx={{ overflow: "hidden" }}>
                <RadioGroup
                  value={selectedMethod}
                  onChange={(event) => {
                    setSelectedMethod(event.target.value as MfaMethod);
                    setPassword("");
                    setError("");
                  }}>
                  {methods.map((option, index) => (
                    <Box key={option}>
                      <FormControlLabel
                        value={option}
                        control={<Radio />}
                        disabled={isBusy}
                        label={
                          <Box sx={{ py: 1.5, minWidth: 0 }}>
                            <Typography sx={{ fontWeight: 700 }}>{t(`mfa.methods.${option}.label`)}</Typography>
                            <Typography color="text.secondary" variant="body2" sx={{ overflowWrap: "anywhere" }}>
                              {t(`mfa.methods.${option}.description`)}
                            </Typography>
                          </Box>
                        }
                        sx={{ alignItems: "flex-start", m: 0, px: 2, width: "100%", "& .MuiRadio-root": { mt: 0.75 } }}
                      />
                      {index < methods.length - 1 && <Divider />}
                    </Box>
                  ))}
                </RadioGroup>
              </Paper>
            </FormControl>

            {isNoChange ? (
              <Typography color="text.secondary" sx={{ mt: 2 }}>
                {t("mfa.alreadyActive")}
              </Typography>
            ) : (
              <Stack spacing={2} sx={{ mt: 3, maxWidth: 460 }}>
                <Typography id="mfa-password-help" color="text.secondary">
                  {t("mfa.confirmWithPassword")}
                </Typography>
                {error && (
                  <Alert severity="error" role="alert">
                    {error}
                  </Alert>
                )}
                <TextField
                  required
                  fullWidth
                  type="password"
                  autoComplete="current-password"
                  label={t("mfa.currentPassword")}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                  disabled={isBusy}
                  slotProps={{ htmlInput: { "aria-describedby": "mfa-password-help" } }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color={selectedMethod === MfaMethod.NONE ? "error" : "primary"}
                  disabled={!password || isBusy}
                  sx={{ alignSelf: { xs: "stretch", sm: "flex-start" } }}>
                  {isBusy
                    ? t("mfa.submit.saving")
                    : selectedMethod === MfaMethod.NONE
                      ? t("mfa.submit.none")
                      : selectedMethod === MfaMethod.EMAIL_OTP
                        ? t("mfa.submit.emailOtp")
                        : selectedMethod === MfaMethod.TOTP
                          ? method === MfaMethod.TOTP
                            ? t("mfa.submit.totpAgain")
                            : t("mfa.submit.totp")
                          : method === MfaMethod.WEBAUTHN
                            ? t("mfa.submit.webauthnAgain")
                            : t("mfa.submit.webauthn")}
                </Button>
              </Stack>
            )}
          </Box>
        )}
      </SwapLayers>
    </Box>
  );
}

export default MfaSettings;
