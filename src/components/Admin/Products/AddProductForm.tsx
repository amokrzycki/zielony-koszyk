import { useForm } from "@mantine/form";
import { Categories } from "@/enums/Categories.ts";
import { Box, Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useCreateProductMutation } from "../../Products/productsApiSlice.ts";
import toast from "react-hot-toast";
import { type ChangeEvent, useState } from "react";
import UploadFileOutlined from "@mui/icons-material/UploadFileOutlined";
import { EASE, accentText, tone } from "@/components/listingStyles.ts";

interface IAddProductFormValues {
  name: string;
  description: string;
  price: number;
  category: Categories;
  stock_quantity: number;
}

interface AddProductFormProps {
  handleClose: () => void;
}

const grid = { display: "grid", gap: 2 } as const;

function AddProductForm({ handleClose }: AddProductFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [createProduct] = useCreateProductMutation();
  const validate = {
    name: (value: string) => (value.trim().length > 0 ? undefined : "Podaj nazwę produktu"),
    description: (value: string) => (value.trim().length > 0 ? undefined : "Podaj opis produktu"),
    stock_quantity: (value: number) => (value > 0 ? undefined : "Podaj ilość w magazynie"),
    price: (value: number) => (value > 0 ? undefined : "Podaj cenę"),
  };

  const form = useForm<IAddProductFormValues>({
    initialValues: {
      name: "",
      description: "",
      stock_quantity: 0,
      price: 0,
      category: Categories.FRUITS,
    },
    validate,
    validateInputOnBlur: true,
    clearInputErrorOnChange: true,
  });

  const isValid = form.isValid();

  const handleSubmit = async (values: IAddProductFormValues) => {
    toast
      .promise(
        createProduct({
          product: values,
          file: selectedFile,
        }).unwrap(),
        {
          loading: "Dodawanie produktu...",
          success: "Dodano produkt",
          error: "Błąd dodawania produktu",
        },
      )
      .then(() => {
        handleClose();
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
      <Box sx={grid}>
        <TextField
          {...form.getInputProps("name")}
          label="Nazwa produktu"
          variant="outlined"
          required
          fullWidth
          error={Boolean(form.errors.name) && form.isTouched("name")}
          helperText={form.errors.name}
        />
        <TextField
          {...form.getInputProps("description")}
          label="Opis produktu"
          variant="outlined"
          required
          fullWidth
          multiline
          minRows={3}
          error={Boolean(form.errors.description) && form.isTouched("description")}
          helperText={form.errors.description}
        />
        <Box sx={{ ...grid, gridTemplateColumns: "1fr 1fr" }}>
          <TextField
            {...form.getInputProps("stock_quantity")}
            label="Ilość w magazynie"
            type="number"
            variant="outlined"
            required
            fullWidth
            error={Boolean(form.errors.stock_quantity) && form.isTouched("stock_quantity")}
            helperText={form.errors.stock_quantity}
          />
          <TextField
            {...form.getInputProps("price")}
            label="Cena (zł)"
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
          <InputLabel id="category-label">Kategoria</InputLabel>
          <Select
            labelId="category-label"
            label="Kategoria"
            value={form.values.category}
            onChange={(event) => form.setFieldValue("category", event.target.value as Categories)}
            onBlur={() => form.setTouched}>
            <MenuItem value={Categories.FRUITS}>Owoce</MenuItem>
            <MenuItem value={Categories.VEGETABLES}>Warzywa</MenuItem>
            <MenuItem value={Categories.OTHERS}>Inne</MenuItem>
            <MenuItem value={Categories.COLLECTIVE}>Zbiorowe</MenuItem>
            <MenuItem value={Categories.SEASONAL}>Sezonowe</MenuItem>
          </Select>
          {Boolean(form.errors.category) && form.isTouched("category") && (
            <FormHelperText>{form.errors.category}</FormHelperText>
          )}
        </FormControl>

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
            {selectedFile ? selectedFile.name : "Wybierz zdjęcie (opcjonalnie)"}
          </Box>
          <Box component="input" type="file" accept="image/*" onChange={handleFileChange} sx={{ display: "none" }} />
        </Button>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, mt: 3.5 }}>
        <Button onClick={handleClose} variant="text" sx={{ borderRadius: "999px", fontWeight: 700 }}>
          Anuluj
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={!isValid && form.isTouched()}
          sx={{ borderRadius: "999px", fontWeight: 700 }}>
          Dodaj produkt
        </Button>
      </Box>
    </form>
  );
}

export default AddProductForm;
