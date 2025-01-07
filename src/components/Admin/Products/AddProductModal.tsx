import { Box, IconButton, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddProductForm from "./AddProductForm.tsx";

interface AdminAddProductModalProps {
  open: boolean;
  handleClose: () => void;
}

function AddProductModal({ open, handleClose }: AdminAddProductModalProps) {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        className={"absolute top-1/2 left-1/2 w-[400px] shadow p-4 rounded-xl"}
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
          Dodaj produkt
        </Typography>
        <AddProductForm handleClose={handleClose} />
      </Box>
    </Modal>
  );
}

export default AddProductModal;
