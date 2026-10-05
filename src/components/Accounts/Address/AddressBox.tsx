import type { Address } from "@/types/Address.ts";
import { Box, Button, Typography } from "@mui/material";
import CorporateFareOutlined from "@mui/icons-material/CorporateFareOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import PersonOutlineOutlined from "@mui/icons-material/PersonOutlineOutlined";
import PhoneOutlined from "@mui/icons-material/PhoneOutlined";
import PlaceOutlined from "@mui/icons-material/PlaceOutlined";
import { CustomerType } from "@/enums/CustomerType.ts";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { accentText, ghostButtonSx, panelSx, tone } from "@/components/listingStyles.ts";

interface AddressBoxProps {
  address: Address;
  onEdit: (address: Address) => void;
  checkBox: ReactNode;
}

const lineSx = {
  display: "flex",
  alignItems: "flex-start",
  gap: 0.75,
  color: "text.secondary",
  fontSize: "0.9rem",
  lineHeight: 1.5,
} as const;

function AddressBox({ address, onEdit, checkBox }: AddressBoxProps) {
  const { t } = useTranslation("account");
  const isCompany = address.customer_type === CustomerType.COMPANY;
  const name = isCompany ? address.company_name : `${address.first_name ?? ""} ${address.last_name ?? ""}`.trim();

  return (
    <Box
      component="article"
      sx={(theme) => ({
        ...panelSx(theme),
        display: "flex",
        flexDirection: "column",
        height: "100%",
        p: { xs: 2, sm: 2.5 },
      })}>
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.25 }}>
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
          {isCompany ? <CorporateFareOutlined /> : <PersonOutlineOutlined />}
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            sx={{
              fontSize: "1.05rem",
              fontWeight: 800,
              letterSpacing: "-0.01em",
              lineHeight: 1.3,
              overflowWrap: "anywhere",
            }}>
            {name}
          </Typography>
          {isCompany && (
            <Typography sx={{ mt: 0.25, color: "text.secondary", fontSize: "0.85rem", lineHeight: 1.4 }}>
              {t("addressBox.nip", { nip: address.nip })}
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, mt: 2 }}>
        <Box sx={lineSx}>
          <PhoneOutlined sx={{ fontSize: 16, mt: "2px", flexShrink: 0 }} />
          <Box component="span">{address.phone}</Box>
        </Box>
        <Box sx={lineSx}>
          <PlaceOutlined sx={{ fontSize: 16, mt: "2px", flexShrink: 0 }} />
          <Box component="span">
            {address.street} {address.building_number}
            {address.flat_number ? `/${address.flat_number}` : ""}
            <br />
            {address.zip} {address.city}
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          flexWrap: "wrap",
          mt: "auto",
          pt: 2,
        }}>
        {checkBox}
        <Button
          onClick={() => {
            onEdit(address);
          }}
          startIcon={<EditOutlined sx={{ fontSize: 18 }} />}
          sx={(theme) => ({ ...ghostButtonSx(theme), px: 2, py: 0.75 })}>
          {t("addressBox.edit")}
        </Button>
      </Box>
    </Box>
  );
}

export default AddressBox;
