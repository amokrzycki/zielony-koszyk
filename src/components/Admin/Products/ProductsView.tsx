import { Box, Button, Typography } from "@mui/material";
import {
  useDeleteProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
} from "../../Products/productsApiSlice.ts";
import Loading from "../../common/Loading.tsx";
import {
  DataGrid,
  GridColDef,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import Product from "../../../types/Product.ts";
import capitalizeFirstLetter from "../../../helpers/capitalizeFirstLetter.ts";
import { getFormattedDate } from "../../../helpers/getFormattedDate.ts";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import AddProductModal from "./AddProductModal.tsx";
import toast from "react-hot-toast";
import { Categories } from "../../../enums/Categories.ts";
import ConfirmDeleteModal from "../ConfirmDeleteModal.tsx";
import Error from "../../common/Error.tsx";

interface Row {
  id: number;
  name: string;
  category: string;
  price: number;
  stock_quantity: number;
  created_at: string;
  description: string;
}

function ProductsView() {
  const { data: products, isError, isLoading } = useGetProductsQuery();
  const [openProductModal, setOpenProductModal] = useState(false);
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [deleteProduct] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  const handleProductModalOpen = () => setOpenProductModal(true);
  const handleProductModalClose = () => setOpenProductModal(false);
  const handleConfirmDeleteModalOpen = () => setOpenConfirmDeleteModal(true);
  const handleConfirmDeleteModalClose = () => setOpenConfirmDeleteModal(false);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error message={"Wystąpił błąd podczas pobierania produktów."} />;
  }

  const onDelete = async () => {
    if (selectedRows.length === 0) {
      toast.error("Nie wybrano produktów do usunięcia.");
      return;
    }

    try {
      await toast.promise(
        Promise.all(selectedRows.map((id) => deleteProduct(id).unwrap())),
        {
          loading: `Usuwanie ${selectedRows.length >= 1 ? "produktu" : "produktów"}...`,
          success: `${selectedRows.length >= 1 ? "Produkt został usunięty." : "Produkty zostały ususnięte."}`,
          error: `Wystąpił błąd podczas usuwania ${selectedRows.length >= 1 ? "produktu" : "produktów"}.`,
        },
      );
      setSelectedRows([]);
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Nie udało się usunąć.");
    }
  };

  const handleProcessRowUpdate = async (updatedRow: Row, oldRow: Row) => {
    if (
      oldRow.name === updatedRow.name &&
      oldRow.category === updatedRow.category &&
      oldRow.price === updatedRow.price &&
      oldRow.stock_quantity === updatedRow.stock_quantity &&
      oldRow.description === updatedRow.description
    ) {
      return oldRow;
    }

    try {
      const updatedProduct: Partial<Product> = {
        product_id: updatedRow.id,
        name: updatedRow.name,
        category: updatedRow.category as Categories,
        price: updatedRow.price,
        stock_quantity: updatedRow.stock_quantity,
        description: updatedRow.description,
      };

      await toast.promise(
        updateProduct({ id: updatedRow.id, product: updatedProduct }).unwrap(),
        {
          loading: "Aktualizowanie produktu...",
          success: "Produkt został zaktualizowany.",
          error: "Wystąpił błąd podczas aktualizacji produktu.",
        },
      );

      return updatedRow;
    } catch (error) {
      toast.error("Nie udało się zaktualizować produktu.");
      throw error;
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Nazwa", width: 200, editable: true },
    { field: "category", headerName: "Kategoria", width: 150, editable: true },
    {
      field: "price",
      headerName: "Cena",
      width: 120,
      editable: true,
      sortComparator: (v1, v2) => v1 - v2,
    },
    { field: "stock_quantity", headerName: "Stan", width: 100, editable: true },
    { field: "created_at", headerName: "Data dodania", width: 150 },
    { field: "description", headerName: "Opis", width: 350, editable: true },
  ];

  const rows = products?.map((product: Product) => ({
    id: product.product_id,
    name: product.name,
    category: capitalizeFirstLetter(product.category),
    price: product.price,
    stock_quantity: product.stock_quantity,
    created_at: getFormattedDate(product.created_at.toString()),
    description: product.description,
  }));

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer className={"flex justify-between"}>
        <GridToolbarColumnsButton />
        <Button startIcon={<AddIcon />} onClick={handleProductModalOpen}>
          Dodaj produkt
        </Button>
        {selectedRows.length > 0 && (
          <Button color="error" onClick={handleConfirmDeleteModalOpen}>
            Usuń zaznaczone ({selectedRows.length})
          </Button>
        )}
        <GridToolbarQuickFilter debounceMs={300} />
      </GridToolbarContainer>
    );
  };

  return (
    <Box className={"flex flex-col overflow-x-auto w-full"}>
      <Typography variant="h4" component="h1" gutterBottom>
        Produkty
      </Typography>
      {/* Products table */}
      <Box className={"w-full overflow-x-auto"}>
        <DataGrid
          disableRowSelectionOnClick
          checkboxSelection
          columns={columns}
          rows={rows}
          rowHeight={40}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          sx={{ border: 0 }}
          slots={{ toolbar: CustomToolbar }}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          processRowUpdate={handleProcessRowUpdate}
          onRowSelectionModelChange={(newSelection) =>
            setSelectedRows(newSelection as number[])
          }
        />
      </Box>
      <AddProductModal
        open={openProductModal}
        handleClose={handleProductModalClose}
      />
      <ConfirmDeleteModal
        open={openConfirmDeleteModal}
        handleClose={handleConfirmDeleteModalClose}
        onConfirm={onDelete}
        count={selectedRows.length}
      />
    </Box>
  );
}

export default ProductsView;
