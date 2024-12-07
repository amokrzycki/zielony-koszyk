import { IRegisterFormValues } from "./RegisterForm.tsx";

const validateEmail = (email: string) => {
  return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ? undefined
    : "Podaj prawidłowy adres email";
};

const validatePassword = (password: string) => {
  return password &&
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password)
    ? undefined
    : "Hasło musi mieć co najmniej 8 znaków, zawierać przynajmniej jedną cyfrę i jeden znak specjalny.";
};

const validatePasswordConfirmation = (
  value: string,
  values: IRegisterFormValues,
) => {
  return value === values.password ? undefined : "Hasła nie są takie same";
};

const validateTermsAccepted = (termsAccepted: boolean) => {
  return termsAccepted ? undefined : "Zaakceptuj regulamin";
};

export const validateRegister = {
  email: validateEmail,
  password: validatePassword,
  passwordConfirmation: validatePasswordConfirmation,
  termsAccepted: validateTermsAccepted,
};
