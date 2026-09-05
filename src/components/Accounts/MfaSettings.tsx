import { useState, type FormEvent } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks.ts";
import { MfaMethod } from "@/enums/MfaMethod.ts";
import { updateUserDetails } from "./accountSlice.ts";
import {
  type TotpEnrollmentResponse,
  useStartTotpEnrollmentMutation,
  useVerifyTotpEnrollmentMutation,
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
    </Box>
  );
}

export default MfaSettings;
