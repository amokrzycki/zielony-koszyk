import { Box, CircularProgress, IconButton } from "@mui/material";
import { useGetProductsQuery } from "../Products/productsApiSlice.ts";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import Product from "../../types/Product.ts";
import capitalizeFirstLetter from "../../utils/capitalizeFirstLetter.ts";
import { getFormattedDate } from "../../utils/getFormattedDate.ts";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

function AdminProductsView() {
  const { data: products, isError, isLoading } = useGetProductsQuery({});

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <Box>Wystąpił błąd podczas pobierania produktów.</Box>;
  }

  const handleEdit = (id: number) => {
    console.log(`Edit product with id: ${id}`);
  };

  const handleDelete = (id: number) => {
    console.log(`Delete product with id: ${id}`);
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Nazwa", width: 200 },
    { field: "category", headerName: "Kategoria", width: 150 },
    {
      field: "price",
      headerName: "Cena",
      width: 120,
      sortComparator: (v1, v2) => v1 - v2,
    },
    { field: "stock_quantity", headerName: "Stan", width: 100 },
    { field: "created_at", headerName: "Data dodania", width: 150 },
    { field: "description", headerName: "Opis", width: 350 },
    {
      field: "actions",
      headerName: "Akcje",
      width: 120,
      disableExport: true,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => handleEdit(params.row.id as number)}
            title="Edytuj"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(params.row.id as number)}
            title="Usuń"
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const rows = products.map((product: Product) => ({
    id: product.product_id,
    name: product.name,
    category: capitalizeFirstLetter(product.category),
    price: product.price,
    stock_quantity: product.stock_quantity,
    created_at: getFormattedDate(product.created_at.toString()),
    description: product.description,
  }));

  return (
    <Box className={"w-full overflow-x-auto"}>
      <DataGrid
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        disableRowSelectionOnClick
        checkboxSelection
        columns={columns}
        rows={rows}
        pageSizeOptions={[5, 10, 25, 50, 100]}
        sx={{ border: 0 }}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
      />
    </Box>
  );
}

export default AdminProductsView;
