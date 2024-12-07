import { useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { Box, Button, TextField } from "@mui/material";
import { validateEmail, validatePassword } from "../../utils/validators.ts";
import { useLoginMutation } from "./accountsApiSlice.ts";
import { loginUser } from "./accountSlice.ts";
import { useAppDispatch } from "../../hooks/hooks.ts";

export interface ILoginFormValues {
  email: string;
  password: string;
}

function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login] = useLoginMutation();

  const validate = {
    email: validateEmail,
    password: validatePassword,
  };

  const form = useForm<ILoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validate,
    validateInputOnBlur: true,
    clearInputErrorOnChange: true,
  });

  const isValid = form.isValid();

  const handleSubmit = async (values: ILoginFormValues) => {
    try {
      const result = await login(values).unwrap();
      const { access_token } = result;
      dispatch(loginUser({ accessToken: access_token, user: result.user }));
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        handleSubmit(values);
      })}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
      <Button
        type={"submit"}
        disabled={!isValid && form.isTouched()}
        variant={"contained"}
        sx={{ mt: "1em" }}
      >
        Zaloguj się
      </Button>
    </form>
  );
}

export default LoginForm;
