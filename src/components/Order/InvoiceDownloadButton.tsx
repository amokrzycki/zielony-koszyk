import { Button, CircularProgress, Typography } from "@mui/material";
import FileDownloadOutlined from "@mui/icons-material/FileDownloadOutlined";
import { useGetInvoiceQuery } from "@/components/Order/orderApiSlice.ts";
import { ghostButtonSx } from "@/components/listingStyles.ts";

function InvoiceDownloadButton({ orderId }: { orderId: number }) {
  const { data: invoiceBlob, isFetching, isError } = useGetInvoiceQuery(orderId);

  const handleDownload = () => {
    if (!invoiceBlob) return;

    const url = window.URL.createObjectURL(invoiceBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `faktura-do-zamowienia-${orderId}.pdf`;
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (isError) {
    return (
      <Typography component="span" sx={{ color: "error.main", fontSize: "0.85rem", lineHeight: 1.4 }}>
        Nie udało się pobrać faktury
      </Typography>
    );
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={isFetching || !invoiceBlob}
      startIcon={isFetching ? <CircularProgress size={16} color="inherit" /> : <FileDownloadOutlined />}
      sx={(theme) => ghostButtonSx(theme)}>
      Faktura elektroniczna
    </Button>
  );
}

export default InvoiceDownloadButton;
