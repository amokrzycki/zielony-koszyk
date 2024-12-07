const validateEmail = (email: string) => {
  return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ? undefined
    : "Podaj prawidłowy adres email";
};

const validatePassword = (password: string) => {
  return password && password.length > 0 ? undefined : "Podaj prawidłowe hasło";
};

export const validateLogin = {
  email: validateEmail,
  password: validatePassword,
};
