import { useDeleteUsersMutation, useGetUsersQuery } from "../../Accounts/accountsApiSlice.ts";
import { useState } from "react";
import toast from "react-hot-toast";
import { DataGrid, type GridColDef, type GridRowSelectionModel } from "@mui/x-data-grid";
import { Box, Button, IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import GroupOutlined from "@mui/icons-material/GroupOutlined";
import type User from "../../../types/User.ts";
import { AddressType } from "@/enums/AddressType.ts";
import ConfirmDeleteModal from "../ConfirmDeleteModal.tsx";
import { getFormattedDate } from "@/helpers/getFormattedDate.ts";
import { useAppDispatch } from "@/hooks/hooks.ts";
import { setUserToEdit } from "@/store/appSlice.ts";
import { useNavigate } from "react-router-dom";
import { adminGridSx, adminPanelSx, monoCellSx } from "../adminStyles.ts";
import AdminPageHeader from "../AdminPageHeader.tsx";
import AdminTableToolbar from "../AdminTableToolbar.tsx";
import AdminError from "../AdminError.tsx";
import AdminEmpty from "../AdminEmpty.tsx";
import AdminLoading from "../AdminLoading.tsx";
import { EASE, accentText, ghostButtonSx, tone } from "@/components/listingStyles.ts";

function UsersView() {
  const { data: users, isError, isLoading, refetch } = useGetUsersQuery();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>({
    type: "include",
    ids: new Set<string>(),
  });
  const [deleteUsers] = useDeleteUsersMutation();

  const handleConfirmDeleteModalOpen = () => setOpenConfirmDeleteModal(true);
  const handleConfirmDeleteModalClose = () => setOpenConfirmDeleteModal(false);

  const onDelete = async () => {
    const ids = Array.from(rowSelectionModel.ids) as string[];
    if (ids.length === 0) {
      toast.error("Nie wybrano użytkowników do usunięcia.");
      return;
    }

    try {
      await toast.promise(Promise.all(ids.map((id) => deleteUsers(id).unwrap())), {
        loading: `Usuwanie ${ids.length > 1 ? "użytkowników" : "użytkownika"}...`,
        success: `${ids.length > 1 ? "Użytkownicy zostali usunięci." : "Użytkownik został usunięty."}`,
        error: `Wystąpił błąd podczas usuwania ${ids.length > 1 ? "użytkowników" : "użytkownika"}.`,
      });
      setRowSelectionModel({ type: "include", ids: new Set<string>() });
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Nie udało się usunąć.");
    }
  };

  const handleEdit = (id: string) => {
    const user = users?.find((user) => user.user_id === id);
    if (user) {
      dispatch(setUserToEdit(user));
      navigate("/admin/zarzadzanie-uzytkownikami/edycja-uzytkownika");
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 190, renderCell: (params) => <Box sx={monoCellSx}>{params.value}</Box> },
    { field: "email", headerName: "E-mail", flex: 1, minWidth: 220 },
    { field: "first_name", headerName: "Imię", width: 130 },
    { field: "last_name", headerName: "Nazwisko", width: 150 },
    { field: "phone", headerName: "Telefon", width: 140 },
    { field: "delivery_address", headerName: "Adres dostawy", width: 240 },
    { field: "role", headerName: "Rola", width: 130 },
    { field: "created_at", headerName: "Utworzono", width: 120 },
    {
      field: "actions",
      headerName: "",
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleEdit(params.row.id as string)}
          sx={(theme) => ({ ...ghostButtonSx(theme), px: 2, py: 0.5, fontSize: "0.82rem" })}>
          Edytuj
        </Button>
      ),
    },
  ];

  const rows =
    users?.map((user: User) => {
      const billingAddress = user.addresses.find((address) => address.type === AddressType.BILLING);
      const shippingAddress = user.addresses.find((address) => address.type === AddressType.DELIVERY);

      const formatAddress = (address?: (typeof user.addresses)[number]) => {
        if (!address?.street) return "—";
        const flat = address.flat_number ? `/${address.flat_number}` : "";
        const tail = [address.zip, address.city].filter(Boolean).join(", ");
        return [address.street, `${address.building_number ?? ""}${flat}`.trim(), tail].filter(Boolean).join(" ");
      };

      return {
        id: user.user_id,
        email: user.email,
        first_name: user.first_name || "—",
        last_name: user.last_name || "—",
        phone: user.phone || "—",
        delivery_address: formatAddress(shippingAddress),
        billing_address: formatAddress(billingAddress),
        role: user.role,
        created_at: getFormattedDate(user.created_at),
      };
    }) ?? [];

  const selectedCount = rowSelectionModel.ids.size;

  const CustomToolbar = () => (
    <AdminTableToolbar
      selectedCount={selectedCount}
      onDeleteSelected={handleConfirmDeleteModalOpen}
      addAction={{
        label: "Dodaj użytkownika",
        icon: <AddIcon />,
        onClick: () => navigate("/admin/zarzadzanie-uzytkownikami/dodaj-uzytkownika"),
      }}
    />
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%", minWidth: 0 }}>
      <AdminPageHeader
        icon={<GroupOutlined />}
        title="Użytkownicy"
        subtitle="Konta klientów, ich adresy oraz role w sklepie."
        actions={
          <IconButton
            onClick={() => refetch()}
            aria-label="Odśwież listę użytkowników"
            sx={(theme) => ({
              border: "1px solid",
              borderColor: "divider",
              color: "text.secondary",
              transition: `color 200ms ${EASE}, border-color 200ms ${EASE}, background-color 200ms ${EASE}`,
              "&:hover": { color: accentText(theme), borderColor: accentText(theme), bgcolor: tone(theme, 0.08) },
            })}>
            <RefreshIcon fontSize="small" />
          </IconButton>
        }
      />

      {isError ? (
        <AdminError
          message="Nie udało się pobrać użytkowników."
          hint="Sprawdź połączenie i odśwież listę."
          onRetry={() => refetch()}
        />
      ) : isLoading ? (
        <AdminLoading rows={7} />
      ) : (
        <Box sx={(theme) => ({ ...adminPanelSx(theme), width: "100%" })}>
          <DataGrid
            disableRowSelectionOnClick
            checkboxSelection
            showToolbar
            columns={columns}
            rows={rows}
            rowHeight={52}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            sx={adminGridSx}
            slots={{
              toolbar: CustomToolbar,
              noRowsOverlay: () => (
                <AdminEmpty
                  icon={<GroupOutlined />}
                  title="Brak użytkowników"
                  hint="Konta klientów pojawią się tutaj po rejestracji."
                />
              ),
            }}
            initialState={{
              sorting: { sortModel: [{ field: "id", sort: "asc" }] },
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            rowSelectionModel={rowSelectionModel}
            onRowSelectionModelChange={setRowSelectionModel}
          />
        </Box>
      )}

      <ConfirmDeleteModal
        open={openConfirmDeleteModal}
        handleClose={handleConfirmDeleteModalClose}
        onConfirm={onDelete}
        count={selectedCount}
      />
    </Box>
  );
}

export default UsersView;
