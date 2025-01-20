import { IRegisterFormValues } from "../components/Accounts/RegisterForm.tsx";
import { IPasswordChangeFormValues } from "../components/Accounts/PasswordChange.tsx";

const validateEmail = (email: string) => {
  return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ? undefined
    : "Podaj prawidłowy adres email";
};

const validateFirstName = (value: string) => {
  return value.length > 2 ? undefined : "Podaj prawidłowe imię";
};

const validatePassword = (password: string) => {
  return password && password.length > 0 ? undefined : "Podaj prawidłowe hasło";
};

const validateNewPassword = (
  password: string,
  values: IPasswordChangeFormValues,
) => {
  if (password === values.oldPassword) {
    return "Nowe hasło musi się różnić od starego";
  }
  return password &&
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password)
    ? undefined
    : "Hasło musi mieć co najmniej 8 znaków, zawierać przynajmniej jedną cyfrę i jeden znak specjalny.";
};

const validateRegisterPassword = (password: string) => {
  return password &&
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password)
    ? undefined
    : "Hasło musi mieć co najmniej 8 znaków, zawierać przynajmniej jedną cyfrę i jeden znak specjalny.";
};

const validatePasswordConfirmation = (
  value: string,
  values: IRegisterFormValues | IPasswordChangeFormValues,
) => {
  return value === values.password ? undefined : "Hasła nie są takie same";
};

const validateTermsAccepted = (termsAccepted: boolean) => {
  return termsAccepted ? undefined : "Zaakceptuj regulamin";
};

const validateLastName = (value: string) => {
  return value.length > 2 ? undefined : "Podaj prawidłowe nazwisko";
};

const validateNumber = (value: string) => {
  return value && /^\+48[0-9]{9}$/.test(value)
    ? undefined
    : "Podaj prawidłowy numer telefonu";
};

const validateStreet = (value: string) => {
  return value.length > 3 ? undefined : "Podaj prawidłową nazwę ulicy";
};

const validateBuildingNumber = (value: string) => {
  return value.length > 0 ? undefined : "Podaj prawidłowy numer domu/lokalu";
};

const validateCity = (value: string) => {
  return value.length > 3 ? undefined : "Podaj prawidłową nazwę miasta";
};

const validateZip = (value: string) => {
  return value && /^[0-9]{2}-[0-9]{3}$/.test(value)
    ? undefined
    : "Podaj prawidłowy kod pocztowy";
};

const validateCompanyNip = (value: string) => {
  return value && /^[0-9]{10}$/.test(value)
    ? undefined
    : "Podaj prawidłowy numer NIP";
};

const validateCompany = (value: string) => {
  return value.length > 3 ? undefined : "Podaj prawidłową nazwę firmy";
};

export {
  validateEmail,
  validateFirstName,
  validateLastName,
  validateNumber,
  validatePassword,
  validateNewPassword,
  validateRegisterPassword,
  validatePasswordConfirmation,
  validateStreet,
  validateBuildingNumber,
  validateCity,
  validateZip,
  validateTermsAccepted,
  validateCompany,
  validateCompanyNip,
};
