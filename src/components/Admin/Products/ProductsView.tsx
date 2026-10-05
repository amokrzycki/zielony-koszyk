import { Box, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import Inventory2Outlined from "@mui/icons-material/Inventory2Outlined";
import AddIcon from "@mui/icons-material/Add";
import {
  useDeleteProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
} from "../../Products/productsApiSlice.ts";
import { DataGrid, type GridColDef, type GridRowSelectionModel } from "@mui/x-data-grid";
import type Product from "../../../types/Product.ts";
import { useMemo, useState } from "react";
import AddProductModal from "./AddProductModal.tsx";
import EditProductModal from "./EditProductModal.tsx";
import toast from "react-hot-toast";
import { Categories } from "@/enums/Categories.ts";
import { useFormat, useLocale } from "@/i18n/useLocale.ts";
import { useApiError, useGridLocaleText, useIdentifierLabels } from "../useAdminI18n.ts";
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

/** Only the shared fields are edited inline; name and description change in the edit dialog (both languages). */
interface Row {
  id: number;
  category: string;
  price: number;
  quantity: number;
}

function ProductsView() {
  const { t } = useTranslation("admin");
  const apiError = useApiError();
  const locale = useLocale();
  const format = useFormat();
  const labels = useIdentifierLabels();
  const localeText = useGridLocaleText();
  const { data: products, isError, isLoading, refetch } = useGetProductsQuery({ locale });
  const [openProductModal, setOpenProductModal] = useState(false);
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
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
      toast.error(t("products.delete.none"));
      return;
    }

    try {
      await toast.promise(Promise.all(ids.map((id) => deleteProduct(id).unwrap())), {
        loading: t("products.delete.loading", { count: ids.length }),
        success: t("products.delete.success", { count: ids.length }),
        error: (error) => apiError(error, t("products.delete.error", { count: ids.length })),
      });
      setRowSelectionModel({ type: "include", ids: new Set<number>() });
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(t("general.deleteFailed"));
    }
  };

  const handleProcessRowUpdate = async (updatedRow: Row, oldRow: Row) => {
    if (
      oldRow.category === updatedRow.category &&
      oldRow.price === updatedRow.price &&
      oldRow.quantity === updatedRow.quantity
    ) {
      return oldRow;
    }

    try {
      await toast.promise(
        updateProduct({
          id: updatedRow.id,
          product: {
            category: updatedRow.category as Categories,
            price: Number(updatedRow.price),
            stock_quantity: Number(updatedRow.quantity),
          },
        }).unwrap(),
        {
          loading: t("products.update.loading"),
          success: t("products.update.success"),
          error: (error) => apiError(error, t("products.update.error")),
        },
      );

      return updatedRow;
    } catch (error) {
      toast.error(t("products.update.failed"));
      throw error;
    }
  };

  // Headers, category labels and formatters follow the locale, so the columns are rebuilt when it changes.
  // biome-ignore lint/correctness/useExhaustiveDependencies: setters from useState are stable
  const columns = useMemo<GridColDef[]>(
    () => [
      { field: "id", headerName: t("products.columns.id"), width: 80 },
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
      { field: "name", headerName: t("products.columns.name"), flex: 1, minWidth: 180 },
      {
        field: "category",
        headerName: t("products.columns.category"),
        width: 140,
        editable: true,
        type: "singleSelect",
        valueOptions: Object.values(Categories).map((value) => ({ value, label: labels.category(value) })),
      },
      {
        field: "price",
        headerName: t("products.columns.price"),
        width: 120,
        editable: true,
        type: "number",
        renderCell: (params) => (
          <Box component="span" sx={moneyCellSx}>
            {format.currency(params.value)}
          </Box>
        ),
      },
      { field: "quantity", headerName: t("products.columns.stock"), width: 90, editable: true, type: "number" },
      {
        field: "created_at",
        headerName: t("products.columns.createdAt"),
        width: 180,
        type: "dateTime",
        valueFormatter: (value: Date) => format.dateTime(value),
      },
      { field: "description", headerName: t("products.columns.description"), width: 260 },
      {
        field: "actions",
        headerName: "",
        width: 250,
        sortable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          const product = products?.find((p) => p.product_id === params.row.id) || null;
          return (
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <Button
                variant="text"
                onClick={() => setProductToEdit(product)}
                sx={(theme) => ({ ...ghostButtonSx(theme), px: 1.5, py: 0.5, fontSize: "0.82rem" })}>
                {t("actions.edit", { ns: "common" })}
              </Button>
              <Button
                variant="text"
                onClick={() => {
                  setSelectedProduct(product);
                  handleUploadModalOpen();
                }}
                sx={(theme) => ({ ...ghostButtonSx(theme), px: 1.5, py: 0.5, fontSize: "0.82rem" })}>
                {t("products.changeImage")}
              </Button>
            </Box>
          );
        },
      },
    ],
    [t, format, labels, products],
  );

  const rows = useMemo(
    () =>
      products?.map((product: Product) => ({
        id: product.product_id,
        name: product.name,
        category: product.category,
        price: product.price,
        quantity: product.stock_quantity,
        created_at: new Date(product.created_at),
        description: product.description,
        image: product.image,
      })) ?? [],
    [products],
  );

  const selectedCount = rowSelectionModel.ids.size;

  const CustomToolbar = () => (
    <AdminTableToolbar
      selectedCount={selectedCount}
      onDeleteSelected={handleConfirmDeleteModalOpen}
      addAction={{ label: t("products.add"), icon: <AddIcon />, onClick: handleProductModalOpen }}
    />
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%", minWidth: 0 }}>
      <AdminPageHeader icon={<Inventory2Outlined />} title={t("products.title")} subtitle={t("products.subtitle")} />

      {isError ? (
        <AdminError
          message={t("products.loadError.message")}
          hint={t("products.loadError.hint")}
          onRetry={() => refetch()}
        />
      ) : isLoading ? (
        <AdminLoading rows={7} />
      ) : (
        <Box className="fade-in" sx={(theme) => ({ ...adminPanelSx(theme), width: "100%" })}>
          <DataGrid
            disableRowSelectionOnClick
            checkboxSelection
            showToolbar
            columns={columns}
            rows={rows}
            rowHeight={52}
            localeText={localeText}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            sx={adminGridSx}
            slots={{
              toolbar: CustomToolbar,
              noRowsOverlay: () => (
                <AdminEmpty
                  icon={<Inventory2Outlined />}
                  title={t("products.empty.title")}
                  hint={t("products.empty.hint")}
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
      <EditProductModal product={productToEdit} handleClose={() => setProductToEdit(null)} />
      <ConfirmDeleteModal
        entity="products"
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
