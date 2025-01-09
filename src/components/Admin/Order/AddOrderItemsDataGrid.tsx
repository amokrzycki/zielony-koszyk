import { useGetProductsQuery } from "../../Products/productsApiSlice.ts";
import Error from "../../common/Error.tsx";
import Loading from "../../common/Loading.tsx";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import Product from "../../../types/Product.ts";
import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useCreateOrderItemsMutation } from "../../Order/orderItemsApiSlice.ts";
import { OrderItemCreate } from "../../../types/OrderItemCreate.ts";
import { useState } from "react";
import toast from "react-hot-toast";

interface AddOrderItemsDataGridProps {
  orderId: number;
  handleClose: () => void;
}

function AddOrderItemsDataGrid({
  orderId,
  handleClose,
}: AddOrderItemsDataGridProps) {
  const { data: products, isError, isLoading } = useGetProductsQuery();
  const [orderItems, setOrderItems] = useState<OrderItemCreate[]>([]);
  const [createOrderItems] = useCreateOrderItemsMutation();

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !products) {
    return <Error message={"Wystąpił błąd podczas pobierania produktów."} />;
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Nazwa", width: 200 },
    { field: "category", headerName: "Kategoria", width: 150 },
    {
      field: "price",
      headerName: "Cena",
      width: 120,
      sortComparator: (v1, v2) => v1 - v2,
    },
    {
      field: "stock_quantity",
      headerName: "Stan magazynowy",
      width: 100,
    },
    {
      field: "quantity",
      headerName: "Ilość",
      width: 100,
      editable: true,
    },
    {
      field: "Akcje",
      headerName: "Akcje",
      sortable: false,
      width: 200,
      renderCell: (params) => {
        return (
          <Button
            variant="text"
            color="primary"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => {
              const orderItem = {
                order_id: orderId,
                product_id: params.row.id,
                product_name: params.row.name,
                quantity: params.row.quantity,
                price: params.row.price,
              };
              setOrderItems([...orderItems, orderItem]);
            }}
          >
            Wybierz
          </Button>
        );
      },
    },
  ];

  const rows = products.map((product: Product) => ({
    id: product.product_id,
    name: product.name,
    category: product.category,
    price: product.price,
    stock_quantity: product.stock_quantity,
    quantity: 1,
  }));

  const handleAddProducts = () => {
    toast
      .promise(createOrderItems(orderItems).unwrap(), {
        loading: `Dodawanie produktów do zamówienia nr ${orderId}...`,
        success: `Produkty zostały dodane do zamówienia nr ${orderId}.`,
        error: "Wystąpił błąd podczas dodawania produktów.",
      })
      .then(() => {
        setOrderItems([]);
        handleClose();
      });
  };

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer className={"flex justify-between"}>
        <GridToolbarQuickFilter debounceMs={300} />
      </GridToolbarContainer>
    );
  };

  return (
    <>
      {orderItems.length > 0 && (
        <Box className={"mb-4"}>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Wybrane produkty
          </Typography>
          {orderItems.map((orderItem) => (
            <Box key={orderItem.product_id} className={"flex items-center"}>
              <Typography variant="body1" sx={{ mr: 2 }}>
                {orderItem.product_name} - {orderItem.quantity} szt.
              </Typography>
              <Button
                variant="text"
                color="error"
                size="small"
                onClick={() => {
                  setOrderItems(
                    orderItems.filter(
                      (item) => item.product_id !== orderItem.product_id,
                    ),
                  );
                }}
              >
                Usuń
              </Button>
            </Box>
          ))}
        </Box>
      )}

      <Box className={"flex flex-col overflow-x-auto w-full"}>
        <Box className={"w-full overflow-x-auto"}>
          <DataGrid
            disableRowSelectionOnClick
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
          />
        </Box>
        {orderItems.length > 0 && (
          <Button variant="text" color="primary" onClick={handleAddProducts}>
            Dodaj wybrane produkty ({orderItems.length})
          </Button>
        )}
      </Box>
    </>
  );
}

export default AddOrderItemsDataGrid;
