import { useDeleteOrderMutation, useGetOrdersQuery } from "../../Order/orderApiSlice.ts";
import { Box, Button, IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SellOutlined from "@mui/icons-material/SellOutlined";
import { DataGrid, type GridColDef, type GridRowSelectionModel } from "@mui/x-data-grid";
import type { Order } from "@/types/Order.ts";
import { useState } from "react";
import ConfirmDeleteModal from "../ConfirmDeleteModal.tsx";
import toast from "react-hot-toast";
import { getFormattedDate } from "@/helpers/getFormattedDate.ts";
import { useNavigate } from "react-router-dom";
import { OrderType } from "@/enums/OrderType.ts";
import { getPolishStatus } from "@/helpers/getPolishStatus.ts";
import { adminGridSx, adminPanelSx, moneyCellSx, orderStatusChipSx } from "../adminStyles.ts";
import AdminPageHeader from "../AdminPageHeader.tsx";
import AdminTableToolbar from "../AdminTableToolbar.tsx";
import AdminError from "../AdminError.tsx";
import AdminEmpty from "../AdminEmpty.tsx";
import AdminLoading from "../AdminLoading.tsx";
import { EASE, accentText, ghostButtonSx, tone } from "@/components/listingStyles.ts";

function OrdersView() {
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
      toast.error("Nie wybrano zamówień do usunięcia.");
      return;
    }

    try {
      await toast.promise(Promise.all(ids.map((id) => deleteOrder(id).unwrap())), {
        loading: `Usuwanie ${ids.length > 1 ? "zamówień" : "zamówienia"}...`,
        success: `${ids.length > 1 ? "Zamówienia zostały usunięte." : "Zamówienie zostało usunięte."}`,
        error: `Wystąpił błąd podczas usuwania ${ids.length > 1 ? "zamówień" : "zamówienia"}.`,
      });
      setRowSelectionModel({ type: "include", ids: new Set<number>() });
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Nie udało się usunąć.");
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "Nr", width: 80 },
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
          onClick={() => navigate(`/admin/zarzadzanie-zamowieniami/${params.row.id}`)}
          sx={(theme) => ({ ...ghostButtonSx(theme), px: 2, py: 0.5, fontSize: "0.82rem" })}>
          Szczegóły
        </Button>
      ),
    },
    { field: "customer_name", headerName: "Klient", flex: 1, minWidth: 160 },
    { field: "customer_email", headerName: "E-mail", width: 200 },
    { field: "order_date", headerName: "Data", width: 160 },
    {
      field: "total_amount",
      headerName: "Kwota",
      width: 120,
      sortComparator: (v1, v2) => Number.parseFloat(v1) - Number.parseFloat(v2),
      renderCell: (params) => (
        <Box component="span" sx={moneyCellSx}>
          {params.value}
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      renderCell: (params) => (
        <Box component="span" sx={(theme) => orderStatusChipSx(theme, params.row.rawStatus)}>
          {params.value}
        </Box>
      ),
    },
  ];

  const rows =
    orders?.map((order: Order) => {
      const customer_name =
        order.order_type === OrderType.COMPANY
          ? `${order.billingAddress.company_name || ""}`
          : `${order.billingAddress.first_name || ""} ${order.billingAddress.last_name || ""}`.trim();
      return {
        id: order.order_id,
        customer_name: customer_name || "—",
        customer_email: order.customer_email,
        order_date: getFormattedDate(order.order_date.toString()),
        total_amount: `${order.total_amount} zł`,
        status: getPolishStatus(order.status),
        rawStatus: order.status,
      };
    }) ?? [];

  const selectedCount = rowSelectionModel.ids.size;

  const CustomToolbar = () => (
    <AdminTableToolbar selectedCount={selectedCount} onDeleteSelected={handleConfirmDeleteModalOpen} />
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%", minWidth: 0 }}>
      <AdminPageHeader
        icon={<SellOutlined />}
        title="Zamówienia"
        subtitle="Wszystkie zamówienia sklepu z danymi klienta i statusem realizacji."
        actions={
          <IconButton
            onClick={() => refetch()}
            aria-label="Odśwież listę zamówień"
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
          message="Nie udało się pobrać zamówień."
          hint="Sprawdź połączenie i odśwież listę."
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
            rowHeight={56}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            sx={adminGridSx}
            slots={{
              toolbar: CustomToolbar,
              noRowsOverlay: () => (
                <AdminEmpty
                  icon={<SellOutlined />}
                  title="Brak zamówień"
                  hint="Gdy klienci złożą zamówienia, pojawią się tutaj."
                />
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
        open={openConfirmDeleteModal}
        handleClose={handleConfirmDeleteModalClose}
        onConfirm={onDelete}
        count={selectedCount}
      />
    </Box>
  );
}

export default OrdersView;
