import "./App.css";
import { Box } from "@mui/material";
import { RouterProvider } from "react-router-dom";
import router from "./routes/Routes.tsx";
import { ModeProvider } from "./providers/ModeProvider.tsx";

function App() {
  return (
    <ModeProvider>
      <Box
        className="App"
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <RouterProvider router={router} />
      </Box>
    </ModeProvider>
  );
}

export default App;
