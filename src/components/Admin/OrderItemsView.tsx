import { useParams } from "react-router-dom";
import { useGetOrderQuery } from "../Order/orderApiSlice.ts";
import { Box, Button, Typography } from "@mui/material";
import Loading from "../common/Loading.tsx";
import {
  DataGrid,
  GridColDef,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { OrderDetailsResponse } from "../../types/OrderDetailsResponse.ts";
import ConfirmDeleteModal from "./ConfirmDeleteModal.tsx";
import { useState } from "react";
import toast from "react-hot-toast";
import Error from "../common/Error.tsx";
import { getFormattedDate } from "../../utils/getFormattedDate.ts";
import { getPolishStatus } from "../../utils/getPolishStatus.ts";
import { OrderStatuses } from "../../enums/OrderStatuses.ts";
import {
  useGetOrderItemsQuery,
  useRemoveOrderItemsMutation,
  useUpdateOrderItemsMutation,
} from "../Order/orderItemsApiSlice.ts";

interface Row {
  id: number;
  product_name: string;
  quantity: number;
  price: string;
}

function OrderItemsView() {
  const { orderId } = useParams();
  const {
    data: orderDetails,
    isError,
    isLoading,
  } = useGetOrderItemsQuery(orderId as string);
  const order = useGetOrderQuery(orderId as string);
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [deleteOrderItems] = useRemoveOrderItemsMutation();
  const [updateOrderItems] = useUpdateOrderItemsMutation();

  const handleConfirmDeleteModalOpen = () => setOpenConfirmDeleteModal(true);
  const handleConfirmDeleteModalClose = () => setOpenConfirmDeleteModal(false);

  if (isLoading || order.isLoading) {
    return <Loading />;
  }

  if (isError || order.isError || !orderDetails || !order.data) {
    return <Error message={"Nie udało się pobrać danych zamówienia."} />;
  }

  const onDelete = async () => {
    if (selectedRows.length === 0) {
      toast.error("Nie wybrano zamówień do usunięcia.");
      return;
    }

    try {
      await toast.promise(
        Promise.all(selectedRows.map((id) => deleteOrderItems(id).unwrap())),
        {
          loading: `Usuwanie ${selectedRows.length >= 1 ? "elementu zamówienia" : "elementów zamówienia"}...`,
          success: `${selectedRows.length >= 1 ? "Element zamówienia został usunięty." : "Elementy zamówienia zostały ususnięte."}`,
          error: `Wystąpił błąd podczas usuwania ${selectedRows.length >= 1 ? "elementu zamówienia" : "elementów zamówienia."}.`,
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
          loading: "Aktualizowanie elementu zamówienia...",
          success: "Element zamówienia został zaktualizowany.",
          error: "Wystąpił błąd podczas aktualizowania elementu zamówienia.",
        },
      );
      return updatedRow;
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Nie udało się zaktualizować elementu zamówienia.");
      throw error;
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID produktu", width: 130 },
    {
      field: "product_name",
      headerName: "Nazwa produktu",
      width: 200,
      editable: true,
    },
    { field: "quantity", headerName: "Ilość", width: 130, editable: true },
    { field: "price", headerName: "Cena", width: 130, flex: 1, editable: true },
  ];

  const rows = orderDetails.map((orderDetail: OrderDetailsResponse) => ({
    id: orderDetail.order_item_id,
    product_name: orderDetail.product_name,
    quantity: orderDetail.quantity,
    price: orderDetail.price,
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
          Zamówienie #{order.data.order_id}
        </Typography>
      </Box>
      <Box>
        <Typography variant="h6" component="h2">
          Klient: {order.data.customer_name}
        </Typography>
        <Typography variant="h6" component="h2">
          Email: {order.data.customer_email}
        </Typography>
        <Typography variant="h6" component="h2">
          Telefon: {order.data.customer_phone}
        </Typography>
        <Typography variant="h6" component="h2">
          Adres dostawy: {order.data.customer_address}
        </Typography>
        <Typography variant="h6" component="h2">
          Data zamówienia: {getFormattedDate(order.data.order_date)}
        </Typography>
        <Typography variant="h6" component="h2">
          Status: {getPolishStatus(order.data.status as OrderStatuses)}
        </Typography>
        <Typography variant="h6" component="h2">
          Kwota: {order.data.total_amount} PLN
        </Typography>
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

export default OrderItemsView;
