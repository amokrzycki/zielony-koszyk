import { useNavigate, useParams } from "react-router-dom";
import { useGetOrderQuery } from "../../Order/orderApiSlice.ts";
import { Box, Button, Typography } from "@mui/material";
import ReceiptLongOutlined from "@mui/icons-material/ReceiptLongOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, type GridColDef, type GridRowSelectionModel } from "@mui/x-data-grid";
import type { OrderItemResponse } from "@/types/OrderItemResponse.ts";
import ConfirmDeleteModal from "../ConfirmDeleteModal.tsx";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import AdminError from "../AdminError.tsx";
import AdminEmpty from "../AdminEmpty.tsx";
import AdminLoading from "../AdminLoading.tsx";
import { useFormat, useLocalePath } from "@/i18n/useLocale.ts";
import { useApiError, useGridLocaleText, useIdentifierLabels } from "../useAdminI18n.ts";
import {
  useGetOrderItemsQuery,
  useRemoveOrderItemsMutation,
  useUpdateOrderItemsMutation,
} from "../../Order/orderItemsApiSlice.ts";
import AddOrderItemsModal from "./AddOrderItemsModal.tsx";
import OrderAddresses from "@/components/Accounts/Order/OrderAddresses.tsx";
import InvoiceDownloadButton from "@/components/Order/InvoiceDownloadButton.tsx";
import { adminGridSx, adminPanelSx, adminSubheadingSx, moneyCellSx, orderStatusChipSx } from "../adminStyles.ts";
import AdminPageHeader from "../AdminPageHeader.tsx";
import AdminTableToolbar from "../AdminTableToolbar.tsx";
import { panelSx } from "@/components/listingStyles.ts";

interface Row {
  id: number;
  product_name: string;
  quantity: number;
  price: string;
}

function OrderItemsView() {
  const { orderId } = useParams();
  const { t } = useTranslation("admin");
  const format = useFormat();
  const to = useLocalePath();
  const labels = useIdentifierLabels();
  const apiError = useApiError();
  const localeText = useGridLocaleText();
  const { data: orderDetails, isError, isLoading } = useGetOrderItemsQuery(orderId as string);
  const { data: order, isLoading: isOrderLoading, isError: isOrderError } = useGetOrderQuery(orderId as string);
  const [openProductModal, setOpenProductModal] = useState(false);
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>({
    type: "include",
    ids: new Set<number>(),
  });
  const [deleteOrderItems] = useRemoveOrderItemsMutation();
  const [updateOrderItems] = useUpdateOrderItemsMutation();
  const navigate = useNavigate();

  const handleConfirmDeleteModalOpen = () => setOpenConfirmDeleteModal(true);
  const handleConfirmDeleteModalClose = () => setOpenConfirmDeleteModal(false);
  const handleProductModalOpen = () => setOpenProductModal(true);
  const handleProductModalClose = () => setOpenProductModal(false);

  const onDelete = async () => {
    const ids = Array.from(rowSelectionModel.ids) as number[];
    if (ids.length === 0) {
      toast.error(t("orderItems.delete.none"));
      return;
    }

    try {
      await toast.promise(Promise.all(ids.map((id) => deleteOrderItems(id).unwrap())), {
        loading: t("orderItems.delete.loading", { count: ids.length }),
        success: t("orderItems.delete.success", { count: ids.length }),
        error: (error) => apiError(error, t("orderItems.delete.error", { count: ids.length })),
      });
      setRowSelectionModel({ type: "include", ids: new Set<number>() });
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(t("general.deleteFailed"));
    }
  };

  const handleProcessRowUpdate = async (updatedRow: Row, oldRow: Row) => {
    if (
      oldRow.product_name === updatedRow.product_name &&
      oldRow.quantity === updatedRow.quantity &&
      oldRow.price === updatedRow.price
    ) {
      return oldRow;
    }

    try {
      await toast.promise(
        updateOrderItems({
          id: updatedRow.id,
          order: {
            product_name: updatedRow.product_name,
            quantity: updatedRow.quantity,
            price: updatedRow.price.toString(),
          },
        }),
        {
          loading: t("orderItems.update.loading"),
          success: t("orderItems.update.success"),
          error: (error) => apiError(error, t("orderItems.update.error")),
        },
      );
      return updatedRow;
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(t("orderItems.update.failed"));
      throw error;
    }
  };

  const columns = useMemo<GridColDef[]>(
    () => [
      { field: "product_name", headerName: t("orderItems.columns.product"), flex: 1, minWidth: 200, editable: true },
      { field: "quantity", headerName: t("orderItems.columns.quantity"), width: 110, editable: true, type: "number" },
      {
        field: "price",
        headerName: t("orderItems.columns.price"),
        width: 130,
        editable: true,
        renderCell: (params) => (
          <Box component="span" sx={moneyCellSx}>
            {format.currency(params.value)}
          </Box>
        ),
      },
      {
        field: "total",
        headerName: t("orderItems.columns.total"),
        width: 150,
        type: "number",
        renderCell: (params) => (
          <Box component="span" sx={moneyCellSx}>
            {format.currency(params.value)}
          </Box>
        ),
      },
    ],
    [t, format],
  );

  const rows = useMemo(
    () =>
      orderDetails?.map((orderDetail: OrderItemResponse) => ({
        id: orderDetail.order_item_id,
        product_name: orderDetail.product_name,
        quantity: orderDetail.quantity,
        price: orderDetail.price,
        total: orderDetail.quantity * Number.parseFloat(orderDetail.price),
      })) ?? [],
    [orderDetails],
  );

  const selectedCount = rowSelectionModel.ids.size;

  const CustomToolbar = () => (
    <AdminTableToolbar
      selectedCount={selectedCount}
      onDeleteSelected={handleConfirmDeleteModalOpen}
      addAction={{ label: t("products.add"), icon: <AddIcon />, onClick: handleProductModalOpen }}
      extra={
        <Typography sx={{ color: "text.secondary", fontSize: "0.85rem" }}>{t("orderItems.toolbarHint")}</Typography>
      }
    />
  );

  if (isLoading || isOrderLoading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <AdminPageHeader
          icon={<ReceiptLongOutlined />}
          title={t("orderItems.loadingTitle")}
          subtitle={t("orderItems.loadingSubtitle")}
        />
        <AdminLoading rows={7} />
      </Box>
    );
  }

  if (isError || isOrderError || !orderDetails || !order) {
    return <AdminError message={t("orderItems.loadError.message")} hint={t("orderItems.loadError.hint")} />;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%", minWidth: 0 }}>
      <AdminPageHeader
        icon={<ReceiptLongOutlined />}
        title={t("orderItems.title", { id: order.order_id })}
        subtitle={
          !order.user_id
            ? t("orderItems.subtitleGuest")
            : t("orderItems.subtitlePlaced", { date: format.dateTime(order.order_date) })
        }
        actions={
          <Box sx={{ display: "flex", gap: 1.25, alignItems: "center" }}>
            <Button
              variant="outlined"
              startIcon={<EditOutlined />}
              onClick={() => navigate(to("adminOrderEdit", { orderId: order.order_id }))}
              sx={{ borderRadius: "999px", fontWeight: 700 }}>
              {t("orderItems.editDetails")}
            </Button>
            <InvoiceDownloadButton orderId={order.order_id} />
          </Box>
        }
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 2.5,
          mb: 3,
        }}>
        <OrderAddresses order={order} />
      </Box>

      <Box
        sx={(theme) => ({
          ...panelSx(theme),
          p: { xs: 2.5, sm: 3 },
          mb: 3,
          display: "flex",
          flexWrap: "wrap",
          gap: { xs: 3, sm: 5 },
        })}>
        <Box>
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}>
            {t("orderItems.status")}
          </Typography>
          <Box component="span" sx={(theme) => ({ ...orderStatusChipSx(theme, order.status), mt: 1 })}>
            {labels.status(order.status)}
          </Box>
        </Box>
        <Box>
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}>
            {t("orderItems.amount")}
          </Typography>
          <Typography sx={{ mt: 0.5, fontSize: "1.35rem", fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
            {format.currency(order.total_amount)}
          </Typography>
        </Box>
        <Box>
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}>
            {t("orderItems.date")}
          </Typography>
          <Typography sx={{ mt: 0.5, fontSize: "1.35rem", fontWeight: 800 }}>
            {format.dateTime(order.order_date)}
          </Typography>
        </Box>
      </Box>

      <Typography component="h2" sx={{ ...adminSubheadingSx, mb: 1.5 }}>
        {t("orderItems.heading")}
      </Typography>

      <Box sx={(theme) => ({ ...adminPanelSx(theme), width: "100%" })}>
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
                icon={<ReceiptLongOutlined />}
                title={t("orderItems.empty.title")}
                hint={t("orderItems.empty.hint")}
              />
            ),
          }}
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={setRowSelectionModel}
          initialState={{
            sorting: { sortModel: [{ field: "id", sort: "asc" }] },
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          processRowUpdate={handleProcessRowUpdate}
        />
      </Box>

      <ConfirmDeleteModal
        entity="orderItems"
        open={openConfirmDeleteModal}
        handleClose={handleConfirmDeleteModalClose}
        onConfirm={onDelete}
        count={selectedCount}
      />
      <AddOrderItemsModal open={openProductModal} handleClose={handleProductModalClose} orderId={order.order_id} />
    </Box>
  );
}

export default OrderItemsView;
