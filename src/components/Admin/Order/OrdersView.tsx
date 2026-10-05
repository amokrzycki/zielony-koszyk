import { useDeleteOrderMutation, useGetOrdersQuery } from "../../Order/orderApiSlice.ts";
import { Box, Button, IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SellOutlined from "@mui/icons-material/SellOutlined";
import { DataGrid, type GridColDef, type GridRowSelectionModel } from "@mui/x-data-grid";
import type { Order } from "@/types/Order.ts";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ConfirmDeleteModal from "../ConfirmDeleteModal.tsx";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { OrderType } from "@/enums/OrderType.ts";
import { useFormat, useLocalePath } from "@/i18n/useLocale.ts";
import { useApiError, useGridLocaleText, useIdentifierLabels } from "../useAdminI18n.ts";
import { adminGridSx, adminPanelSx, moneyCellSx, orderStatusChipSx } from "../adminStyles.ts";
import AdminPageHeader from "../AdminPageHeader.tsx";
import AdminTableToolbar from "../AdminTableToolbar.tsx";
import AdminError from "../AdminError.tsx";
import AdminEmpty from "../AdminEmpty.tsx";
import AdminLoading from "../AdminLoading.tsx";
import { EASE, accentText, ghostButtonSx, tone } from "@/components/listingStyles.ts";

function OrdersView() {
  const { t } = useTranslation("admin");
  const format = useFormat();
  const to = useLocalePath();
  const labels = useIdentifierLabels();
  const apiError = useApiError();
  const localeText = useGridLocaleText();
  const { data: orders, isError, isLoading, refetch } = useGetOrdersQuery();
  const navigate = useNavigate();
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>({
    type: "include",
    ids: new Set<number>(),
  });
  const [deleteOrder] = useDeleteOrderMutation();

  const handleConfirmDeleteModalOpen = () => setOpenConfirmDeleteModal(true);
  const handleConfirmDeleteModalClose = () => setOpenConfirmDeleteModal(false);

  const onDelete = async () => {
    const ids = Array.from(rowSelectionModel.ids) as number[];
    if (ids.length === 0) {
      toast.error(t("orders.delete.none"));
      return;
    }

    try {
      await toast.promise(Promise.all(ids.map((id) => deleteOrder(id).unwrap())), {
        loading: t("orders.delete.loading", { count: ids.length }),
        success: t("orders.delete.success", { count: ids.length }),
        error: (error) => apiError(error, t("orders.delete.error", { count: ids.length })),
      });
      setRowSelectionModel({ type: "include", ids: new Set<number>() });
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(t("general.deleteFailed"));
    }
  };

  const columns = useMemo<GridColDef[]>(
    () => [
      { field: "id", headerName: t("orders.columns.id"), width: 80 },
      {
        field: "actions",
        headerName: "",
        width: 140,
        sortable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate(to("adminOrderItems", { orderId: params.row.id }))}
            sx={(theme) => ({ ...ghostButtonSx(theme), px: 2, py: 0.5, fontSize: "0.82rem" })}>
            {t("orders.details")}
          </Button>
        ),
      },
      { field: "customer_name", headerName: t("orders.columns.customer"), flex: 1, minWidth: 160 },
      { field: "customer_email", headerName: t("orders.columns.email"), width: 200 },
      {
        field: "order_date",
        headerName: t("orders.columns.date"),
        width: 190,
        type: "dateTime",
        valueFormatter: (value: Date) => format.dateTime(value),
      },
      {
        field: "total_amount",
        headerName: t("orders.columns.amount"),
        width: 130,
        type: "number",
        renderCell: (params) => (
          <Box component="span" sx={moneyCellSx}>
            {format.currency(params.value)}
          </Box>
        ),
      },
      {
        field: "status",
        headerName: t("orders.columns.status"),
        width: 220,
        renderCell: (params) => (
          <Box component="span" sx={(theme) => orderStatusChipSx(theme, params.row.rawStatus)}>
            {params.value}
          </Box>
        ),
      },
    ],
    [t, format, navigate, to],
  );

  const rows = useMemo(
    () =>
      orders?.map((order: Order) => {
        const customer_name =
          order.order_type === OrderType.COMPANY
            ? `${order.billingAddress.company_name || ""}`
            : `${order.billingAddress.first_name || ""} ${order.billingAddress.last_name || ""}`.trim();
        return {
          id: order.order_id,
          customer_name: customer_name || "—",
          customer_email: order.customer_email,
          order_date: new Date(order.order_date),
          total_amount: Number.parseFloat(order.total_amount),
          status: labels.status(order.status),
          rawStatus: order.status,
        };
      }) ?? [],
    [orders, labels],
  );

  const selectedCount = rowSelectionModel.ids.size;

  const CustomToolbar = () => (
    <AdminTableToolbar selectedCount={selectedCount} onDeleteSelected={handleConfirmDeleteModalOpen} />
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%", minWidth: 0 }}>
      <AdminPageHeader
        icon={<SellOutlined />}
        title={t("orders.title")}
        subtitle={t("orders.subtitle")}
        actions={
          <IconButton
            onClick={() => refetch()}
            aria-label={t("orders.refresh")}
            sx={(theme) => ({
              border: "1px solid",
              borderColor: "divider",
              color: "text.secondary",
              transition: `color 200ms ${EASE}, border-color 200ms ${EASE}, background-color 200ms ${EASE}`,
              "&:hover": { color: accentText(theme), borderColor: accentText(theme), bgcolor: tone(theme, 0.08) },
            })}>
            <RefreshIcon fontSize="small" />
          </IconButton>
        }
      />

      {isError ? (
        <AdminError
          message={t("orders.loadError.message")}
          hint={t("orders.loadError.hint")}
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
            rowHeight={56}
            localeText={localeText}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            sx={adminGridSx}
            slots={{
              toolbar: CustomToolbar,
              noRowsOverlay: () => (
                <AdminEmpty icon={<SellOutlined />} title={t("orders.empty.title")} hint={t("orders.empty.hint")} />
              ),
            }}
            initialState={{
              sorting: { sortModel: [{ field: "id", sort: "asc" }] },
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            rowSelectionModel={rowSelectionModel}
            onRowSelectionModelChange={setRowSelectionModel}
          />
        </Box>
      )}

      <ConfirmDeleteModal
        entity="orders"
        open={openConfirmDeleteModal}
        handleClose={handleConfirmDeleteModalClose}
        onConfirm={onDelete}
        count={selectedCount}
      />
    </Box>
  );
}

export default OrdersView;
