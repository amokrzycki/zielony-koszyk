import type { ReactNode } from "react";
import { Box } from "@mui/material";

/**
 * Grows a conditionally rendered block from zero height and fades it in, so switching between
 * forms does not snap the surrounding layout. Enter-only: the leaving block unmounts at once.
 * See .reveal in App.css.
 */
function Reveal({ children }: { children: ReactNode }) {
  return <Box className="reveal">{children}</Box>;
}

export default Reveal;
