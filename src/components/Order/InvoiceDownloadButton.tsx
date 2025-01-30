import { Box, Button } from "@mui/material";
import { useGetInvoiceQuery } from "@/components/Order/orderApiSlice.ts";
import Loading from "@/components/common/Loading.tsx";

function InvoiceDownloadButton({ orderId }: { orderId: number }) {
  const {
    data: invoiceBlob,
    isFetching,
    isError,
  } = useGetInvoiceQuery(orderId);

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

  if (isFetching) return <Loading />;
  if (isError) return <Box sx={{ color: "red" }}>Błąd w ładowaniu faktury</Box>;

  return (
    <Button
      onClick={handleDownload}
      variant={"outlined"}
      size={"small"}
      disabled={!invoiceBlob}
    >
      Faktura elektroniczna
    </Button>
  );
}

export default InvoiceDownloadButton;
