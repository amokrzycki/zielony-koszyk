import { useTranslation } from "react-i18next";
import type { Categories } from "@/enums/Categories.ts";
import type Product from "@/types/Product.ts";
import { useGetProductTranslationsQuery } from "../../Products/productsApiSlice.ts";
import AdminError from "../AdminError.tsx";
import AdminLoading from "../AdminLoading.tsx";
import AdminModal from "../AdminModal.tsx";
import AddProductForm from "./AddProductForm.tsx";

interface EditProductModalProps {
  /** `null` keeps the dialog closed. */
  product: Product | null;
  handleClose: () => void;
}

/** Name and description change here so both languages are always edited together; the form waits for both. */
function EditProductModal({ product, handleClose }: EditProductModalProps) {
  const { t } = useTranslation("admin");
  const productId = product?.product_id ?? 0;
  const { data: translations, isError, refetch } = useGetProductTranslationsQuery(productId, { skip: !product });

  return (
    <AdminModal
      open={Boolean(product)}
      onClose={handleClose}
      title={t("products.edit.title")}
      subtitle={t("products.edit.subtitle")}
      maxWidth={600}>
      {product && translations ? (
        <AddProductForm
          key={product.product_id}
          handleClose={handleClose}
          product={{
            id: product.product_id,
            price: product.price,
            category: product.category as Categories,
            stock_quantity: product.stock_quantity,
            translations,
          }}
        />
      ) : isError ? (
        <AdminError message={t("products.edit.loadError")} onRetry={() => refetch()} />
      ) : (
        <AdminLoading rows={4} compact />
      )}
    </AdminModal>
  );
}

export default EditProductModal;
