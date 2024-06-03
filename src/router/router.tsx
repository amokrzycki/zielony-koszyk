import { createBrowserRouter } from "react-router-dom";
import Homepage from "../components/Homepage.tsx";
import Products from "../components/Products.tsx";
import About from "../components/About.tsx";
import Contact from "../components/Contact.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/produkty",
    element: <Products />,
  },
  {
    path: "/o-nas",
    element: <About />,
  },
  {
    path: "/kontakt",
    element: <Contact />,
  },
]);

export default router;
