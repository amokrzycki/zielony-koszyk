import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import { useGetUserOrdersQuery } from "../Order/orderApiSlice.ts";
import User from "../../types/User.ts";
import { useAppSelector } from "../../hooks/hooks.ts";
import { RootState } from "../../store/store.ts";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { UserOrder } from "../../types/UserOrder.ts";
import { useNavigate } from "react-router-dom";
import { getFormattedDate } from "../../utils/getFormattedDate.ts";
import { getPolishStatus } from "../../utils/getPolishStatus.ts";
import { OrderStatuses } from "../../enums/OrderStatuses.ts";

function AccountOrdersView() {
  const user: User = useAppSelector((state: RootState) => state.auth.user);
  const userOrders = useGetUserOrdersQuery(user.user_id);
  const navigate = useNavigate();

  const columns: GridColDef[] = [
    { field: "id", headerName: "Numer zamówienia", width: 150 },
    { field: "status", headerName: "Status" },
    { field: "totalAmount", headerName: "Kwota" },
    { field: "createdAt", headerName: "Data zamówienia", width: 150 },
  ];

  if (userOrders.isLoading) {
    return <CircularProgress />;
  }

  if (userOrders.isError) {
    return <div>Wystąpił błąd!</div>;
  }

  const rows = userOrders.data.map((order: UserOrder) => ({
    id: order.order_id,
    status: getPolishStatus(order.status as OrderStatuses),
    totalAmount: `${order.total_amount} zł`,
    createdAt: getFormattedDate(order.order_date),
  }));

  const handleRowClick = (row: GridRowParams) => {
    navigate(`/konto/zamowienie/${row.row.id}`);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography variant="h3">Zamówienia</Typography>
      <Typography variant="body1">
        Tutaj znajdziesz listę swoich zamówień
      </Typography>
      <Paper sx={{ height: 300, width: "45%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          autoPageSize={true}
          sx={{ border: 0 }}
          onRowClick={handleRowClick}
        />
      </Paper>
    </Box>
  );
}

export default AccountOrdersView;
