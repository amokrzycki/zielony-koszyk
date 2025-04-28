import {
  useDeleteUsersMutation,
  useGetUsersQuery,
} from "../../Accounts/accountsApiSlice.ts";
import Loading from "../../common/Loading.tsx";
import ErrorView from "../../common/ErrorView.tsx";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  DataGrid,
  GridColDef,
  GridRowSelectionModel,
  GridToolbarColumnsButton,
  GridToolbarQuickFilter,
  Toolbar,
} from "@mui/x-data-grid";
import { Box, Button, IconButton, Typography } from "@mui/material";
import User from "../../../types/User.ts";
import { AddressType } from "@/enums/AddressType.ts";
import ConfirmDeleteModal from "../ConfirmDeleteModal.tsx";
import RefreshIcon from "@mui/icons-material/Refresh";
import { getFormattedDate } from "@/helpers/getFormattedDate.ts";
import { useAppDispatch } from "@/hooks/hooks.ts";
import { setUserToEdit } from "@/store/appSlice.ts";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";

function UsersView() {
  const { data: users, isError, isLoading, refetch } = useGetUsersQuery();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>({
      type: "include",
      ids: new Set<string>(),
    });
  const [deleteUsers] = useDeleteUsersMutation();

  const handleConfirmDeleteModalOpen = () => setOpenConfirmDeleteModal(true);
  const handleConfirmDeleteModalClose = () => setOpenConfirmDeleteModal(false);

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !users) {
    return <ErrorView message={"Nie udało się pobrać użytkowników."} />;
  }

  const onDelete = async () => {
    const ids = Array.from(rowSelectionModel.ids) as string[];
    if (ids.length === 0) {
      toast.error("Nie wybrano zamówień do usunięcia.");
      return;
    }

    try {
      await toast.promise(
        Promise.all(ids.map((id) => deleteUsers(id).unwrap())),
        {
          loading: `Usuwanie ${ids.length >= 1 ? "użytkownika" : "użytkowników"}...`,
          success: `${ids.length >= 1 ? "Użytkownik został usunięty." : "Użytkownicy zostali usunięci."}`,
          error: `Wystąpił błąd podczas usuwania ${ids.length >= 1 ? "użytkownika" : "użytkowników"}.`,
        }
      );
      setRowSelectionModel({ type: "include", ids: new Set<string>() });
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Nie udało się usunąć.");
    }
  };

  const handleEdit = (id: string) => {
    const user = users.find((user) => user.user_id === id);
    if (user) {
      dispatch(setUserToEdit(user));
      navigate("/admin/zarzadzanie-uzytkownikami/edycja-uzytkownika");
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 300 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "first_name", headerName: "Imię", width: 150 },
    { field: "last_name", headerName: "Nazwisko", width: 150 },
    { field: "phone", headerName: "Telefon", width: 150 },
    { field: "delivery_address", headerName: "Adres dostawy", width: 200 },
    { field: "billing_address", headerName: "Adres do faktury", width: 200 },
    { field: "role", headerName: "Rola", width: 150 },
    { field: "created_at", headerName: "Data utworzenia", width: 200 },
    { field: "updated_at", headerName: "Data aktualizacji", width: 200 },
    {
      field: "actions",
      headerName: "Akcje",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={() => handleEdit(params.row.id as string)}
        >
          Edytuj
        </Button>
      ),
    },
  ];

  const rows = users.map((user: User) => {
    const billingAddress = user.addresses.find(
      (address) => address.type === AddressType.BILLING
    );

    const shippingAddress = user.addresses.find(
      (address) => address.type === AddressType.DELIVERY
    );

    return {
      id: user.user_id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      delivery_address: `${shippingAddress?.street} ${shippingAddress?.building_number}${shippingAddress?.flat_number ? `/${shippingAddress?.flat_number}` : ""}, ${shippingAddress?.zip}, ${shippingAddress?.city}`,
      billing_address: `${billingAddress?.street} ${billingAddress?.building_number}${billingAddress?.flat_number ? `/${billingAddress?.flat_number}` : ""}, ${billingAddress?.zip}, ${billingAddress?.city}`,
      role: user.role,
      created_at: getFormattedDate(user.created_at),
      updated_at: getFormattedDate(user.updated_at),
    };
  });

  const CustomToolbar = () => {
    const ids = Array.from(rowSelectionModel.ids) as string[];
    return (
      <Toolbar className={"flex justify-between"}>
        <GridToolbarColumnsButton />
        <Button
          startIcon={<AddIcon />}
          onClick={() =>
            navigate("/admin/zarzadzanie-uzytkownikami/dodaj-uzytkownika")
          }
        >
          Dodaj użytkownika
        </Button>
        {ids.length > 0 && (
          <Button color="error" onClick={handleConfirmDeleteModalOpen}>
            Usuń zaznaczone ({ids.length})
          </Button>
        )}
        <GridToolbarQuickFilter debounceMs={300} />
      </Toolbar>
    );
  };

  return (
    <Box className={"flex flex-col overflow-x-auto w-full"}>
      <Box className={"flex items-center"}>
        <Typography variant="h4" component="h1">
          Użytkownicy
        </Typography>
        <IconButton onClick={() => refetch()} color="primary">
          <RefreshIcon />
        </IconButton>
      </Box>
      <Box className={"w-full overflow-x-auto"}>
        <DataGrid
          disableRowSelectionOnClick
          checkboxSelection
          showToolbar
          columns={columns}
          rows={rows}
          rowHeight={40}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          sx={{ border: 0 }}
          slots={{ toolbar: CustomToolbar }}
          initialState={{
            sorting: {
              sortModel: [{ field: "id", sort: "asc" }],
            },
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={setRowSelectionModel}
        />
      </Box>
      <ConfirmDeleteModal
        open={openConfirmDeleteModal}
        handleClose={handleConfirmDeleteModalClose}
        onConfirm={onDelete}
        count={rowSelectionModel.ids.size}
      />
    </Box>
  );
}

export default UsersView;
