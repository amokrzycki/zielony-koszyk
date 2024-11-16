const validateFirstName = (value: string) => {
  return value.length > 2 ? undefined : "Podaj prawidłowe imię";
};

const validateLastName = (value: string) => {
  return value.length > 2 ? undefined : "Podaj prawidłowe nazwisko";
};

const validateEmail = (value: string) => {
  return value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ? undefined
    : "Podaj prawidłowy adres email";
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

export const validate = {
  firstName: validateFirstName,
  lastName: validateLastName,
  email: validateEmail,
  number: validateNumber,
  street: validateStreet,
  buildingNumber: validateBuildingNumber,
  city: validateCity,
  zip: validateZip,
};
