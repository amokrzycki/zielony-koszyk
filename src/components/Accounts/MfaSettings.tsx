import { useState, type FormEvent } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import toast from "react-hot-toast";
import { startRegistration, WebAuthnError } from "@simplewebauthn/browser";
import type { RegistrationResponseJSON } from "@simplewebauthn/browser";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks.ts";
import { MfaMethod } from "@/enums/MfaMethod.ts";
import { updateUserDetails } from "./accountSlice.ts";
import {
  type TotpEnrollmentResponse,
  useStartTotpEnrollmentMutation,
  useStartWebAuthnRegistrationMutation,
  useVerifyTotpEnrollmentMutation,
  useVerifyWebAuthnRegistrationMutation,
} from "./accountsApiSlice.ts";
import MfaCodeForm from "./MfaCodeForm.tsx";

function MfaSettings() {
  const dispatch = useAppDispatch();
  const method = useAppSelector((state) => state.auth.user.mfa_method);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [enrollment, setEnrollment] = useState<TotpEnrollmentResponse | null>(null);
  const [startEnrollment, { isLoading: isStarting }] = useStartTotpEnrollmentMutation();
  const [verifyEnrollment] = useVerifyTotpEnrollmentMutation();
  const [webAuthnPassword, setWebAuthnPassword] = useState("");
  const [webAuthnError, setWebAuthnError] = useState("");
  const [isRegisteringWebAuthn, setIsRegisteringWebAuthn] = useState(false);
  const [startWebAuthnRegistration] = useStartWebAuthnRegistrationMutation();
  const [verifyWebAuthnRegistration] = useVerifyWebAuthnRegistrationMutation();

  const handleStart = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      setEnrollment(await startEnrollment(password).unwrap());
      setPassword("");
    } catch {
      setError("Nie udało się rozpocząć konfiguracji TOTP. Sprawdź hasło i spróbuj ponownie.");
    }
  };

  const handleWebAuthnRegistration = async (event: FormEvent) => {
    event.preventDefault();
    setWebAuthnError("");
    setIsRegisteringWebAuthn(true);
    try {
      const { challenge_id, options } = await startWebAuthnRegistration(webAuthnPassword).unwrap();
      setWebAuthnPassword("");

      let response: RegistrationResponseJSON;
      try {
        response = await startRegistration({ optionsJSON: options });
      } catch (err) {
        setWebAuthnError(
          err instanceof WebAuthnError && err.name === "NotAllowedError"
            ? "Rejestracja klucza została anulowana."
            : "Nie udało się uruchomić klucza platformowego.",
        );
        return;
      }

      await verifyWebAuthnRegistration({ challengeId: challenge_id, response }).unwrap();
      dispatch(updateUserDetails({ mfa_method: MfaMethod.WEBAUTHN }));
      toast.success("Klucz platformowy został skonfigurowany");
    } catch {
      setWebAuthnError("Nie udało się skonfigurować klucza. Sprawdź hasło i spróbuj ponownie.");
    } finally {
      setIsRegisteringWebAuthn(false);
    }
  };

  return (
    <Box className="flex flex-col items-center gap-4" sx={{ maxWidth: 640, mx: "auto" }}>
      <Typography variant="h4">Uwierzytelnianie TOTP</Typography>
      <Typography>Aktualna metoda MFA: {method}</Typography>

      {enrollment ? (
        <Box className="flex flex-col items-center gap-4" sx={{ width: "100%" }}>
          <Typography>
            Dodaj konto w aplikacji uwierzytelniającej przy użyciu URI lub sekretu, potem wpisz pierwszy kod.
          </Typography>
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
            onCancel={() => setEnrollment(null)}
            onSubmit={async (code) => {
              await verifyEnrollment({ challengeId: enrollment.challenge_id, code }).unwrap();
              setEnrollment(null);
              dispatch(updateUserDetails({ mfa_method: MfaMethod.TOTP }));
              toast.success("Uwierzytelnianie TOTP zostało włączone");
            }}
          />
        </Box>
      ) : (
        <Box
          component="form"
          onSubmit={handleStart}
          className="flex flex-col items-center gap-4"
          sx={{ width: "100%" }}>
          <Typography>Podaj aktualne hasło, aby rozpocząć konfigurację TOTP.</Typography>
          <TextField
            type="password"
            autoComplete="current-password"
            label="Aktualne hasło"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError("");
            }}
            error={Boolean(error)}
            helperText={error}
            slotProps={{ formHelperText: { role: "alert" } }}
            sx={{ width: "100%", maxWidth: 300 }}
          />
          <Button type="submit" variant="contained" disabled={!password || isStarting}>
            {isStarting ? "Rozpoczynanie…" : "Skonfiguruj TOTP"}
          </Button>
        </Box>
      )}

      <Typography variant="h4">Klucz platformowy (WebAuthn)</Typography>
      <Box
        component="form"
        onSubmit={handleWebAuthnRegistration}
        className="flex flex-col items-center gap-4"
        sx={{ width: "100%" }}>
        <Typography>
          Podaj aktualne hasło, aby skonfigurować logowanie kluczem platformowym (np. Windows Hello).
        </Typography>
        <TextField
          type="password"
          autoComplete="current-password"
          label="Aktualne hasło"
          value={webAuthnPassword}
          onChange={(event) => {
            setWebAuthnPassword(event.target.value);
            setWebAuthnError("");
          }}
          error={Boolean(webAuthnError)}
          helperText={webAuthnError}
          slotProps={{ formHelperText: { role: "alert" } }}
          sx={{ width: "100%", maxWidth: 300 }}
        />
        <Button type="submit" variant="contained" disabled={!webAuthnPassword || isRegisteringWebAuthn}>
          {isRegisteringWebAuthn ? "Konfigurowanie…" : "Skonfiguruj klucz platformowy"}
        </Button>
      </Box>
    </Box>
  );
}

export default MfaSettings;
