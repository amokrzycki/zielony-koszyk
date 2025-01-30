import { useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  TextField,
} from "@mui/material";
import { validateEmail, validatePassword } from "@/helpers/validators.ts";
import { useLoginMutation } from "./accountsApiSlice.ts";
import { loginUser } from "./accountSlice.ts";
import { useAppDispatch } from "@/hooks/hooks.ts";
import toast from "react-hot-toast";
import Checkbox from "@mui/material/Checkbox";

export interface ILoginFormValues {
  email: string;
  password: string;
  rememberMe?: boolean;
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
      rememberMe: false,
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
      if (values.rememberMe) {
        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("rememberMe", "true");
      }
      navigate("/");
      toast.success("Zalogowano pomyślnie");
    } catch (err) {
      console.error(err);
      toast.error("Niepoprawne dane logowania");
    }
  };

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        handleSubmit(values);
      })}
    >
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
          control={<Checkbox {...form.getInputProps("rememberMe")} />}
          label={"Zapamiętaj mnie"}
        />
      </FormGroup>
      {/* TODO: forgot password */}
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
