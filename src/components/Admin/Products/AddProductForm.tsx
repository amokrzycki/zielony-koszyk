import { useForm } from "@mantine/form";
import { Categories } from "@/enums/Categories.ts";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useCreateProductMutation } from "../../Products/productsApiSlice.ts";
import toast from "react-hot-toast";
import { ChangeEvent, useState } from "react";

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

function AddProductForm({ handleClose }: AddProductFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [createProduct] = useCreateProductMutation();
  const validate = {
    name: (value: string) =>
      value.trim().length > 0 ? undefined : "Podaj nazwę produktu",
    description: (value: string) =>
      value.trim().length > 0 ? undefined : "Podaj opis produktu",
    stock_quantity: (value: number) =>
      value > 0 ? undefined : "Podaj ilość w magazynie",
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
      })}
    >
      <TextField
        {...form.getInputProps("name")}
        label="Nazwa produktu"
        variant="outlined"
        required
        fullWidth
        error={Boolean(form.errors.name) && form.isTouched("name")}
        helperText={form.errors.name}
        sx={{ mb: "1em" }}
      />
      <TextField
        {...form.getInputProps("description")}
        label="Opis produktu"
        variant="outlined"
        required
        fullWidth
        error={
          Boolean(form.errors.description) && form.isTouched("description")
        }
        helperText={form.errors.description}
        sx={{ mb: "1em" }}
      />
      <TextField
        {...form.getInputProps("stock_quantity")}
        label="Ilość w magazynie"
        variant="outlined"
        required
        fullWidth
        error={
          Boolean(form.errors.stock_quantity) &&
          form.isTouched("stock_quantity")
        }
        helperText={form.errors.stock_quantity}
        sx={{ mb: "1em" }}
      />
      <TextField
        {...form.getInputProps("price")}
        label="Cena"
        variant="outlined"
        required
        fullWidth
        error={Boolean(form.errors.price) && form.isTouched("price")}
        helperText={form.errors.price}
      />
      <FormControl
        variant="outlined"
        margin="normal"
        fullWidth
        required
        error={Boolean(form.errors.category) && form.isTouched("category")}
      >
        <InputLabel id="category-label">Kategoria</InputLabel>
        <Select
          labelId="category-label"
          label="Kategoria"
          value={form.values.category}
          onChange={(event) =>
            form.setFieldValue("category", event.target.value as Categories)
          }
          onBlur={() => form.setTouched}
        >
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
      <input
        type="file"
        onChange={handleFileChange}
        style={{ margin: "1em 0" }}
      />
      <Box className={"flex w-full justify-center"}>
        <Button
          type="submit"
          variant="outlined"
          color="primary"
          disabled={!isValid && form.isTouched()}
          sx={{ mt: "1em" }}
        >
          Dodaj produkt
        </Button>
      </Box>
    </form>
  );
}

export default AddProductForm;
