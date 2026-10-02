import { useState } from "react";
import { Alert, Box, Button, Stack, TextField, Typography } from "@mui/material";
import AlternateEmailRounded from "@mui/icons-material/AlternateEmailRounded";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks.ts";
import type User from "../../types/User.ts";
import { useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { validateEmail } from "@/helpers/validators.ts";
import { useChangeEmailMutation, useLogoutMutation } from "./accountsApiSlice.ts";
import { logoutUser } from "./accountSlice.ts";
import toast from "react-hot-toast";
import { accentText, ctaButtonSx, tone } from "@/components/listingStyles.ts";

export interface IEmailChangeFormValues {
  newEmail: string;
}

const readoutLabelSx = {
  m: 0,
  color: "text.secondary",
  fontSize: "0.78rem",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
};

function EmailChange() {
  const dispatch = useAppDispatch();
  const user: User = useAppSelector((state) => state.auth.user);
  const [changeEmail, { isLoading }] = useChangeEmailMutation();
  const [endSession] = useLogoutMutation();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const currentEmail = user.email ?? "";

  const form = useForm<IEmailChangeFormValues>({
    initialValues: {
      newEmail: "",
    },
    validate: {
      newEmail: (value) => {
        if (value.trim().toLowerCase() === currentEmail.trim().toLowerCase()) {
          return "Nowy adres email musi się różnić od obecnego";
        }
        return validateEmail(value);
      },
    },
    validateInputOnBlur: true,
    clearInputErrorOnChange: true,
  });

  const isValid = form.isValid();

  const handleSubmit = async (values: IEmailChangeFormValues) => {
    setError("");

    try {
      await changeEmail({ user_id: user.user_id, email: values.newEmail.trim() }).unwrap();
    } catch {
      setError("Nie udało się zmienić adresu email. Sprawdź, czy nowy adres nie jest już używany.");
      return;
    }

    try {
      await endSession().unwrap();
      dispatch(logoutUser());
      navigate("/");
      toast.success("Adres email został zmieniony. Wylogowaliśmy Cię.");
    } catch {
      toast.success("Adres email został zmieniony");
      toast.error("Nie udało się wylogować. Wyloguj się ręcznie.");
    }
  };

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
          <AlternateEmailRounded />
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
            Zmiana adresu email
          </Typography>
          <Typography sx={{ mt: 0.75, color: "text.secondary", maxWidth: "56ch", lineHeight: 1.6 }}>
            Zmień adres przypisany do konta. Ze względów bezpieczeństwa wylogujemy Cię z tego urządzenia.
          </Typography>
        </Box>
      </Stack>

      <Box component="form" noValidate onSubmit={form.onSubmit(handleSubmit)} sx={{ maxWidth: 460 }}>
        <Box sx={{ p: 2, borderRadius: "16px", bgcolor: (t) => tone(t, 0.07) }}>
          <Typography sx={readoutLabelSx}>Obecny adres email</Typography>
          <Typography sx={{ mt: 0.5, fontWeight: 700, overflowWrap: "anywhere" }}>{currentEmail || "—"}</Typography>
        </Box>

        <Stack spacing={2} sx={{ mt: 3 }}>
          {error && (
            <Alert severity="error" role="alert">
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            required
            variant="outlined"
            type="email"
            label="Nowy adres email"
            placeholder="nowy@adres.pl"
            {...form.getInputProps("newEmail")}
            error={form.isTouched("newEmail") && Boolean(form.errors.newEmail)}
            helperText={form.isTouched("newEmail") ? form.errors.newEmail : undefined}
            disabled={isLoading}
            slotProps={{ htmlInput: { autoComplete: "email", inputMode: "email" } }}
          />

          <Button
            type="submit"
            disabled={(!isValid && form.isTouched()) || isLoading}
            sx={{ ...ctaButtonSx, alignSelf: "flex-start", minWidth: 220, mt: 1 }}>
            {isLoading ? "Zapisywanie…" : "Zmień adres email"}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

export default EmailChange;
