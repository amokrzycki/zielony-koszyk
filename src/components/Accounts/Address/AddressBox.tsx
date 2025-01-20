import { Address } from "@/types/Address.ts";
import { Box, Button, Typography } from "@mui/material";
import { CustomerType } from "@/enums/CustomerType.ts";

interface AddressBoxProps {
  address: Address;
  onEdit: (address: Address) => void;
}

function AddressBox({ address, onEdit }: AddressBoxProps) {
  return (
    <Box className={"mb-4 p-8 border border-gray-300 rounded-md max-w-md"}>
      <Typography variant={"h6"} gutterBottom>
        Typ klienta:{" "}
        {address.customer_type === CustomerType.COMPANY
          ? "Firma"
          : "Osoba prywatna"}
      </Typography>
      {address.customer_type === CustomerType.COMPANY ? (
        <>
          <Typography variant={"h5"} gutterBottom>
            {address.company_name}
          </Typography>
          <Typography>NIP: {address.nip}</Typography>
        </>
      ) : (
        <Typography variant={"h5"} gutterBottom>
          {address.first_name} {address.last_name}
        </Typography>
      )}
      <Typography>Telefon: {address.phone}</Typography>
      <Typography>
        {address.street} {address.building_number}
        {address.flat_number ? `/${address.flat_number}` : ""}
      </Typography>
      <Typography>
        {address.zip}, {address.city}
      </Typography>
      <Button
        onClick={() => {
          onEdit(address);
        }}
        variant={"contained"}
        sx={{
          mt: 1,
        }}
      >
        Edytuj dane
      </Button>
    </Box>
  );
}

export default AddressBox;
