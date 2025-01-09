import { Box, IconButton, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddOrderItemsDataGrid from "./AddOrderItemsDataGrid.tsx";

interface AddOrderItemsModalProps {
  open: boolean;
  handleClose: () => void;
  orderId: number;
}

function AddOrderItemsModal({
  open,
  handleClose,
  orderId,
}: AddOrderItemsModalProps) {
  console.log(orderId);
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        className={"absolute top-1/2 left-1/2 w-4/5 shadow p-4 rounded-xl"}
        sx={{
          bgcolor: "background.paper",
          transform: "translate(-50%, -50%)",
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{
            color: "text.primary",
            position: "absolute",
            top: 0,
            right: 0,
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
          Dodaj produkty do zamówienia
        </Typography>
        <AddOrderItemsDataGrid />
      </Box>
    </Modal>
  );
}

export default AddOrderItemsModal;
