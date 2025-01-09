import { useGetProductsQuery } from "../../Products/productsApiSlice.ts";
import { useState } from "react";
import Error from "../../common/Error.tsx";
import Loading from "../../common/Loading.tsx";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import Product from "../../../types/Product.ts";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

// interface Row {
//   id: number;
//   name: string;
//   category: string;
//   price: number;
//   stock_quantity: number;
// }

function AddOrderItemsDataGrid() {
  const { data: products, isError, isLoading } = useGetProductsQuery();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

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
  ];

  const rows = products.map((product: Product) => ({
    id: product.product_id,
    name: product.name,
    category: product.category,
    price: product.price,
    stock_quantity: product.stock_quantity,
    quantity: 1,
  }));

  // TODO: Add possibility to add selected products to order with quantity
  const handleAddProducts = () => {
    const selectedProducts: Product[] = [];
    selectedRows.forEach((row) => {
      selectedProducts.push(products[row]);
    });
    console.log(selectedProducts);
  };

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer className={"flex justify-between"}>
        {selectedRows.length > 0 && (
          <Button
            startIcon={<AddIcon />}
            variant={"text"}
            color="primary"
            onClick={handleAddProducts}
          >
            Dodaj produkty do zamówienia ({selectedRows.length})
          </Button>
        )}
        <GridToolbarQuickFilter debounceMs={300} />
      </GridToolbarContainer>
    );
  };

  return (
    <Box className={"flex flex-col overflow-x-auto w-full"}>
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
          onRowSelectionModelChange={(newSelection) =>
            setSelectedRows(newSelection as number[])
          }
        />
      </Box>
    </Box>
  );
}

export default AddOrderItemsDataGrid;
