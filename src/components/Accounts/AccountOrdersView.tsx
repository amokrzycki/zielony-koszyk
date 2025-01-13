import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import { useGetUserOrdersQuery } from "../Order/orderApiSlice.ts";
import User from "../../types/User.ts";
import { useAppSelector } from "@/hooks/hooks.ts";
import { RootState } from "@/store/store.ts";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { getFormattedDate } from "@/helpers/getFormattedDate.ts";
import { getPolishStatus } from "@/helpers/getPolishStatus.ts";
import { OrderStatuses } from "@/enums/OrderStatuses.ts";
import { useEffect } from "react";

function AccountOrdersView() {
  const user: User = useAppSelector((state: RootState) => state.auth.user);
  const userOrders = useGetUserOrdersQuery(user.user_id);
  const navigate = useNavigate();

  /* eslint-disable */
  useEffect(() => {
    userOrders.refetch();
  }, []);

  const columns: GridColDef[] = [
    { field: "id", headerName: "Numer zamówienia", width: 150 },
    { field: "status", headerName: "Status" },
    { field: "totalAmount", headerName: "Kwota" },
    { field: "createdAt", headerName: "Data zamówienia", width: 150 },
  ];

  if (userOrders.isLoading || userOrders.isFetching) {
    return <CircularProgress />;
  }

  if (userOrders.isError || !userOrders.data) {
    return <div>Wystąpił błąd!</div>;
  }

  const rows = userOrders.data.map((order) => ({
    id: order.order_id,
    status: getPolishStatus(order.status as OrderStatuses),
    totalAmount: `${order.total_amount} zł`,
    createdAt: getFormattedDate(order.order_date),
  }));

  const handleRowClick = (row: GridRowParams) => {
    navigate(`/konto/zamowienia/${row.row.id}`);
  };

  return (
    <Box className={"flex flex-col items-center gap-2"}>
      <Typography variant="h3">Zamówienia</Typography>
      <Typography variant="body1">
        Tutaj znajdziesz listę swoich zamówień
      </Typography>
      <Paper sx={{ height: 500, width: "75%" }}>
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
