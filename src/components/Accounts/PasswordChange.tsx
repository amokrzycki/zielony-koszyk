import {
  validateNewPassword,
  validatePassword,
  validatePasswordConfirmation,
} from "../../utils/validators.ts";
import { useForm } from "@mantine/form";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useChangePasswordMutation } from "./accountsApiSlice.ts";
import User from "../../types/User.ts";
import { useAppSelector } from "../../hooks/hooks.ts";
import { UpdatePasswordBody } from "../../types/UpdatePasswordBody.ts";
import { useNavigate } from "react-router-dom";

export interface IPasswordChangeFormValues {
  oldPassword: string;
  password: string;
  passwordConfirmation: string;
}

function PasswordChange() {
  const user: User = useAppSelector((state) => state.auth.user);
  const [updatePassword, { isLoading }] = useChangePasswordMutation();
  const navigate = useNavigate();

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

  const handleSubmit = (values: IPasswordChangeFormValues) => {
    const body: UpdatePasswordBody = {
      user_id: user.user_id,
      password: values.oldPassword,
      new_password: values.password,
    };
    updatePassword(body)
      .then(() => {
        console.log("Password changed");
      })
      .catch((error) => {
        console.error(error);
      });
    navigate("/konto");
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
      <Box className={"flex flex-col justify-center items-center"}>
        <Typography variant={"h4"}>Zmiana hasła</Typography>
        <TextField
          variant={"outlined"}
          label={"Wpisz aktualne hasło"}
          type={"password"}
          {...form.getInputProps("oldPassword")}
          error={
            Boolean(form.errors.oldPassword) && form.isTouched("oldPassword")
          }
          helperText={form.errors.oldPassword}
          sx={{ mt: "1em", width: "300px" }}
        />
        <TextField
          variant={"outlined"}
          label={"Wpisz nowe hasło"}
          type={"password"}
          {...form.getInputProps("password")}
          error={Boolean(form.errors.password) && form.isTouched("password")}
          helperText={form.errors.password}
          sx={{ mt: "1em", width: "300px" }}
        />
        <TextField
          variant={"outlined"}
          label={"Potwierdź nowe hasło"}
          type={"password"}
          {...form.getInputProps("passwordConfirmation")}
          error={
            Boolean(form.errors.passwordConfirmation) &&
            form.isTouched("passwordConfirmation")
          }
          helperText={form.errors.passwordConfirmation}
          sx={{ m: "1em 0", width: "300px" }}
        />
        <Button
          type={"submit"}
          variant={"contained"}
          sx={{ mt: "1em" }}
          disabled={!isValid && form.isTouched()}
        >
          Zmień hasło
        </Button>
      </Box>
    </form>
  );
}

export default PasswordChange;
