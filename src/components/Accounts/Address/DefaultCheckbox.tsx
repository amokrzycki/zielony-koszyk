import type { Address } from "@/types/Address.ts";
import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import CheckRounded from "@mui/icons-material/CheckRounded";
import { useChangeUserAddressMutation } from "@/components/Accounts/accountsApiSlice.ts";
import { useAppDispatch } from "@/hooks/hooks.ts";
import { updateUserAddresses } from "@/components/Accounts/accountSlice.ts";
import toast from "react-hot-toast";
import { accentText, tone } from "@/components/listingStyles.ts";

interface DefaultCheckboxProps {
  address: Address;
  userId: string;
}

function DefaultCheckbox({ address, userId }: DefaultCheckboxProps) {
  const [changeAddress, { isLoading }] = useChangeUserAddressMutation();
  const dispatch = useAppDispatch();

  const handleChange = () => {
    const updatedAddress: Address = {
      ...address,
      default: !address.default,
    };

    toast
      .promise(
        changeAddress({
          ...updatedAddress,
          user_id: userId,
        }).unwrap(),
        {
          loading: "Zmienianie adresu...",
          success: "Adres został zmieniony",
          error: "Wystąpił błąd podczas zmiany adresu",
        },
      )
      .then(() => dispatch(updateUserAddresses(updatedAddress)));
  };

  if (address.default) {
    return (
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.75,
          px: 1.25,
          py: 0.4,
          borderRadius: "999px",
          bgcolor: (t) => tone(t, 0.1),
          color: (t) => accentText(t),
          fontSize: "0.8rem",
          fontWeight: 700,
        }}>
        <CheckRounded sx={{ fontSize: 15 }} />
        Domyślny
      </Box>
    );
  }

  return (
    <FormControlLabel
      control={<Checkbox checked={false} size="small" disabled={isLoading} onChange={handleChange} />}
      label={<Typography sx={{ fontSize: "0.85rem", fontWeight: 600 }}>Ustaw jako domyślny</Typography>}
    />
  );
}

export default DefaultCheckbox;
