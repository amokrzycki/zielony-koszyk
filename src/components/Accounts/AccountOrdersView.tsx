import { Box, Paper, Typography } from "@mui/material";
import { useGetUserOrdersQuery } from "../Order/orderApiSlice.ts";
import User from "../../types/User.ts";
import { useAppSelector } from "../../hooks/hooks.ts";
import { RootState } from "../../store/store.ts";
import { DataGrid, GridRowParams } from "@mui/x-data-grid";
import { UserOrder } from "../../types/UserOrder.ts";
import { useNavigate } from "react-router-dom";

function AccountOrdersView() {
  const user: User = useAppSelector((state: RootState) => state.auth.user);
  const userOrders = useGetUserOrdersQuery(user.user_id);
  const navigate = useNavigate();

  // TODO: Map statuses to polish names
  // TODO: Fix date format
  // TODO: Change layout of this view

  const columns = [
    { field: "id", headerName: "Numer zamówienia", width: 160 },
    { field: "status", headerName: "Status", width: 90 },
    { field: "totalAmount", headerName: "Kwota", width: 130 },
    { field: "createdAt", headerName: "Data zamówienia", width: 200 },
  ];

  if (userOrders.isLoading) {
    return <div>Loading...</div>;
  }

  if (userOrders.isError) {
    return <div>Error</div>;
  }

  const rows = userOrders.data.map((order: UserOrder) => ({
    id: order.order_id,
    status: order.status,
    totalAmount: `${order.total_amount} zł`,
    createdAt: order.order_date,
  }));

  const handleRowClick = (row: GridRowParams) => {
    navigate(`/konto/zamowienie/${row.row.id}`);
  };

  return (
    <Box>
      <Typography variant="h3">Zamówienia</Typography>
      <Typography variant="body1">
        Tutaj znajdziesz listę swoich zamówień
      </Typography>
      <Paper sx={{ height: 300, width: 700 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          sx={{ border: 0 }}
          onRowClick={handleRowClick}
        />
      </Paper>
    </Box>
  );
}

export default AccountOrdersView;
