import { useTranslation } from "react-i18next";
import { apiErrorMessage } from "@/helpers/apiError.ts";
import { Button, CircularProgress, Typography } from "@mui/material";
import FileDownloadOutlined from "@mui/icons-material/FileDownloadOutlined";
import { useGetInvoiceQuery } from "@/components/Order/orderApiSlice.ts";
import { ghostButtonSx } from "@/components/listingStyles.ts";

function InvoiceDownloadButton({ orderId }: { orderId: number }) {
  const { t, i18n } = useTranslation("checkout");
  const { data: invoiceBlob, isFetching, isError, error } = useGetInvoiceQuery(orderId);

  const handleDownload = () => {
    if (!invoiceBlob) return;

    const url = window.URL.createObjectURL(invoiceBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = t("invoice.fileName", { id: orderId });
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (isError) {
    return (
      <Typography component="span" sx={{ color: "error.main", fontSize: "0.85rem", lineHeight: 1.4 }}>
        {apiErrorMessage(i18n.t, error, t("invoice.error"))}
      </Typography>
    );
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={isFetching || !invoiceBlob}
      startIcon={isFetching ? <CircularProgress size={16} color="inherit" /> : <FileDownloadOutlined />}
      sx={(theme) => ghostButtonSx(theme)}>
      {t("invoice.download")}
    </Button>
  );
}

export default InvoiceDownloadButton;
