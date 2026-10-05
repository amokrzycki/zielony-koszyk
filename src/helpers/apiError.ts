import type { TFunction } from "i18next";

/** Stable machine codes sent by the backend in `error.data.code`; keep in sync with its `ErrorCode` enum. */
export const API_ERROR_CODES = [
  "PRODUCT_NOT_FOUND",
  "PRODUCT_DATA_REQUIRED",
  "FILE_REQUIRED",
  "INVALID_CREDENTIALS",
  "EMAIL_ALREADY_EXISTS",
  "USER_NOT_FOUND",
  "OLD_PASSWORD_INCORRECT",
  "ORDER_NOT_FOUND",
  "ORDER_ITEM_NOT_FOUND",
  "INVOICE_NOT_FOUND",
  "INVOICE_FORBIDDEN",
  "INSUFFICIENT_STOCK",
] as const;

export type ApiErrorCode = (typeof API_ERROR_CODES)[number];

const isApiErrorCode = (value: unknown): value is ApiErrorCode => API_ERROR_CODES.includes(value as ApiErrorCode);

/** Reads the machine code off an RTK Query error; never inspects the (English) message text. */
export const getApiErrorCode = (error: unknown): ApiErrorCode | undefined => {
  const data = (error as { data?: { code?: unknown } } | null | undefined)?.data;
  return isApiErrorCode(data?.code) ? data.code : undefined;
};

/** Localized text for an API failure: the specific code when we know it, else `fallback`, else the generic message. */
export const apiErrorMessage = (t: TFunction, error: unknown, fallback?: string): string => {
  const code = getApiErrorCode(error);
  return code ? t(`errors.${code}`, { ns: "common" }) : (fallback ?? t("errors.generic", { ns: "common" }));
};
