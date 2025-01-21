import {
  useDeleteOrderMutation,
  useGetOrdersQuery,
  useUpdateOrderMutation,
} from "../../Order/orderApiSlice.ts";
import { Box, Button, IconButton, Typography } from "@mui/material";
import Loading from "../../common/Loading.tsx";
import {
  DataGrid,
  GridColDef,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { Order } from "../../../types/Order.ts";
import { useState } from "react";
import ConfirmDeleteModal from "../ConfirmDeleteModal.tsx";
import toast from "react-hot-toast";
import { getFormattedDate } from "../../../helpers/getFormattedDate.ts";
import { getPolishStatus } from "../../../helpers/getPolishStatus.ts";
import { OrderStatuses } from "../../../enums/OrderStatuses.ts";
import RefreshIcon from "@mui/icons-material/Refresh";
import { getEnglishStatus } from "../../../helpers/getEnglishStatus.ts";
import { PolishOrderStatuses } from "../../../enums/PolishOrderStatuses.ts";
import StatusDropdownEditor from "../StatusDropdownEditor.tsx";
import { useNavigate } from "react-router-dom";
import ErrorView from "../../common/ErrorView.tsx";

interface Row {
  id: number;
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  order_date: string;
  total_amount: string;
  status: string;
}

function OrdersView() {
  const { data: orders, isError, isLoading, refetch } = useGetOrdersQuery();
  const navigate = useNavigate();
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [deleteOrder] = useDeleteOrderMutation();
  const [updateOrder] = useUpdateOrderMutation();

  const handleConfirmDeleteModalOpen = () => setOpenConfirmDeleteModal(true);
  const handleConfirmDeleteModalClose = () => setOpenConfirmDeleteModal(false);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorView message={"Nie udało się pobrać zamówień."} />;
  }

  const onDelete = async () => {
    if (selectedRows.length === 0) {
      toast.error("Nie wybrano zamówień do usunięcia.");
      return;
    }

    try {
      await toast.promise(
        Promise.all(selectedRows.map((id) => deleteOrder(id).unwrap())),
        {
          loading: `Usuwanie ${selectedRows.length >= 1 ? "zamówienia" : "zamówień"}...`,
          success: `${selectedRows.length >= 1 ? "Zamówienie zostało usunięte." : "Zamówienia zostały ususnięte."}`,
          error: `Wystąpił błąd podczas usuwania ${selectedRows.length >= 1 ? "zamówienia" : "zamówień"}.`,
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
      oldRow.user_id === updatedRow.user_id &&
      oldRow.customer_name === updatedRow.customer_name &&
      oldRow.customer_email === updatedRow.customer_email &&
      oldRow.customer_phone === updatedRow.customer_phone &&
      oldRow.customer_address === updatedRow.customer_address &&
      oldRow.order_date === updatedRow.order_date &&
      oldRow.total_amount === updatedRow.total_amount &&
      oldRow.status === updatedRow.status
    ) {
      return oldRow;
    }

    try {
      const updatedOrder: Partial<Order> = {
        customer_name: updatedRow.customer_name,
        customer_email: updatedRow.customer_email,
        customer_phone: updatedRow.customer_phone,
        customer_address: updatedRow.customer_address,
        total_amount: updatedRow.total_amount,
        status: getEnglishStatus(updatedRow.status as PolishOrderStatuses),
      };

      await toast.promise(
        updateOrder({ id: updatedRow.id, order: updatedOrder }).unwrap(),
        {
          loading: "Aktualizowanie zamówienia...",
          success: "Zamówienia zostało zaktualizowane.",
          error: "Wystąpił błąd podczas aktualizacji zamówienia.",
        },
      );

      return updatedRow;
    } catch (error) {
      toast.error("Nie udało się zaktualizować zamówienia.");
      throw error;
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID zamówienia", width: 130 },
    { field: "user_id", headerName: "ID klienta", width: 200 },
    {
      field: "customer_name",
      headerName: "Imię i nazwisko klienta",
      width: 200,
      editable: true,
    },
    {
      field: "customer_email",
      headerName: "Email klienta",
      width: 190,
      editable: true,
    },
    {
      field: "customer_phone",
      headerName: "Telefon klienta",
      width: 150,
      editable: true,
    },
    {
      field: "customer_address",
      headerName: "Adres klienta",
      width: 200,
      flex: 1,
      editable: true,
    },
    { field: "order_date", headerName: "Data zamówienia", width: 150 },
    {
      field: "total_amount",
      headerName: "Kwota całkowita",
      width: 150,
      editable: true,
      sortComparator: (v1, v2) => v1 - v2,
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      editable: true,
      renderEditCell: (params) => <StatusDropdownEditor {...params} />,
    },
    {
      field: "actions",
      headerName: "Akcje",
      width: 150,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={() =>
            navigate(`/admin/zarzadzanie-zamowieniami/${params.id}`)
          }
        >
          Szczegóły
        </Button>
      ),
    },
  ];

  const rows = orders?.map((order: Order) => ({
    id: order.order_id,
    user_id: order.user_id || "Zamówienie bez konta",
    customer_name: order.customer_name,
    customer_email: order.customer_email,
    customer_phone: order.customer_phone,
    customer_address: order.customer_address,
    order_date: getFormattedDate(order.order_date.toString()),
    total_amount: order.total_amount,
    status: getPolishStatus(order.status as OrderStatuses),
  }));

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer className={"flex justify-between"}>
        <GridToolbarColumnsButton />
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
      <Box className={"flex items-center"}>
        <Typography variant="h4" component="h1">
          Zamówienia
        </Typography>
        <IconButton onClick={() => refetch()} color="primary">
          <RefreshIcon />
        </IconButton>
      </Box>
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
      <ConfirmDeleteModal
        open={openConfirmDeleteModal}
        handleClose={handleConfirmDeleteModalClose}
        onConfirm={onDelete}
        count={selectedRows.length}
      />
    </Box>
  );
}

export default OrdersView;
