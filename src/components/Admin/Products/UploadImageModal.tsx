import { Box, IconButton, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UploadImage from "@/components/Admin/Products/UploadImage.tsx";

interface UploadImageModalProps {
  open: boolean;
  handleClose: () => void;
  productId: number;
}

function UploadImageModal({
  open,
  handleClose,
  productId,
}: UploadImageModalProps) {
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
          Zmień/dodaj zdjęcie dla produktu
        </Typography>
        <UploadImage productId={productId} />
      </Box>
    </Modal>
  );
}

export default UploadImageModal;
