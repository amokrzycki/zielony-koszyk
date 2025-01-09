import { Dispatch, SetStateAction } from "react";
import { Box, IconButton } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

interface QuantitySelectorProps {
  quantity: number;
  setQuantity: Dispatch<SetStateAction<number>>;
}

function QuantitySelector({ quantity, setQuantity }: QuantitySelectorProps) {
  const calcInputWidth = () => {
    if (quantity >= 100) {
      return "60px";
    }
    if (quantity >= 10) {
      return "50px";
    }
    return "40px";
  };
  return (
    <Box
      className={"flex"}
      id="quantity-selector"
      sx={{ border: "1px solid #e5e7eb" }}
    >
      <IconButton
        onClick={() => setQuantity((prev) => prev - 1)}
        disabled={quantity === 1}
      >
        <RemoveIcon
          sx={{
            color: quantity === 1 ? "action.disabled" : "primary.main",
          }}
        />
      </IconButton>
      <Box
        sx={{
          borderLeft: "1px solid #e5e7eb",
          borderRight: "1px solid #e5e7eb",
        }}
      >
        <input
          type="number"
          value={quantity}
          className={"text-center"}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          style={{
            width: calcInputWidth(),
            height: "40px",
          }}
        />
      </Box>
      <IconButton onClick={() => setQuantity((prev) => prev + 1)}>
        <AddIcon
          sx={{
            color: "primary.main",
          }}
        />
      </IconButton>
    </Box>
  );
}

export default QuantitySelector;
