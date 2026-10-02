import { Box, IconButton } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import type { Theme } from "@mui/material/styles";
import { useEffect, useRef } from "react";
import { EASE, accentText, tone } from "@/components/listingStyles.ts";

interface QuantitySelectorProps {
  quantity: number;
  setQuantity: (newQuantity: number) => void;
}

/** Tactile circle around the +/- actions: quiet green ink, green tint on hover, press-down on click. */
const stepButtonSx = (theme: Theme) => ({
  color: accentText(theme),
  transition: `background-color 200ms ${EASE}, transform 120ms ${EASE}`,
  "&:hover": { bgcolor: tone(theme, 0.12) },
  "&:focus-visible": { bgcolor: tone(theme, 0.16) },
  "&:active": { transform: "scale(0.86)" },
  "&.Mui-disabled": { color: "action.disabled", bgcolor: "transparent" },
});

function QuantitySelector({ quantity, setQuantity }: QuantitySelectorProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const prevQuantity = useRef(quantity);

  // Authored moment: the value settles in from the direction it moved.
  useEffect(() => {
    if (prevQuantity.current === quantity) return;
    const direction = quantity > prevQuantity.current ? 1 : -1;
    prevQuantity.current = quantity;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    inputRef.current?.animate(
      [
        { opacity: 0.2, transform: `translateY(${direction * 7}px)`, filter: "blur(3px)" },
        { opacity: 1, transform: "translateY(0)", filter: "blur(0)" },
      ],
      { duration: 280, easing: EASE },
    );
  }, [quantity]);

  const calcInputWidth = () => {
    if (quantity >= 100) {
      return "68px";
    }
    if (quantity >= 10) {
      return "54px";
    }
    return "42px";
  };

  return (
    <Box
      className={"flex items-center"}
      sx={{
        gap: 0.25,
        p: "4px",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "999px",
        bgcolor: "background.paper",
        transition: `border-color 200ms ${EASE}`,
        "&:hover, &:focus-within": { borderColor: "primary.main" },
      }}>
      <IconButton
        size={"small"}
        onClick={() => setQuantity(Math.max(1, quantity - 1))}
        disabled={quantity === 1}
        aria-label={"Zmniejsz ilość"}
        sx={stepButtonSx}>
        <RemoveIcon fontSize={"small"} />
      </IconButton>
      <Box
        component="input"
        ref={inputRef}
        type="number"
        min={1}
        inputMode={"numeric"}
        value={quantity}
        aria-label={"Ilość"}
        onChange={(e) => {
          const value = parseInt(e.target.value, 10);
          setQuantity(Number.isNaN(value) ? 1 : Math.max(1, value));
        }}
        sx={(theme) => ({
          width: calcInputWidth(),
          height: "30px",
          border: "none",
          outline: "none",
          borderRadius: "999px",
          bgcolor: tone(theme, 0.08),
          color: "text.primary",
          fontSize: "0.9rem",
          fontWeight: 800,
          letterSpacing: "-0.01em",
          fontVariantNumeric: "tabular-nums",
          textAlign: "center",
          caretColor: theme.palette.primary.main,
          transition: `background-color 200ms ${EASE}`,
          "&:hover": { bgcolor: tone(theme, 0.12) },
          "&:focus": { bgcolor: tone(theme, 0.16) },
          "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": { WebkitAppearance: "none", margin: 0 },
          appearance: "textfield",
          MozAppearance: "textfield",
        })}
      />
      <IconButton
        size={"small"}
        onClick={() => setQuantity(quantity + 1)}
        aria-label={"Zwiększ ilość"}
        sx={stepButtonSx}>
        <AddIcon fontSize={"small"} />
      </IconButton>
    </Box>
  );
}

export default QuantitySelector;
