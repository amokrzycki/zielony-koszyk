import { createElement, type ReactNode } from "react";
import { Trans } from "react-i18next";
import type { IRegisterFormValues } from "../components/Accounts/RegisterForm.tsx";
import type { IPasswordChangeFormValues } from "../components/Accounts/PasswordChange.tsx";
import type { resources } from "@/i18n/resources.ts";

type ValidationKey = keyof (typeof resources)["pl"]["common"]["validation"];

/**
 * Validators return a `<Trans>` node rather than a string, so an error that is already on screen
 * re-translates if the language changes. Mantine form errors and MUI helper text both accept nodes.
 */
const message = (key: ValidationKey): ReactNode => createElement(Trans, { i18nKey: `validation.${key}`, ns: "common" });

const PASSWORD_RULE = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

const validateEmail = (email: string) => {
  return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? undefined : message("email");
};

const validateFirstName = (value: string) => {
  return value.length > 2 ? undefined : message("firstName");
};

const validatePassword = (password: string) => {
  return password && password.length > 0 ? undefined : message("password");
};

const validateNewPassword = (password: string, values: IPasswordChangeFormValues) => {
  if (password === values.oldPassword) {
    return message("newPasswordSame");
  }
  return password && PASSWORD_RULE.test(password) ? undefined : message("passwordRules");
};

const validateRegisterPassword = (password: string) => {
  return password && PASSWORD_RULE.test(password) ? undefined : message("passwordRules");
};

const validatePasswordConfirmation = (value: string, values: IRegisterFormValues | IPasswordChangeFormValues) => {
  return value === values.password ? undefined : message("passwordMismatch");
};

const validateTermsAccepted = (termsAccepted: boolean) => {
  return termsAccepted ? undefined : message("terms");
};

const validateLastName = (value: string) => {
  return value.length > 2 ? undefined : message("lastName");
};

const validateNumber = (value: string) => {
  return value && /^\+48[0-9]{9}$/.test(value) ? undefined : message("phone");
};

const validateStreet = (value: string) => {
  return value.length > 3 ? undefined : message("street");
};

const validateBuildingNumber = (value: string) => {
  return value.length > 0 ? undefined : message("buildingNumber");
};

const validateCity = (value: string) => {
  return value.length > 3 ? undefined : message("city");
};

const validateZip = (value: string) => {
  return value && /^[0-9]{2}-[0-9]{3}$/.test(value) ? undefined : message("zip");
};

const validateCompanyNip = (value: string) => {
  return value && /^[0-9]{10}$/.test(value) ? undefined : message("nip");
};

const validateCompany = (value: string) => {
  return value.length > 3 ? undefined : message("company");
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
