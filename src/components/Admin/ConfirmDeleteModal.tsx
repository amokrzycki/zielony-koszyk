import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";

interface ConfirmDeleteModalProps {
  open: boolean;
  handleClose: () => void;
  onConfirm: () => Promise<void>;
  count: number;
}

function ConfirmDeleteModal({
  open,
  handleClose,
  onConfirm,
  count,
}: ConfirmDeleteModalProps) {
  const createDeleteText = () => {
    if (count === 1) {
      return "element";
    } else if (count > 1 && count < 5) {
      return "elementy";
    } else {
      return "elementów";
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        className={"absolute top-1/2 left-1/2 w-[550px] shadow p-4 rounded-xl"}
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
          Czy na pewno chcesz usunąć {count} {createDeleteText()}?
        </Typography>
        <Box className={"flex gap-2 justify-center"}>
          <Button
            startIcon={<DeleteIcon />}
            onClick={() => {
              onConfirm().then(() => handleClose());
            }}
            color="error"
            variant="contained"
          >
            Usuń
          </Button>
          <Button
            onClick={handleClose}
            variant="outlined"
            startIcon={<DoDisturbIcon />}
          >
            Anuluj
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default ConfirmDeleteModal;
