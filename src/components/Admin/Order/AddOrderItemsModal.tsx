import AddOrderItemsDataGrid from "./AddOrderItemsDataGrid.tsx";
import AdminModal from "../AdminModal.tsx";

interface AddOrderItemsModalProps {
  open: boolean;
  handleClose: () => void;
  orderId: number;
}

function AddOrderItemsModal({ open, handleClose, orderId }: AddOrderItemsModalProps) {
  return (
    <AdminModal
      open={open}
      onClose={handleClose}
      title="Dodaj produkty do zamówienia"
      subtitle={`Wybierz produkty i ilości, które trafią do zamówienia #${orderId}.`}
      maxWidth={960}>
      <AddOrderItemsDataGrid orderId={orderId} handleClose={handleClose} />
    </AdminModal>
  );
}

export default AddOrderItemsModal;
