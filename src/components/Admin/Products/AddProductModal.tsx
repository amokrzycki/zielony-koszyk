import AdminModal from "../AdminModal.tsx";
import AddProductForm from "./AddProductForm.tsx";

interface AdminAddProductModalProps {
  open: boolean;
  handleClose: () => void;
}

function AddProductModal({ open, handleClose }: AdminAddProductModalProps) {
  return (
    <AdminModal
      open={open}
      onClose={handleClose}
      title="Dodaj produkt"
      subtitle="Produkt pojawi się w katalogu od razu po zapisaniu."
      maxWidth={520}>
      <AddProductForm handleClose={handleClose} />
    </AdminModal>
  );
}

export default AddProductModal;
