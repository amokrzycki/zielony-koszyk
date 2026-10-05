import AddOrderItemsDataGrid from "./AddOrderItemsDataGrid.tsx";
import { useTranslation } from "react-i18next";
import AdminModal from "../AdminModal.tsx";

interface AddOrderItemsModalProps {
  open: boolean;
  handleClose: () => void;
  orderId: number;
}

function AddOrderItemsModal({ open, handleClose, orderId }: AddOrderItemsModalProps) {
  const { t } = useTranslation("admin");

  return (
    <AdminModal
      open={open}
      onClose={handleClose}
      title={t("addItems.title")}
      subtitle={t("addItems.subtitle", { id: orderId })}
      maxWidth={960}>
      <AddOrderItemsDataGrid orderId={orderId} handleClose={handleClose} />
    </AdminModal>
  );
}

export default AddOrderItemsModal;
