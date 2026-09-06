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

const methods = [
  {
    value: MfaMethod.EMAIL_OTP,
    label: "Kod e-mail",
    description: "Sześciocyfrowy kod wysyłany na adres przypisany do konta.",
  },
  {
    value: MfaMethod.TOTP,
    label: "Aplikacja uwierzytelniająca",
    description: "Kod TOTP z aplikacji takiej jak Google Authenticator lub 2FAS.",
  },
  {
    value: MfaMethod.WEBAUTHN,
    label: "Klucz platformowy",
    description: "Passkey zapisany na urządzeniu, np. Windows Hello.",
  },
  {
    value: MfaMethod.NONE,
    label: "Wyłączone",
    description: "Logowanie tylko za pomocą hasła.",
  },
] as const;

const methodLabels: Record<MfaMethod, string> = {
  [MfaMethod.NONE]: "Wyłączone",
  [MfaMethod.EMAIL_OTP]: "Kod e-mail",
  [MfaMethod.TOTP]: "Aplikacja uwierzytelniająca (TOTP)",
  [MfaMethod.WEBAUTHN]: "Klucz platformowy (WebAuthn)",
};

function MfaSettings() {
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
              ? "Rejestracja klucza została anulowana. Wybierz metodę i spróbuj ponownie."
              : "Nie udało się uruchomić klucza platformowego. Spróbuj ponownie.",
          );
          return;
        }

        await verifyWebAuthnRegistration({ challengeId: challenge_id, response }).unwrap();
        finish(MfaMethod.WEBAUTHN, "Klucz platformowy został skonfigurowany");
        return;
      }

      await updateMethod({ method: selectedMethod, password }).unwrap();
      finish(
        selectedMethod,
        selectedMethod === MfaMethod.NONE ? "MFA zostało wyłączone" : "Kody e-mail zostały włączone",
      );
    } catch {
      setError("Nie udało się zapisać zmiany. Sprawdź aktualne hasło i spróbuj ponownie.");
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
            Ustawienia MFA
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: "65ch" }}>
            Wybierz jeden dodatkowy sposób potwierdzania logowania.
          </Typography>
        </Box>
        <Chip
          color={method === MfaMethod.NONE ? "default" : "success"}
          label={method === MfaMethod.NONE ? "MFA wyłączone" : `Aktywna: ${methodLabels[method]}`}
          sx={{ maxWidth: "100%", height: "auto", py: 0.5, "& .MuiChip-label": { whiteSpace: "normal" } }}
        />
      </Stack>

      {enrollment ? (
        <Stack spacing={3}>
          <Box>
            <Typography component="h2" variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              Dokończ konfigurację TOTP
            </Typography>
            <Typography color="text.secondary">
              Dotychczasowa metoda pozostaje aktywna, dopóki nie potwierdzisz pierwszego kodu.
            </Typography>
          </Box>
          <Alert severity="info">
            Dodaj konto w aplikacji uwierzytelniającej przy użyciu URI lub sekretu, potem wpisz pierwszy kod.
          </Alert>
          <TextField
            fullWidth
            multiline
            label="URI otpauth://"
            value={enrollment.otpauth_uri}
            slotProps={{ htmlInput: { readOnly: true } }}
          />
          <TextField
            fullWidth
            label="Sekret do ręcznego wpisania"
            value={enrollment.secret}
            slotProps={{ htmlInput: { readOnly: true } }}
          />
          <MfaCodeForm
            instruction="Wpisz pierwszy sześciocyfrowy kod z aplikacji uwierzytelniającej."
            onCancel={() => {
              setEnrollment(null);
              setSelectedMethod(method);
            }}
            onSubmit={async (code) => {
              await verifyEnrollment({ challengeId: enrollment.challenge_id, code }).unwrap();
              setEnrollment(null);
              finish(MfaMethod.TOTP, "Uwierzytelnianie TOTP zostało włączone");
            }}
          />
        </Stack>
      ) : (
        <Box component="form" onSubmit={handleSubmit}>
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend" sx={{ color: "text.primary", fontSize: "1.25rem", fontWeight: 700, mb: 1.5 }}>
              Wybierz metodę
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
                  <Box key={option.value}>
                    <FormControlLabel
                      value={option.value}
                      control={<Radio />}
                      disabled={isBusy}
                      label={
                        <Box sx={{ py: 1.5, minWidth: 0 }}>
                          <Typography sx={{ fontWeight: 700 }}>{option.label}</Typography>
                          <Typography color="text.secondary" variant="body2" sx={{ overflowWrap: "anywhere" }}>
                            {option.description}
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
              Ta metoda jest już aktywna. Wybierz inną, aby ją zmienić.
            </Typography>
          ) : (
            <Stack spacing={2} sx={{ mt: 3, maxWidth: 460 }}>
              <Typography id="mfa-password-help" color="text.secondary">
                Potwierdź zmianę aktualnym hasłem.
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
                label="Aktualne hasło"
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
                  ? "Zapisywanie…"
                  : selectedMethod === MfaMethod.NONE
                    ? "Wyłącz MFA"
                    : selectedMethod === MfaMethod.EMAIL_OTP
                      ? "Włącz kody e-mail"
                      : selectedMethod === MfaMethod.TOTP
                        ? method === MfaMethod.TOTP
                          ? "Skonfiguruj TOTP ponownie"
                          : "Skonfiguruj TOTP"
                        : method === MfaMethod.WEBAUTHN
                          ? "Zarejestruj nowy klucz"
                          : "Skonfiguruj klucz platformowy"}
              </Button>
            </Stack>
          )}
        </Box>
      )}
    </Box>
  );
}

export default MfaSettings;
