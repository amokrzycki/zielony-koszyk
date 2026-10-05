import { enUS, plPL } from "@mui/x-data-grid/locales";
import { useTranslation } from "react-i18next";
import type { Categories } from "@/enums/Categories.ts";
import type { OrderStatuses } from "@/enums/OrderStatuses.ts";
import { apiErrorMessage } from "@/helpers/apiError.ts";
import { useLocale } from "@/i18n/useLocale.ts";

const GRID_LOCALE_TEXT = {
  pl: plPL.components.MuiDataGrid.defaultProps.localeText,
  en: enUS.components.MuiDataGrid.defaultProps.localeText,
};

/** DataGrid's own strings (pagination, filters, toolbar) in the active locale: `<DataGrid localeText={...} />`. */
export const useGridLocaleText = () => GRID_LOCALE_TEXT[useLocale()];

/** Labels for backend identifiers (order status, product category); the identifier stays the value. */
export const useIdentifierLabels = () => {
  const { t } = useTranslation("common");
  return {
    status: (status: string) => t(`orderStatus.${status as OrderStatuses}`),
    category: (category: string) => t(`categories.${category as Categories}`),
  };
};

/** `apiErrorMessage` bound to the active language, for `toast.promise({ error })`: known API code, else `fallback`. */
export const useApiError = () => {
  const { t } = useTranslation("common");
  return (error: unknown, fallback?: string) => apiErrorMessage(t, error, fallback);
};
