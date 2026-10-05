import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiErrorMessage } from "@/helpers/apiError.ts";
import { useLocalePath } from "@/i18n/useLocale.ts";
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
import { ctaButtonSx, ghostButtonSx } from "@/components/listingStyles.ts";

export interface ILoginFormValues {
  email: string;
  password: string;
  rememberMe?: boolean;
}

function LoginForm() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("account");
  const to = useLocalePath();
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
    navigate(to("home"));
    toast.success(t("login.success"));
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
    } catch (error) {
      toast.error(apiErrorMessage(i18n.t, error, t("login.failed")));
    }
  };

  if (pendingMfa) {
    if (pendingMfa.response.method === MfaMethod.EMAIL_OTP || pendingMfa.response.method === MfaMethod.TOTP) {
      const isEmailOtp = pendingMfa.response.method === MfaMethod.EMAIL_OTP;
      return (
        <MfaCodeForm
          instruction={isEmailOtp ? t("mfaCode.instructionEmail") : t("mfaCode.instructionTotp")}
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
        <Typography>{t("login.mfaRequired", { method: pendingMfa.response.method })}</Typography>
        <Button onClick={() => setPendingMfa(null)} sx={(theme) => ghostButtonSx(theme)}>
          {t("login.backToLogin")}
        </Button>
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
          label={t("login.email")}
          {...form.getInputProps("email")}
          error={Boolean(form.errors.email) && form.isTouched("email")}
          helperText={form.errors.email}
          sx={{ m: "1em 0", width: "300px" }}
        />
        <TextField
          variant={"outlined"}
          label={t("login.password")}
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
          label={t("login.rememberMe")}
        />
      </FormGroup>
      {/* TODO: forgot password */}
      <Button
        type={"submit"}
        disabled={!isValid && form.isTouched()}
        variant={"contained"}
        sx={{ ...ctaButtonSx, mt: "1.5em", minWidth: 200 }}>
        {t("login.submit")}
      </Button>
    </form>
  );
}

export default LoginForm;
