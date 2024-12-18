import Header from "./Header.tsx";
import { Outlet } from "react-router-dom";
import Footer from "./Footer.tsx";
import { Toaster } from "react-hot-toast";
import { useMode } from "../providers/ModeProvider.tsx";

function Page() {
  const { mode } = useMode();
  return (
    <>
      <Toaster
        toastOptions={{
          style: {
            background: mode === "dark" ? "#333" : "#fff",
            color: mode === "dark" ? "#fff" : "#333",
          },
          success: {
            duration: 3000,
          },
        }}
      />
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default Page;
