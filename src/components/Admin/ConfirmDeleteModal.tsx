import { Button } from "@mui/material";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import { useTranslation } from "react-i18next";
import AdminModal from "./AdminModal.tsx";

interface ConfirmDeleteModalProps {
  open: boolean;
  handleClose: () => void;
  onConfirm: () => Promise<void>;
  count: number;
  /** What is being deleted, so the title names the noun ("3 produkty" vs "3 elementy"). */
  entity?: "generic" | "products" | "orders" | "users" | "orderItems";
}

function ConfirmDeleteModal({ open, handleClose, onConfirm, count, entity = "generic" }: ConfirmDeleteModalProps) {
  const { t } = useTranslation("admin");

  return (
    <AdminModal
      open={open}
      onClose={handleClose}
      title={t(`confirmDelete.title.${entity}`, { count })}
      subtitle={t("confirmDelete.subtitle")}
      maxWidth={560}
      footer={
        <>
          <Button variant="text" onClick={handleClose} sx={{ borderRadius: "999px", fontWeight: 700 }}>
            {t("actions.cancel", { ns: "common" })}
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
            {t("actions.delete", { ns: "common" })}
          </Button>
        </>
      }>
      {null}
    </AdminModal>
  );
}

export default ConfirmDeleteModal;
