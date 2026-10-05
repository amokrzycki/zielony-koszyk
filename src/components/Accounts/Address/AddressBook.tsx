import { useAppDispatch, useAppSelector } from "@/hooks/hooks.ts";
import LoadingOverlay from "@/components/common/LoadingOverlay.tsx";
import { Box, Button, Typography } from "@mui/material";
import AddRounded from "@mui/icons-material/AddRounded";
import ReceiptLongOutlined from "@mui/icons-material/ReceiptLongOutlined";
import LocalShippingOutlined from "@mui/icons-material/LocalShippingOutlined";
import PlaceOutlined from "@mui/icons-material/PlaceOutlined";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocalePath } from "@/i18n/useLocale.ts";
import type { ReactNode } from "react";
import type User from "@/types/User.ts";
import type { Address } from "@/types/Address.ts";
import { clearAddressToEdit, setAddressToEdit } from "@/store/appSlice.ts";
import { AddressType } from "@/enums/AddressType.ts";
import AddressBox from "@/components/Accounts/Address/AddressBox.tsx";
import DefaultCheckbox from "@/components/Accounts/Address/DefaultCheckbox.tsx";
import { useGetAddressesQuery } from "@/components/Accounts/accountsApiSlice.ts";
import { useEffect } from "react";
import { updateUserDetails } from "@/components/Accounts/accountSlice.ts";
import { accentText, ctaButtonSx, sectionHeadingSx, tone } from "@/components/listingStyles.ts";

function AddressSection({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <Box component="section" sx={{ mt: { xs: 4, md: 5 } }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
        <Box
          aria-hidden
          sx={{
            display: "grid",
            placeItems: "center",
            width: 36,
            height: 36,
            flexShrink: 0,
            borderRadius: "50%",
            bgcolor: (t) => tone(t, 0.12),
            color: (t) => accentText(t),
            "& svg": { fontSize: 19 },
          }}>
          {icon}
        </Box>
        <Typography component="h2" sx={{ ...sectionHeadingSx, mb: 0 }}>
          {title}
        </Typography>
      </Box>
      {children}
    </Box>
  );
}

function AddressGrid({
  addresses,
  onEdit,
  userId,
}: {
  addresses: Address[];
  onEdit: (a: Address) => void;
  userId: string;
}) {
  const { t } = useTranslation("account");
  if (addresses.length === 0) {
    return (
      <Box
        sx={{
          mt: 2,
          px: 2.5,
          py: 3,
          borderRadius: "16px",
          textAlign: "center",
          bgcolor: (t) => tone(t, 0.05),
          color: "text.secondary",
          fontSize: "0.9rem",
          lineHeight: 1.5,
        }}>
        {t("addressBook.noneOfType")}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        mt: 2,
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
        gap: 2,
        alignItems: "stretch",
      }}>
      {addresses.map((address) => (
        <AddressBox
          key={address.address_id}
          address={address}
          onEdit={onEdit}
          checkBox={<DefaultCheckbox address={address} userId={userId} />}
        />
      ))}
    </Box>
  );
}

function AddressBook() {
  const user: User = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation("account");
  const to = useLocalePath();
  const { data, isLoading } = useGetAddressesQuery(user.user_id);

  useEffect(() => {
    if (data && data !== user.addresses) {
      const updatedDetails: User = {
        ...user,
        addresses: data,
      };
      dispatch(updateUserDetails(updatedDetails));
    }
  }, [data, user, dispatch]);

  const handleAddNew = () => {
    dispatch(clearAddressToEdit());
    navigate(to("accountAddressAdd"));
  };

  const handleEditData = (address: Address) => {
    dispatch(setAddressToEdit(address));
    navigate(to("accountAddressEdit"));
  };

  // Query data wins: the copy on the session user can be stale (it briefly rendered duplicated cards).
  const addresses = data ?? user.addresses ?? [];

  if (isLoading) {
    return <LoadingOverlay />;
  }

  const byDefaultFirst = (a: Address, b: Address) => Number(b.default) - Number(a.default);
  const billingAddresses = addresses.filter((a) => a.type === AddressType.BILLING).sort(byDefaultFirst);
  const deliveryAddresses = addresses.filter((a) => a.type === AddressType.DELIVERY).sort(byDefaultFirst);
  const isEmpty = addresses.length === 0;

  return (
    <div className="fade-in">
      <Box sx={{ maxWidth: 860, mx: "auto", textAlign: "left" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              component="h1"
              sx={{
                m: 0,
                fontSize: { xs: "1.7rem", md: "2.05rem" },
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
              }}>
              {t("addressBook.title")}
            </Typography>
            <Typography sx={{ mt: 1, color: "text.secondary", maxWidth: "54ch", lineHeight: 1.6 }}>
              {t("addressBook.subtitle")}
            </Typography>
          </Box>
          {!isEmpty && (
            <Button onClick={handleAddNew} startIcon={<AddRounded />} sx={{ ...ctaButtonSx, flexShrink: 0 }}>
              {t("addressBook.addNew")}
            </Button>
          )}
        </Box>

        {isEmpty ? (
          <Box
            sx={(theme) => ({
              mt: { xs: 3, md: 3.5 },
              px: { xs: 3, sm: 4 },
              py: { xs: 5, sm: 6 },
              borderRadius: "24px",
              textAlign: "center",
              bgcolor: tone(theme, 0.05),
            })}>
            <Box
              aria-hidden
              sx={{
                display: "grid",
                placeItems: "center",
                width: 56,
                height: 56,
                mx: "auto",
                borderRadius: "50%",
                color: (t) => accentText(t),
                bgcolor: (t) => tone(t, 0.12),
                "& svg": { fontSize: 28 },
              }}>
              <PlaceOutlined />
            </Box>
            <Typography component="h2" sx={{ ...sectionHeadingSx, mt: 2, mb: 0 }}>
              {t("addressBook.emptyTitle")}
            </Typography>
            <Typography sx={{ mt: 0.75, mx: "auto", maxWidth: "42ch", color: "text.secondary", lineHeight: 1.6 }}>
              {t("addressBook.emptyText")}
            </Typography>
            <Button onClick={handleAddNew} startIcon={<AddRounded />} sx={{ ...ctaButtonSx, mt: 3 }}>
              {t("addressBook.addFirst")}
            </Button>
          </Box>
        ) : (
          <>
            <AddressSection icon={<ReceiptLongOutlined />} title={t("addressBook.billing")}>
              <AddressGrid addresses={billingAddresses} onEdit={handleEditData} userId={user.user_id} />
            </AddressSection>

            <AddressSection icon={<LocalShippingOutlined />} title={t("addressBook.delivery")}>
              <AddressGrid addresses={deliveryAddresses} onEdit={handleEditData} userId={user.user_id} />
            </AddressSection>
          </>
        )}
      </Box>
    </div>
  );
}

export default AddressBook;
