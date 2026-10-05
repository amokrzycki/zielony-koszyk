import { Box, Button, Typography } from "@mui/material";
import UploadFileOutlined from "@mui/icons-material/UploadFileOutlined";
import { type ChangeEvent, useState } from "react";
import { useUploadImageMutation } from "@/components/Products/productsApiSlice.ts";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useApiError } from "../useAdminI18n.ts";
import { EASE, accentText, tone } from "@/components/listingStyles.ts";

interface UploadFileProps {
  productId: number;
}

function UploadImage({ productId }: UploadFileProps) {
  const { t } = useTranslation("admin");
  const apiError = useApiError();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadImage, { isLoading }] = useUploadImageMutation();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedFile) return;
    toast
      .promise(uploadImage({ id: productId, file: selectedFile }).unwrap(), {
        loading: t("products.image.loading"),
        success: t("products.image.success"),
        error: (error) => apiError(error, t("products.image.error")),
      })
      .then(() => setSelectedFile(null))
      .catch(() => {
        /* surfaced by the toast; the chosen file stays selected for a retry */
      });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Button
        component="label"
        variant="outlined"
        startIcon={<UploadFileOutlined />}
        disabled={!productId}
        sx={(theme) => ({
          justifyContent: "flex-start",
          border: "1px dashed",
          borderColor: "divider",
          borderRadius: "16px",
          px: 2,
          py: 2,
          fontWeight: 700,
          color: "text.primary",
          textTransform: "none",
          transition: `border-color 200ms ${EASE}, background-color 200ms ${EASE}`,
          "&:hover": { borderColor: accentText(theme), bgcolor: tone(theme, 0.06) },
        })}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", ml: 1, minWidth: 0 }}>
          <Box component="span" sx={{ fontWeight: 700 }}>
            {selectedFile ? t("products.image.change") : t("products.image.choose")}
          </Box>
          {selectedFile && (
            <Typography component="span" sx={{ color: "text.secondary", fontSize: "0.82rem" }} noWrap>
              {selectedFile.name}
            </Typography>
          )}
        </Box>
        <Box component="input" type="file" accept="image/*" onChange={handleFileChange} sx={{ display: "none" }} />
      </Button>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={handleSaveChanges}
          disabled={isLoading || !selectedFile}
          sx={{ borderRadius: "999px", fontWeight: 700 }}>
          {isLoading ? t("products.image.sending") : t("products.image.save")}
        </Button>
      </Box>
    </Box>
  );
}

export default UploadImage;
