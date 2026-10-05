import { useTranslation } from "react-i18next";
import AdminModal from "../AdminModal.tsx";
import AddProductForm from "./AddProductForm.tsx";

interface AdminAddProductModalProps {
  open: boolean;
  handleClose: () => void;
}

function AddProductModal({ open, handleClose }: AdminAddProductModalProps) {
  const { t } = useTranslation("admin");

  return (
    <AdminModal
      open={open}
      onClose={handleClose}
      title={t("products.create.title")}
      subtitle={t("products.create.subtitle")}
      maxWidth={600}>
      <AddProductForm handleClose={handleClose} />
    </AdminModal>
  );
}

export default AddProductModal;
