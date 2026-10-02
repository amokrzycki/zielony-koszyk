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
      className={"flex items-center"}
      sx={{ border: "1px solid", borderColor: "divider", borderRadius: "999px", overflow: "hidden" }}>
      <IconButton
        onClick={() => setQuantity(Math.max(1, quantity - 1))}
        disabled={quantity === 1}
        aria-label={"Zmniejsz ilość"}
        sx={{ color: "primary.main", "&.Mui-disabled": { color: "action.disabled" } }}>
        <RemoveIcon fontSize={"small"} />
      </IconButton>
      <Box sx={{ borderLeft: "1px solid", borderRight: "1px solid", borderColor: "divider" }}>
        <TextField
          type="number"
          value={quantity}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            setQuantity(Number.isNaN(value) ? 1 : Math.max(1, value));
          }}
          slotProps={{ htmlInput: { "aria-label": "Ilość" } }}
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
      <IconButton onClick={() => setQuantity(quantity + 1)} aria-label={"Zwiększ ilość"} sx={{ color: "primary.main" }}>
        <AddIcon fontSize={"small"} />
      </IconButton>
    </Box>
  );
}

export default QuantitySelector;
