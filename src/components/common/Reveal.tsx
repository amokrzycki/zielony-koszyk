import type { ReactNode } from "react";
import { Box } from "@mui/material";

/** Grows a conditional block from zero height; enter-only, see .reveal in App.css. */
function Reveal({ children }: { children: ReactNode }) {
  return <Box className="reveal">{children}</Box>;
}

export default Reveal;
