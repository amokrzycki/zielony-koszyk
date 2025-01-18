import { Box, Button } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { useUploadImageMutation } from "@/components/Products/productsApiSlice.ts";
import toast from "react-hot-toast";

interface UploadFileProps {
  productId: number;
}

function UploadImage({ productId }: UploadFileProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadImage, { isLoading }] = useUploadImageMutation();

  if (!productId) {
    toast.error("Nie wybrano produktu");
    return null;
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedFile) return;
    toast
      .promise(uploadImage({ id: productId, file: selectedFile }), {
        loading: "Ładowanie...",
        success: "Zdjęcie zostało zaktualizowane",
        error: "Wystąpił błąd podczas aktualizacji zdjęcia",
      })
      .then(() => {
        console.log("Image uploaded");
      });
  };
  return (
    <>
      <input type="file" onChange={handleFileChange} />
      <Box className={"mt-4 w-full text-center"}>
        <Button
          variant={"outlined"}
          onClick={handleSaveChanges}
          disabled={isLoading}
        >
          {isLoading ? "Ładowanie..." : "Dodaj plik"}
        </Button>
      </Box>
    </>
  );
}

export default UploadImage;
