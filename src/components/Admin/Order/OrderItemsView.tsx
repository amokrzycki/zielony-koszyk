import { useNavigate, useParams } from "react-router-dom";
import { useGetOrderQuery } from "../../Order/orderApiSlice.ts";
import { Box, Button, Typography } from "@mui/material";
import Loading from "../../common/Loading.tsx";
import {
  DataGrid,
  GridColDef,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { OrderItemResponse } from "@/types/OrderItemResponse.ts";
import ConfirmDeleteModal from "../ConfirmDeleteModal.tsx";
import { useState } from "react";
import toast from "react-hot-toast";
import ErrorView from "../../common/ErrorView.tsx";
import { getFormattedDate } from "@/helpers/getFormattedDate.ts";
import { getPolishStatus } from "@/helpers/getPolishStatus.ts";
import {
  useGetOrderItemsQuery,
  useRemoveOrderItemsMutation,
  useUpdateOrderItemsMutation,
} from "../../Order/orderItemsApiSlice.ts";
import AddIcon from "@mui/icons-material/Add";
import AddOrderItemsModal from "./AddOrderItemsModal.tsx";
import OrderAddresses from "@/components/Accounts/Order/OrderAddresses.tsx";
import InvoiceDownloadButton from "@/components/Order/InvoiceDownloadButton.tsx";

interface Row {
  id: number;
  product_name: string;
  quantity: number;
  price: string;
}

// TODO: Add modal to edit order

function OrderItemsView() {
  const { orderId } = useParams();
  const {
    data: orderDetails,
    isError,
    isLoading,
  } = useGetOrderItemsQuery(orderId as string);
  const {
    data: order,
    isLoading: isOrderLoading,
    isError: isOrderError,
  } = useGetOrderQuery(orderId as string);
  const [openProductModal, setOpenProductModal] = useState(false);
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [deleteOrderItems] = useRemoveOrderItemsMutation();
  const [updateOrderItems] = useUpdateOrderItemsMutation();
  const navigate = useNavigate();

  const handleConfirmDeleteModalOpen = () => setOpenConfirmDeleteModal(true);
  const handleConfirmDeleteModalClose = () => setOpenConfirmDeleteModal(false);
  const handleProductModalOpen = () => setOpenProductModal(true);
  const handleProductModalClose = () => setOpenProductModal(false);

  if (isLoading || isOrderLoading) {
    return <Loading />;
  }

  if (isError || isOrderError || !orderDetails || !order) {
    return <ErrorView message={"Nie udało się pobrać danych zamówienia."} />;
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
          success: `${selectedRows.length >= 1 ? "Element zamówienia został usunięty." : "Elementy zamówienia zostały usunięte."}`,
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
    { field: "price", headerName: "Cena", width: 130, editable: true },
    {
      field: "total",
      headerName: "Suma pozycji",
      width: 130,
    },
  ];

  const rows = orderDetails.map((orderDetail: OrderItemResponse) => ({
    id: orderDetail.order_item_id,
    product_name: orderDetail.product_name,
    quantity: orderDetail.quantity,
    price: orderDetail.price,
    total: (orderDetail.quantity * parseFloat(orderDetail.price)).toFixed(2),
  }));

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer className={"flex justify-between"}>
        <GridToolbarColumnsButton />
        <Button startIcon={<AddIcon />} onClick={handleProductModalOpen}>
          Dodaj produkt
        </Button>
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
          Zamówienie #{order.order_id}
        </Typography>
      </Box>
      <Box>
        <Box className={"flex gap-4 my-4"}>
          <OrderAddresses order={order} />
          <Box className={"flex gap-4 justify-end items-center flex-col"}>
            <Button
              variant={"outlined"}
              size={"small"}
              onClick={() => navigate("edycja-danych-zamowienia")}
            >
              Edytuj dane zamówienia
            </Button>
            <InvoiceDownloadButton orderId={order.order_id} />
          </Box>
        </Box>
        <Typography variant="h6" component="h2">
          Data zamówienia: {getFormattedDate(order.order_date)}
        </Typography>
        <Typography variant="h6" component="h2">
          Status: {getPolishStatus(order.status)}
        </Typography>
        <Typography variant="h6" component="h2">
          Kwota: {order.total_amount} PLN
        </Typography>
      </Box>
      <Box className={"w-full overflow-x-auto mt-4"}>
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
      <AddOrderItemsModal
        open={openProductModal}
        handleClose={handleProductModalClose}
        orderId={order.order_id}
      />
    </Box>
  );
}

export default OrderItemsView;
