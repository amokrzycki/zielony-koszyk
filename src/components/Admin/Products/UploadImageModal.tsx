import UploadImage from "@/components/Admin/Products/UploadImage.tsx";
import { useTranslation } from "react-i18next";
import AdminModal from "../AdminModal.tsx";

interface UploadImageModalProps {
  open: boolean;
  handleClose: () => void;
  productId: number;
}

function UploadImageModal({ open, handleClose, productId }: UploadImageModalProps) {
  const { t } = useTranslation("admin");

  return (
    <AdminModal
      open={open}
      onClose={handleClose}
      title={t("products.image.title")}
      subtitle={t("products.image.subtitle")}
      maxWidth={460}>
      <UploadImage productId={productId} />
    </AdminModal>
  );
}

export default UploadImageModal;
