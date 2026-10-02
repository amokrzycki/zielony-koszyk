import { Button } from "@mui/material";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import AdminModal from "./AdminModal.tsx";

interface ConfirmDeleteModalProps {
  open: boolean;
  handleClose: () => void;
  onConfirm: () => Promise<void>;
  count: number;
  /** What is being deleted, so the copy names the noun ("3 produkty" vs "3 elementy"). */
  entityLabel?: string;
}

const pluralize = (count: number) => {
  if (count === 1) return "element";
  if (count > 1 && count < 5) return "elementy";
  return "elementów";
};

function ConfirmDeleteModal({ open, handleClose, onConfirm, count, entityLabel }: ConfirmDeleteModalProps) {
  const noun = entityLabel ?? pluralize(count);

  return (
    <AdminModal
      open={open}
      onClose={handleClose}
      title={`Usunąć ${count} ${noun}?`}
      subtitle="Tej operacji nie można cofnąć."
      maxWidth={560}
      footer={
        <>
          <Button variant="text" onClick={handleClose} sx={{ borderRadius: "999px", fontWeight: 700 }}>
            Anuluj
          </Button>
          <Button
            startIcon={<DeleteOutline />}
            color="error"
            variant="contained"
            onClick={() => {
              onConfirm()
                .then(() => handleClose())
                .catch(() => {
                  /* failure is surfaced by the delete action itself */
                });
            }}
            sx={{ borderRadius: "999px", fontWeight: 700 }}>
            Usuń
          </Button>
        </>
      }>
      {null}
    </AdminModal>
  );
}

export default ConfirmDeleteModal;
