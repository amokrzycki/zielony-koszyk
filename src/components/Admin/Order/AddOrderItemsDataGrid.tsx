import { useGetProductsQuery } from "../../Products/productsApiSlice.ts";
import ErrorView from "../../common/ErrorView.tsx";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import type Product from "../../../types/Product.ts";
import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import { useCreateOrderItemsMutation } from "../../Order/orderItemsApiSlice.ts";
import type { OrderItemCreate } from "@/types/OrderItemCreate.ts";
import { type MouseEvent, useState } from "react";
import toast from "react-hot-toast";
import Reveal from "@/components/common/Reveal.tsx";
import { adminGridSx, adminPanelSx, moneyCellSx } from "../adminStyles.ts";
import { EASE, accentText, tone } from "@/components/listingStyles.ts";

interface AddOrderItemsDataGridProps {
  orderId: number;
  handleClose: () => void;
}

function AddOrderItemsDataGrid({ orderId, handleClose }: AddOrderItemsDataGridProps) {
  const { data: products, isError, isLoading } = useGetProductsQuery();
  const [orderItems, setOrderItems] = useState<OrderItemCreate[]>([]);
  const [createOrderItems] = useCreateOrderItemsMutation();

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "name", headerName: "Nazwa", flex: 1, minWidth: 180 },
    { field: "category", headerName: "Kategoria", width: 140 },
    {
      field: "price",
      headerName: "Cena",
      width: 110,
      renderCell: (params) => (
        <Box component="span" sx={moneyCellSx}>
          {params.value} zł
        </Box>
      ),
    },
    { field: "stock_quantity", headerName: "Stan", width: 90 },
    { field: "quantity", headerName: "Ilość", width: 90, editable: true, type: "number" },
    {
      field: "add",
      headerName: "",
      sortable: false,
      disableColumnMenu: true,
      width: 130,
      renderCell: (params) => (
        <Button
          variant="text"
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
            setOrderItems((current) => [...current, orderItem]);
          }}
          sx={(theme) => ({
            borderRadius: "999px",
            fontWeight: 700,
            fontSize: "0.82rem",
            color: accentText(theme),
            "&:hover": { backgroundColor: tone(theme, 0.1) },
          })}>
          Wybierz
        </Button>
      ),
    },
  ];

  const rows =
    products?.map((product: Product) => ({
      id: product.product_id,
      name: product.name,
      category: product.category,
      price: product.price,
      stock_quantity: product.stock_quantity,
      quantity: 1,
    })) ?? [];

  const handleRemoveItem = (event: MouseEvent<HTMLButtonElement>, productId: number) => {
    const row = event.currentTarget.parentElement;
    if (!row || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOrderItems((items) => items.filter((item) => item.product_id !== productId));
      return;
    }
    row.animate(
      [
        { opacity: 1, transform: "translateX(0)" },
        { opacity: 0, transform: "translateX(-6px)" },
      ],
      { duration: 120, easing: EASE, fill: "forwards" },
    ).onfinish = () => setOrderItems((items) => items.filter((item) => item.product_id !== productId));
  };

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

  if (isError || !products) {
    return <ErrorView message={"Wystąpił błąd podczas pobierania produktów."} />;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      {orderItems.length > 0 && (
        <Reveal>
          <Box
            sx={(theme) => ({
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "16px",
              bgcolor: tone(theme, 0.05),
              p: 2,
            })}>
            <Typography sx={{ fontWeight: 800, fontSize: "0.95rem", mb: 1 }}>
              Wybrane produkty ({orderItems.length})
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
              {orderItems.map((orderItem) => (
                <Box key={orderItem.product_id} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Typography sx={{ flex: 1, fontSize: "0.9rem" }}>
                    {orderItem.product_name} · {orderItem.quantity} szt.
                  </Typography>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteOutline />}
                    onClick={(event) => handleRemoveItem(event, orderItem.product_id)}
                    sx={{ borderRadius: "999px", fontWeight: 700, fontSize: "0.8rem" }}>
                    Usuń
                  </Button>
                </Box>
              ))}
            </Box>
          </Box>
        </Reveal>
      )}

      <Box sx={(theme) => ({ ...adminPanelSx(theme), width: "100%" })}>
        <DataGrid
          disableRowSelectionOnClick
          columns={columns}
          rows={rows}
          loading={isLoading}
          rowHeight={52}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          sx={{ ...adminGridSx, height: 460 }}
          initialState={{
            sorting: { sortModel: [{ field: "id", sort: "asc" }] },
            pagination: { paginationModel: { pageSize: 10 } },
          }}
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          disabled={orderItems.length === 0}
          onClick={handleAddProducts}
          sx={{ borderRadius: "999px", fontWeight: 700 }}>
          Dodaj wybrane produkty ({orderItems.length})
        </Button>
      </Box>
    </Box>
  );
}

export default AddOrderItemsDataGrid;
