import { Address } from "@/types/Address.ts";
import { FormControlLabel } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { useChangeUserAddressMutation } from "@/components/Accounts/accountsApiSlice.ts";
import { useAppDispatch } from "@/hooks/hooks.ts";
import { updateUserAddresses } from "@/components/Accounts/accountSlice.ts";
import toast from "react-hot-toast";

interface DefaultCheckboxProps {
  address: Address;
  userId: string;
}

function DefaultCheckbox({ address, userId }: DefaultCheckboxProps) {
  const [changeAddress] = useChangeUserAddressMutation();
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

  return (
    <>
      {address.default ? (
        <FormControlLabel
          control={<Checkbox checked={address.default} />}
          label={"Domyślny"}
        />
      ) : (
        <FormControlLabel
          control={<Checkbox checked={address.default} />}
          label={"Ustaw jako domyślny"}
          onChange={handleChange}
        />
      )}
    </>
  );
}

export default DefaultCheckbox;
