import "./App.css";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import { RouterProvider } from "react-router-dom";
import router from "./router/router.tsx";

function App() {
  return (
    <div className="App">
      <Header />
      <RouterProvider router={router} />
      <Footer />
    </div>
  );
}

export default App;
