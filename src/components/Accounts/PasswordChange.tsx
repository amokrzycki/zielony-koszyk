import { useState } from "react";
import { validateNewPassword, validatePassword, validatePasswordConfirmation } from "@/helpers/validators.ts";
import { useForm } from "@mantine/form";
import { Alert, Box, Button, Stack, TextField, Typography } from "@mui/material";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlined from "@mui/icons-material/VisibilityOffOutlined";
import LockResetRounded from "@mui/icons-material/LockResetRounded";
import { useChangePasswordMutation } from "./accountsApiSlice.ts";
import type User from "../../types/User.ts";
import { useAppSelector } from "@/hooks/hooks.ts";
import type { UpdatePasswordBody } from "@/types/UpdatePasswordBody.ts";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { accentText, ctaButtonSx, tone } from "@/components/listingStyles.ts";

export interface IPasswordChangeFormValues {
  oldPassword: string;
  password: string;
  passwordConfirmation: string;
}

const PASSWORD_HINT = "Minimum 8 znaków, z jedną cyfrą i jednym znakiem specjalnym.";

function PasswordChange() {
  const user: User = useAppSelector((state) => state.auth.user);
  const [updatePassword, { isLoading }] = useChangePasswordMutation();
  const navigate = useNavigate();
  const [showPasswords, setShowPasswords] = useState(false);
  const [error, setError] = useState("");

  const validate = {
    oldPassword: validatePassword,
    password: validateNewPassword,
    passwordConfirmation: validatePasswordConfirmation,
  };

  const form = useForm<IPasswordChangeFormValues>({
    initialValues: {
      oldPassword: "",
      password: "",
      passwordConfirmation: "",
    },
    validate,
    validateInputOnBlur: true,
    clearInputErrorOnChange: true,
  });

  const isValid = form.isValid();

  const handleSubmit = async (values: IPasswordChangeFormValues) => {
    setError("");

    const body: UpdatePasswordBody = {
      user_id: user.user_id,
      password: values.oldPassword,
      new_password: values.password,
    };

    try {
      await updatePassword(body).unwrap();
    } catch {
      setError("Nie udało się zmienić hasła. Sprawdź aktualne hasło i spróbuj ponownie.");
      return;
    }

    toast.success("Hasło zostało zmienione");
    navigate("/konto");
  };

  const inputType = showPasswords ? "text" : "password";

  const fieldError = (name: keyof IPasswordChangeFormValues) => form.isTouched(name) && Boolean(form.errors[name]);
  const fieldHelper = (name: keyof IPasswordChangeFormValues) => (form.isTouched(name) ? form.errors[name] : undefined);

  return (
    <Box sx={{ width: "100%", maxWidth: 720, mx: "auto", textAlign: "left" }}>
      <Stack direction="row" spacing={2} sx={{ alignItems: "center", mb: { xs: 3, md: 4 } }}>
        <Box
          aria-hidden
          sx={{
            display: "grid",
            placeItems: "center",
            width: { xs: 46, md: 54 },
            height: { xs: 46, md: 54 },
            flexShrink: 0,
            borderRadius: "50%",
            color: (t) => accentText(t),
            bgcolor: (t) => tone(t, 0.12),
            "& svg": { fontSize: { xs: 24, md: 28 } },
          }}>
          <LockResetRounded />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            component="h1"
            sx={{
              m: 0,
              fontSize: { xs: "1.7rem", md: "2.05rem" },
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
            }}>
            Zmiana hasła
          </Typography>
          <Typography sx={{ mt: 0.75, color: "text.secondary", maxWidth: "56ch", lineHeight: 1.6 }}>
            Ustaw nowe hasło do konta. Po zmianie pozostaniesz zalogowany na tym urządzeniu.
          </Typography>
        </Box>
      </Stack>

      <Box component="form" noValidate onSubmit={form.onSubmit(handleSubmit)} sx={{ maxWidth: 460 }}>
        <Stack direction="row" sx={{ justifyContent: "flex-end" }}>
          <Button
            type="button"
            size="small"
            aria-pressed={showPasswords}
            onClick={() => setShowPasswords((value) => !value)}
            startIcon={showPasswords ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
            sx={{
              color: "text.secondary",
              "&:hover": { color: (t) => accentText(t), bgcolor: "transparent" },
            }}>
            {showPasswords ? "Ukryj hasła" : "Pokaż hasła"}
          </Button>
        </Stack>

        <Stack spacing={2.5} sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" role="alert">
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            required
            variant="outlined"
            type={inputType}
            label="Aktualne hasło"
            {...form.getInputProps("oldPassword")}
            error={fieldError("oldPassword")}
            helperText={fieldHelper("oldPassword")}
            disabled={isLoading}
            slotProps={{ htmlInput: { autoComplete: "current-password" } }}
          />

          <TextField
            fullWidth
            required
            variant="outlined"
            type={inputType}
            label="Nowe hasło"
            {...form.getInputProps("password")}
            error={fieldError("password")}
            helperText={fieldHelper("password") ?? PASSWORD_HINT}
            disabled={isLoading}
            slotProps={{ htmlInput: { autoComplete: "new-password" } }}
          />

          <TextField
            fullWidth
            required
            variant="outlined"
            type={inputType}
            label="Potwierdź nowe hasło"
            {...form.getInputProps("passwordConfirmation")}
            error={fieldError("passwordConfirmation")}
            helperText={fieldHelper("passwordConfirmation")}
            disabled={isLoading}
            slotProps={{ htmlInput: { autoComplete: "new-password" } }}
          />

          <Button
            type="submit"
            disabled={(!isValid && form.isTouched()) || isLoading}
            sx={{ ...ctaButtonSx, alignSelf: "flex-start", minWidth: 220, mt: 1 }}>
            {isLoading ? "Zapisywanie…" : "Zmień hasło"}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

export default PasswordChange;
