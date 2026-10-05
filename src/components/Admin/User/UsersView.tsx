import { useDeleteUsersMutation, useGetUsersQuery } from "../../Accounts/accountsApiSlice.ts";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { DataGrid, type GridColDef, type GridRowSelectionModel } from "@mui/x-data-grid";
import { Box, Button, IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import GroupOutlined from "@mui/icons-material/GroupOutlined";
import type User from "../../../types/User.ts";
import { AddressType } from "@/enums/AddressType.ts";
import ConfirmDeleteModal from "../ConfirmDeleteModal.tsx";
import { useFormat, useLocalePath } from "@/i18n/useLocale.ts";
import { useApiError, useGridLocaleText } from "../useAdminI18n.ts";
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
  const { t } = useTranslation("admin");
  const format = useFormat();
  const to = useLocalePath();
  const apiError = useApiError();
  const localeText = useGridLocaleText();
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
      toast.error(t("users.delete.none"));
      return;
    }

    try {
      await toast.promise(Promise.all(ids.map((id) => deleteUsers(id).unwrap())), {
        loading: t("users.delete.loading", { count: ids.length }),
        success: t("users.delete.success", { count: ids.length }),
        error: (error) => apiError(error, t("users.delete.error", { count: ids.length })),
      });
      setRowSelectionModel({ type: "include", ids: new Set<string>() });
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(t("general.deleteFailed"));
    }
  };

  const handleEdit = (id: string) => {
    const user = users?.find((user) => user.user_id === id);
    if (user) {
      dispatch(setUserToEdit(user));
      navigate(to("adminUserEdit"));
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: handleEdit only reads `users` and stable setters
  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: "id",
        headerName: t("users.columns.id"),
        width: 190,
        renderCell: (params) => <Box sx={monoCellSx}>{params.value}</Box>,
      },
      { field: "email", headerName: t("users.columns.email"), flex: 1, minWidth: 220 },
      { field: "first_name", headerName: t("users.columns.firstName"), width: 130 },
      { field: "last_name", headerName: t("users.columns.lastName"), width: 150 },
      { field: "phone", headerName: t("users.columns.phone"), width: 140 },
      { field: "delivery_address", headerName: t("users.columns.deliveryAddress"), width: 240 },
      { field: "role", headerName: t("users.columns.role"), width: 150 },
      {
        field: "created_at",
        headerName: t("users.columns.createdAt"),
        width: 170,
        type: "dateTime",
        valueFormatter: (value: Date) => format.dateTime(value),
      },
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
            {t("actions.edit", { ns: "common" })}
          </Button>
        ),
      },
    ],
    [t, format, users, to],
  );

  const rows = useMemo(
    () =>
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
          role: t(`roles.${user.role}`),
          created_at: new Date(user.created_at),
        };
      }) ?? [],
    [users, t],
  );

  const selectedCount = rowSelectionModel.ids.size;

  const CustomToolbar = () => (
    <AdminTableToolbar
      selectedCount={selectedCount}
      onDeleteSelected={handleConfirmDeleteModalOpen}
      addAction={{
        label: t("users.add"),
        icon: <AddIcon />,
        onClick: () => navigate(to("adminUserAdd")),
      }}
    />
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%", minWidth: 0 }}>
      <AdminPageHeader
        icon={<GroupOutlined />}
        title={t("users.title")}
        subtitle={t("users.subtitle")}
        actions={
          <IconButton
            onClick={() => refetch()}
            aria-label={t("users.refresh")}
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
        <AdminError message={t("users.loadError.message")} hint={t("users.loadError.hint")} onRetry={() => refetch()} />
      ) : isLoading ? (
        <AdminLoading rows={7} />
      ) : (
        <Box className="fade-in" sx={(theme) => ({ ...adminPanelSx(theme), width: "100%" })}>
          <DataGrid
            disableRowSelectionOnClick
            checkboxSelection
            showToolbar
            columns={columns}
            rows={rows}
            rowHeight={52}
            localeText={localeText}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            sx={adminGridSx}
            slots={{
              toolbar: CustomToolbar,
              noRowsOverlay: () => (
                <AdminEmpty icon={<GroupOutlined />} title={t("users.empty.title")} hint={t("users.empty.hint")} />
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
        entity="users"
        open={openConfirmDeleteModal}
        handleClose={handleConfirmDeleteModalClose}
        onConfirm={onDelete}
        count={selectedCount}
      />
    </Box>
  );
}

export default UsersView;
