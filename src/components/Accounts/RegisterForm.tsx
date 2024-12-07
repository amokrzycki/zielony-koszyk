import { useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { validateRegister } from "./Register.ts";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  TextField,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";

export interface IRegisterFormValues {
  email: string;
  password: string;
  passwordConfirmation: string;
  termsAccepted: boolean;
}

function RegisterForm() {
  const navigate = useNavigate();

  const form = useForm<IRegisterFormValues>({
    initialValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
      termsAccepted: false,
    },
    validate: validateRegister,
    validateInputOnBlur: true,
    clearInputErrorOnChange: true,
  });

  const isValid = form.isValid();

  const handleSubmit = (values: IRegisterFormValues) => {
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
        <TextField
          variant={"outlined"}
          label={"Potwierdź hasło"}
          type={"password"}
          {...form.getInputProps("passwordConfirmation")}
          error={
            Boolean(form.errors.passwordConfirmation) &&
            form.isTouched("passwordConfirmation")
          }
          helperText={form.errors.passwordConfirmation}
          sx={{ m: "1em 0", width: "300px" }}
        />
        <FormControl
          required
          error={
            Boolean(form.errors.termsAccepted) &&
            form.isTouched("termsAccepted")
          }
          component="fieldset"
          variant={"standard"}
        >
          <FormGroup>
            <FormControlLabel
              control={<Checkbox {...form.getInputProps("termsAccepted")} />}
              label={"Akceptuję regulamin"}
            />
          </FormGroup>
          <FormHelperText sx={{ m: 0 }}>
            {form.errors.termsAccepted}
          </FormHelperText>
        </FormControl>
        {/* TODO: newsletter? */}
        <Button
          type={"submit"}
          variant={"contained"}
          sx={{ mt: "1em" }}
          disabled={!isValid && form.isTouched()}
        >
          Utwórz konto
        </Button>
      </Box>
    </form>
  );
}

export default RegisterForm;
