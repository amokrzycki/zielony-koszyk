import { useForm } from "@mantine/form";
import { Categories } from "@/enums/Categories.ts";
import { Box, Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useCreateProductMutation, useUpdateProductMutation } from "../../Products/productsApiSlice.ts";
import toast from "react-hot-toast";
import { type ChangeEvent, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import UploadFileOutlined from "@mui/icons-material/UploadFileOutlined";
import { EASE, accentText, tone } from "@/components/listingStyles.ts";
import { adminSubheadingSx } from "../adminStyles.ts";
import { useApiError } from "../useAdminI18n.ts";
import { LOCALE_NAMES, LOCALES } from "@/i18n/locale.ts";
import type { ProductTranslations } from "@/types/ProductTranslations.ts";

interface IProductFormValues {
  price: number;
  category: Categories;
  stock_quantity: number;
  translations: ProductTranslations;
}

/** Present in edit mode: the form is prefilled from it and saves through `updateProduct`. */
export interface EditableProduct {
  id: number;
  price: number;
  category: Categories;
  stock_quantity: number;
  translations: ProductTranslations;
}

interface AddProductFormProps {
  handleClose: () => void;
  product?: EditableProduct;
}

const grid = { display: "grid", gap: 2 } as const;

const required = (key: "name" | "description") => (value: string) =>
  value.trim().length > 0 ? undefined : <Trans i18nKey={`products.form.errors.${key}`} ns="admin" />;

const localizedRules = { name: required("name"), description: required("description") };

const positive = (key: "stock" | "price") => (value: number) =>
  value > 0 ? undefined : <Trans i18nKey={`products.form.errors.${key}`} ns="admin" />;

function AddProductForm({ handleClose, product }: AddProductFormProps) {
  const { t } = useTranslation("admin");
  const apiError = useApiError();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const isEdit = Boolean(product);

  const form = useForm<IProductFormValues>({
    initialValues: {
      price: product?.price ?? 0,
      category: product?.category ?? Categories.FRUITS,
      stock_quantity: product?.stock_quantity ?? 0,
      translations: product?.translations ?? {
        pl: { name: "", description: "" },
        en: { name: "", description: "" },
      },
    },
    validate: {
      stock_quantity: (value) =>
        String(value).trim() !== "" && Number.isInteger(Number(value)) && Number(value) >= 0 ? undefined : (
          <Trans i18nKey="products.form.errors.stock" ns="admin" />
        ),
      price: positive("price"),
      translations: { pl: localizedRules, en: localizedRules },
    },
    validateInputOnBlur: true,
    clearInputErrorOnChange: true,
  });

  const isValid = form.isValid();

  const handleSubmit = (values: IProductFormValues) => {
    const body = {
      price: Number(values.price),
      category: values.category,
      stock_quantity: Number(values.stock_quantity),
      translations: values.translations,
    };
    const request = product
      ? updateProduct({ id: product.id, product: body }).unwrap()
      : createProduct({ product: body, file: selectedFile }).unwrap();
    const text = isEdit
      ? {
          loading: t("products.update.loading"),
          success: t("products.update.success"),
          fallback: t("products.update.error"),
        }
      : {
          loading: t("products.create.loading"),
          success: t("products.create.success"),
          fallback: t("products.create.error"),
        };

    toast
      .promise(request, {
        loading: text.loading,
        success: text.success,
        error: (error) => apiError(error, text.fallback),
      })
      .then(() => {
        handleClose();
      })
      .catch(() => {
        /* surfaced by the toast; the form stays open for another try */
      });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        handleSubmit(values);
      })}>
      <Box sx={{ display: "grid", gap: 3 }}>
        <Box component="fieldset" sx={{ ...grid, m: 0, p: 0, border: 0, minWidth: 0 }}>
          <Box component="legend" sx={{ ...adminSubheadingSx, mb: 1.5, p: 0 }}>
            {t("products.form.sharedSection")}
          </Box>
          <Box sx={{ ...grid, gridTemplateColumns: "1fr 1fr" }}>
            <TextField
              {...form.getInputProps("stock_quantity")}
              label={t("products.form.stock")}
              type="number"
              variant="outlined"
              required
              fullWidth
              error={Boolean(form.errors.stock_quantity) && form.isTouched("stock_quantity")}
              helperText={form.errors.stock_quantity}
            />
            <TextField
              {...form.getInputProps("price")}
              label={t("products.form.price")}
              type="number"
              variant="outlined"
              required
              fullWidth
              error={Boolean(form.errors.price) && form.isTouched("price")}
              helperText={form.errors.price}
            />
          </Box>
          <FormControl
            variant="outlined"
            fullWidth
            required
            error={Boolean(form.errors.category) && form.isTouched("category")}>
            <InputLabel id="category-label">{t("products.form.category")}</InputLabel>
            <Select
              labelId="category-label"
              label={t("products.form.category")}
              value={form.values.category}
              onChange={(event) => form.setFieldValue("category", event.target.value as Categories)}>
              {Object.values(Categories).map((category) => (
                <MenuItem key={category} value={category}>
                  {t(`categories.${category}`, { ns: "common" })}
                </MenuItem>
              ))}
            </Select>
            {Boolean(form.errors.category) && form.isTouched("category") && (
              <FormHelperText>{form.errors.category}</FormHelperText>
            )}
          </FormControl>

          {!isEdit && (
            <Button
              component="label"
              variant="outlined"
              startIcon={<UploadFileOutlined />}
              sx={(theme) => ({
                justifyContent: "flex-start",
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: "16px",
                px: 2,
                py: 1.5,
                fontWeight: 700,
                color: "text.primary",
                textTransform: "none",
                transition: `border-color 200ms ${EASE}, background-color 200ms ${EASE}`,
                "&:hover": { borderColor: accentText(theme), bgcolor: tone(theme, 0.06) },
              })}>
              <Box component="span" sx={{ ml: 1 }}>
                {selectedFile ? selectedFile.name : t("products.form.image")}
              </Box>
              <Box
                component="input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                sx={{ display: "none" }}
              />
            </Button>
          )}
        </Box>

        {LOCALES.map((locale) => {
          const language = LOCALE_NAMES[locale];
          const name = `translations.${locale}.name` as const;
          const description = `translations.${locale}.description` as const;
          return (
            <Box key={locale} component="fieldset" lang={locale} sx={{ ...grid, m: 0, p: 0, border: 0, minWidth: 0 }}>
              <Box component="legend" sx={{ ...adminSubheadingSx, mb: 1.5, p: 0 }}>
                {language}
              </Box>
              <TextField
                {...form.getInputProps(name)}
                label={t("products.form.name", { language })}
                variant="outlined"
                required
                fullWidth
                error={Boolean(form.errors[name]) && form.isTouched(name)}
                helperText={form.errors[name]}
              />
              <TextField
                {...form.getInputProps(description)}
                label={t("products.form.description", { language })}
                variant="outlined"
                required
                fullWidth
                multiline
                minRows={3}
                error={Boolean(form.errors[description]) && form.isTouched(description)}
                helperText={form.errors[description]}
              />
            </Box>
          );
        })}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, mt: 3.5 }}>
        <Button onClick={handleClose} variant="text" sx={{ borderRadius: "999px", fontWeight: 700 }}>
          {t("actions.cancel", { ns: "common" })}
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={!isValid && form.isTouched()}
          sx={{ borderRadius: "999px", fontWeight: 700 }}>
          {isEdit ? t("products.edit.submit") : t("products.create.submit")}
        </Button>
      </Box>
    </form>
  );
}

export default AddProductForm;
