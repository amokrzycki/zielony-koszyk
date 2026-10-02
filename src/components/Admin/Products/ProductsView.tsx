import { Box, Button } from "@mui/material";
import Inventory2Outlined from "@mui/icons-material/Inventory2Outlined";
import AddIcon from "@mui/icons-material/Add";
import {
  useDeleteProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
} from "../../Products/productsApiSlice.ts";
import { DataGrid, type GridColDef, type GridRowSelectionModel } from "@mui/x-data-grid";
import type Product from "../../../types/Product.ts";
import capitalizeFirstLetter from "../../../helpers/capitalizeFirstLetter.ts";
import { getFormattedDate } from "@/helpers/getFormattedDate.ts";
import { useState } from "react";
import AddProductModal from "./AddProductModal.tsx";
import toast from "react-hot-toast";
import type { Categories } from "@/enums/Categories.ts";
import ConfirmDeleteModal from "../ConfirmDeleteModal.tsx";
import AdminError from "../AdminError.tsx";
import AdminEmpty from "../AdminEmpty.tsx";
import AdminLoading from "../AdminLoading.tsx";
import UploadImageModal from "@/components/Admin/Products/UploadImageModal.tsx";
import { API_URL } from "@/constants/api.ts";
import { adminGridSx, adminPanelSx, moneyCellSx } from "../adminStyles.ts";
import AdminPageHeader from "../AdminPageHeader.tsx";
import AdminTableToolbar from "../AdminTableToolbar.tsx";
import { accentText, ghostButtonSx, tone } from "@/components/listingStyles.ts";

interface Row {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  created_at: string;
  description: string;
}

function ProductsView() {
  const { data: products, isError, isLoading, refetch } = useGetProductsQuery();
  const [openProductModal, setOpenProductModal] = useState(false);
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>({
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

  const onDelete = async () => {
    const ids = Array.from(rowSelectionModel.ids) as number[];
    if (ids.length === 0) {
      toast.error("Nie wybrano produktów do usunięcia.");
      return;
    }

    try {
      await toast.promise(Promise.all(ids.map((id) => deleteProduct(id).unwrap())), {
        loading: `Usuwanie ${ids.length > 1 ? "produktów" : "produktu"}...`,
        success: `${ids.length > 1 ? "Produkty zostały usunięte." : "Produkt został usunięty."}`,
        error: `Wystąpił błąd podczas usuwania ${ids.length > 1 ? "produktów" : "produktu"}.`,
      });
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
      oldRow.quantity === updatedRow.quantity &&
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
        stock_quantity: updatedRow.quantity,
        description: updatedRow.description,
      };

      await toast.promise(updateProduct({ id: updatedRow.id, product: updatedProduct }).unwrap(), {
        loading: "Aktualizowanie produktu...",
        success: "Produkt został zaktualizowany.",
        error: "Wystąpił błąd podczas aktualizacji produktu.",
      });

      return updatedRow;
    } catch (error) {
      toast.error("Nie udało się zaktualizować produktu.");
      throw error;
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 80 },
    {
      field: "image",
      headerName: "",
      width: 68,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) =>
        params.value ? (
          <Box
            component="img"
            src={`${API_URL}/${params.value}`}
            alt=""
            sx={(theme) => ({
              height: 40,
              width: 40,
              objectFit: "cover",
              borderRadius: "18px",
              border: "1px solid",
              borderColor: "divider",
              bgcolor: tone(theme, 0.06),
            })}
          />
        ) : (
          <Box
            aria-hidden
            sx={(theme) => ({
              height: 40,
              width: 40,
              borderRadius: "18px",
              bgcolor: tone(theme, 0.08),
              display: "grid",
              placeItems: "center",
              color: accentText(theme),
            })}>
            <Inventory2Outlined sx={{ fontSize: 18 }} />
          </Box>
        ),
    },
    { field: "name", headerName: "Nazwa", flex: 1, minWidth: 180, editable: true },
    { field: "category", headerName: "Kategoria", width: 130, editable: true },
    {
      field: "price",
      headerName: "Cena",
      width: 110,
      editable: true,
      sortComparator: (v1, v2) => v1 - v2,
      renderCell: (params) => (
        <Box component="span" sx={moneyCellSx}>
          {params.value} zł
        </Box>
      ),
    },
    { field: "quantity", headerName: "Stan", width: 90, editable: true, type: "number" },
    { field: "created_at", headerName: "Dodano", width: 120 },
    { field: "description", headerName: "Opis", width: 260, editable: true },
    {
      field: "actions",
      headerName: "",
      width: 130,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Button
          variant="text"
          onClick={() => {
            setSelectedProduct(products?.find((p) => p.product_id === params.row.id) || null);
            handleUploadModalOpen();
          }}
          sx={(theme) => ({
            ...ghostButtonSx(theme),
            px: 1.5,
            py: 0.5,
            fontSize: "0.82rem",
          })}>
          Zmień zdjęcie
        </Button>
      ),
    },
  ];

  const rows =
    products?.map((product: Product) => ({
      id: product.product_id,
      name: product.name,
      category: capitalizeFirstLetter(product.category),
      price: product.price,
      quantity: product.stock_quantity,
      created_at: getFormattedDate(product.created_at.toString()),
      description: product.description,
      image: product.image,
    })) ?? [];

  const selectedCount = rowSelectionModel.ids.size;

  const CustomToolbar = () => (
    <AdminTableToolbar
      selectedCount={selectedCount}
      onDeleteSelected={handleConfirmDeleteModalOpen}
      addAction={{ label: "Dodaj produkt", icon: <AddIcon />, onClick: handleProductModalOpen }}
    />
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%", minWidth: 0 }}>
      <AdminPageHeader
        icon={<Inventory2Outlined />}
        title="Produkty"
        subtitle="Katalog, ceny i stany magazynowe. Edytuj komórki bezpośrednio w tabeli."
      />

      {isError ? (
        <AdminError
          message="Wystąpił błąd podczas pobierania produktów."
          hint="Odśwież listę, aby spróbować ponownie."
          onRetry={() => refetch()}
        />
      ) : isLoading ? (
        <AdminLoading rows={7} />
      ) : (
        <Box sx={(theme) => ({ ...adminPanelSx(theme), width: "100%" })}>
          <DataGrid
            disableRowSelectionOnClick
            checkboxSelection
            showToolbar
            columns={columns}
            rows={rows}
            rowHeight={52}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            sx={adminGridSx}
            slots={{
              toolbar: CustomToolbar,
              noRowsOverlay: () => (
                <AdminEmpty
                  icon={<Inventory2Outlined />}
                  title="Brak produktów"
                  hint="Dodaj pierwszy produkt, aby pojawił się w katalogu sklepu."
                />
              ),
            }}
            initialState={{
              sorting: { sortModel: [{ field: "id", sort: "asc" }] },
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            processRowUpdate={handleProcessRowUpdate}
            rowSelectionModel={rowSelectionModel}
            onRowSelectionModelChange={setRowSelectionModel}
          />
        </Box>
      )}

      <AddProductModal open={openProductModal} handleClose={handleProductModalClose} />
      <ConfirmDeleteModal
        open={openConfirmDeleteModal}
        handleClose={handleConfirmDeleteModalClose}
        onConfirm={onDelete}
        count={selectedCount}
      />
      <UploadImageModal
        open={openUploadModal && Boolean(selectedProduct)}
        handleClose={handleUploadModalClose}
        productId={selectedProduct?.product_id ?? 0}
      />
    </Box>
  );
}

export default ProductsView;
