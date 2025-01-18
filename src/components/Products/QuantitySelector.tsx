import { Box, IconButton, TextField } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

interface QuantitySelectorProps {
  quantity: number;
  setQuantity: (newQuantity: number) => void;
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
        onClick={() => setQuantity(Math.max(1, quantity - 1))}
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
        <TextField
          type="number"
          value={quantity}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            setQuantity(isNaN(value) ? 1 : value);
          }}
          sx={{
            width: calcInputWidth(),
            "& .MuiOutlinedInput-root": {
              borderRadius: 0,
              height: "40px",
              "& fieldset": {
                border: "none",
              },
            },
            "& .MuiOutlinedInput-input": {
              padding: "0 12px",
              textAlign: "center",
              lineHeight: "40px",
            },
          }}
          variant="outlined"
        />
      </Box>
      <IconButton onClick={() => setQuantity(quantity + 1)}>
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
