import UploadImage from "@/components/Admin/Products/UploadImage.tsx";
import AdminModal from "../AdminModal.tsx";

interface UploadImageModalProps {
  open: boolean;
  handleClose: () => void;
  productId: number;
}

function UploadImageModal({ open, handleClose, productId }: UploadImageModalProps) {
  return (
    <AdminModal
      open={open}
      onClose={handleClose}
      title="Zdjęcie produktu"
      subtitle="Jeden plik graficzny zastąpi obecne zdjęcie produktu."
      maxWidth={460}>
      <UploadImage productId={productId} />
    </AdminModal>
  );
}

export default UploadImageModal;
