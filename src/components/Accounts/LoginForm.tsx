import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { Box, Button, FormControlLabel, FormGroup, TextField, Typography } from "@mui/material";
import { validateEmail, validatePassword } from "@/helpers/validators.ts";
import {
  type FullAuthResponse,
  type PendingAuthResponse,
  useLoginMutation,
  useVerifyEmailOtpMutation,
  useVerifyTotpMutation,
  useVerifyWebAuthnLoginMutation,
} from "./accountsApiSlice.ts";
import { loginUser, logoutUser } from "./accountSlice.ts";
import { useAppDispatch } from "@/hooks/hooks.ts";
import toast from "react-hot-toast";
import Checkbox from "@mui/material/Checkbox";
import { rememberSession } from "@/helpers/tokenHelpers.ts";
import MfaCodeForm from "./MfaCodeForm.tsx";
import MfaWebAuthnStep from "./MfaWebAuthnStep.tsx";
import { MfaMethod } from "@/enums/MfaMethod.ts";

export interface ILoginFormValues {
  email: string;
  password: string;
  rememberMe?: boolean;
}

function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login] = useLoginMutation();
  const [verifyEmailOtp] = useVerifyEmailOtpMutation();
  const [verifyTotp] = useVerifyTotpMutation();
  const [verifyWebAuthnLogin] = useVerifyWebAuthnLoginMutation();
  const [pendingMfa, setPendingMfa] = useState<{
    response: PendingAuthResponse;
    rememberMe: boolean;
  } | null>(null);

  const validate = {
    email: validateEmail,
    password: validatePassword,
  };

  const form = useForm<ILoginFormValues>({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validate,
    validateInputOnBlur: true,
    clearInputErrorOnChange: true,
  });

  const isValid = form.isValid();

  const completeLogin = (result: FullAuthResponse, rememberMe: boolean) => {
    dispatch(loginUser({ accessToken: result.access_token, user: result.user }));
    rememberSession(rememberMe);
    navigate("/");
    toast.success("Zalogowano pomyślnie");
  };

  const handleSubmit = async (values: ILoginFormValues) => {
    try {
      const result = await login(values).unwrap();
      if (result.mfa_required) {
        dispatch(logoutUser());
        form.reset();
        setPendingMfa({ response: result, rememberMe: Boolean(values.rememberMe) });
        return;
      }

      completeLogin(result, Boolean(values.rememberMe));
    } catch {
      toast.error("Nie udało się zalogować");
    }
  };

  if (pendingMfa) {
    if (pendingMfa.response.method === MfaMethod.EMAIL_OTP || pendingMfa.response.method === MfaMethod.TOTP) {
      const isEmailOtp = pendingMfa.response.method === MfaMethod.EMAIL_OTP;
      return (
        <MfaCodeForm
          instruction={
            isEmailOtp
              ? "Wpisz sześciocyfrowy kod wysłany e-mailem."
              : "Wpisz sześciocyfrowy kod z aplikacji uwierzytelniającej."
          }
          onCancel={() => setPendingMfa(null)}
          onSubmit={async (code) => {
            const request = {
              code,
              mfaToken: pendingMfa.response.mfa_token,
            };
            const result = await (isEmailOtp ? verifyEmailOtp(request) : verifyTotp(request)).unwrap();
            completeLogin(result, pendingMfa.rememberMe);
          }}
        />
      );
    }

    if (pendingMfa.response.method === MfaMethod.WEBAUTHN && pendingMfa.response.webauthn_options) {
      const options = pendingMfa.response.webauthn_options;
      return (
        <MfaWebAuthnStep
          options={options}
          onCancel={() => setPendingMfa(null)}
          onSubmit={async (response) => {
            const result = await verifyWebAuthnLogin({
              response,
              mfaToken: pendingMfa.response.mfa_token,
            }).unwrap();
            completeLogin(result, pendingMfa.rememberMe);
          }}
        />
      );
    }

    return (
      <Box className={"flex flex-col items-center gap-4"}>
        <Typography>Wymagane dodatkowe uwierzytelnienie: {pendingMfa.response.method}</Typography>
        <Button onClick={() => setPendingMfa(null)}>Wróć do logowania</Button>
      </Box>
    );
  }

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        handleSubmit(values);
      })}>
      <Box className={"flex flex-col items-center justify-center"}>
        <TextField
          variant={"outlined"}
          label={"Email"}
          {...form.getInputProps("email")}
          error={Boolean(form.errors.email) && form.isTouched("email")}
          helperText={form.errors.email}
          sx={{ m: "1em 0", width: "300px" }}
        />
        <TextField
          variant={"outlined"}
          label={"Hasło"}
          type={"password"}
          {...form.getInputProps("password")}
          error={Boolean(form.errors.password) && form.isTouched("password")}
          helperText={form.errors.password}
          sx={{ width: "300px" }}
        />
      </Box>
      <FormGroup sx={{ mt: 1 }} className={"items-center"}>
        <FormControlLabel
          control={<Checkbox {...form.getInputProps("rememberMe", { type: "checkbox" })} />}
          label={"Zapamiętaj mnie"}
        />
      </FormGroup>
      {/* TODO: forgot password */}
      <Button type={"submit"} disabled={!isValid && form.isTouched()} variant={"contained"} sx={{ mt: "1em" }}>
        Zaloguj się
      </Button>
    </form>
  );
}

export default LoginForm;
