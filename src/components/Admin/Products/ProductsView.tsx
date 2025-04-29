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
  GridRowSelectionModel,
  GridToolbarColumnsButton,
  GridToolbarQuickFilter,
  Toolbar,
} from "@mui/x-data-grid";
import Product from "../../../types/Product.ts";
import capitalizeFirstLetter from "../../../helpers/capitalizeFirstLetter.ts";
import { getFormattedDate } from "@/helpers/getFormattedDate.ts";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import AddProductModal from "./AddProductModal.tsx";
import toast from "react-hot-toast";
import { Categories } from "@/enums/Categories.ts";
import ConfirmDeleteModal from "../ConfirmDeleteModal.tsx";
import ErrorView from "../../common/ErrorView.tsx";
import UploadImageModal from "@/components/Admin/Products/UploadImageModal.tsx";
import { API_URL } from "@/constants/api.ts";

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
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>({
      type: "include",
      ids: new Set<number>(),
    });
  const [deleteProduct] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  const handleProductModalOpen = () => setOpenProductModal(true);
  const handleProductModalClose = () => setOpenProductModal(false);
  const handleConfirmDeleteModalOpen = () => setOpenConfirmDeleteModal(true);
  const handleConfirmDeleteModalClose = () => setOpenConfirmDeleteModal(false);
  const handleUploadModalOpen = () => setOpenUploadModal(true);
  const handleUploadModalClose = () => {
    setOpenUploadModal(false);
    setSelectedProduct(null);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <ErrorView message={"Wystąpił błąd podczas pobierania produktów."} />
    );
  }

  const onDelete = async () => {
    const ids = Array.from(rowSelectionModel.ids) as number[];
    if (ids.length === 0) {
      toast.error("Nie wybrano produktów do usunięcia.");
      return;
    }

    try {
      await toast.promise(
        Promise.all(ids.map((id) => deleteProduct(id).unwrap())),
        {
          loading: `Usuwanie ${ids.length >= 1 ? "produktu" : "produktów"}...`,
          success: `${ids.length >= 1 ? "Produkt został usunięty." : "Produkty zostały usunięte."}`,
          error: `Wystąpił błąd podczas usuwania ${ids.length >= 1 ? "produktu" : "produktów"}.`,
        }
      );
      setRowSelectionModel({ type: "include", ids: new Set<number>() });
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
        }
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
    { field: "updated_at", headerName: "Data aktualizacji", width: 150 },
    { field: "description", headerName: "Opis", width: 350, editable: true },
    {
      field: "image",
      headerName: "Zdjęcie",
      width: 150,
      renderCell: (params) => (
        <img
          src={`${API_URL}/${params.value}`}
          alt="product"
          style={{ height: "50px" }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Akcje",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="text"
          color="primary"
          onClick={() => {
            setSelectedProduct(
              products?.find((p) => p.product_id === params.id) || null
            );
            handleUploadModalOpen();
          }}
        >
          Zmień zdjęcie
        </Button>
      ),
    },
  ];

  const rows = products?.map((product: Product) => ({
    id: product.product_id,
    name: product.name,
    category: capitalizeFirstLetter(product.category),
    price: product.price,
    stock_quantity: product.stock_quantity,
    created_at: getFormattedDate(product.created_at.toString()),
    updated_at: getFormattedDate(product.updated_at.toString()),
    description: product.description,
    image: product.image,
  }));

  const CustomToolbar = () => {
    const ids = Array.from(rowSelectionModel.ids) as number[];
    return (
      <Toolbar className={"flex justify-between"}>
        <GridToolbarColumnsButton />
        <Button startIcon={<AddIcon />} onClick={handleProductModalOpen}>
          Dodaj produkt
        </Button>
        {ids.length > 0 && (
          <Button color="error" onClick={handleConfirmDeleteModalOpen}>
            Usuń zaznaczone ({ids.length})
          </Button>
        )}
        <GridToolbarQuickFilter debounceMs={300} />
      </Toolbar>
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
          showToolbar
          columns={columns}
          rows={rows}
          rowHeight={40}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          sx={{ border: 0, bgcolor: "background.paper" }}
          slots={{ toolbar: CustomToolbar }}
          initialState={{
            sorting: {
              sortModel: [{ field: "id", sort: "asc" }],
            },
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          processRowUpdate={handleProcessRowUpdate}
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={setRowSelectionModel}
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
        count={rowSelectionModel.ids.size}
      />
      <UploadImageModal
        open={openUploadModal}
        handleClose={handleUploadModalClose}
        productId={selectedProduct?.product_id || 0}
      />
    </Box>
  );
}

export default ProductsView;
