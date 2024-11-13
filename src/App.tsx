import "./App.css";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import { Box } from "@mui/material";
import { RouterProvider } from "react-router-dom";
import router from "./router/router.tsx";
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
        <Header />
        <RouterProvider router={router} />
        <Footer />
      </Box>
    </ModeProvider>
  );
}

export default App;
