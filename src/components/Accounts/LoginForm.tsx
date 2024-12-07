import { useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { validateLogin } from "./Login.ts";
import { Box, Button, TextField } from "@mui/material";

interface ILoginFormValues {
  email: string;
  password: string;
}

function LoginForm() {
  const navigate = useNavigate();

  const form = useForm<ILoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: validateLogin,
    validateInputOnBlur: true,
    clearInputErrorOnChange: true,
  });

  const isValid = form.isValid();

  const handleSubmit = (values: ILoginFormValues) => {
    console.log(values);
    navigate("/");
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
