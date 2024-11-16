import { createBrowserRouter } from "react-router-dom";
import Homepage from "../components/Homepage.tsx";
import Products from "../components/Products.tsx";
import About from "../components/About.tsx";
import Contact from "../components/Contact.tsx";
import Category from "../components/Category.tsx";
import Cart from "../components/Cart/Cart.tsx";
import OrderDetails from "../components/Order/OrderDetails.tsx";
import Login from "../components/Login/Login.tsx";
import OrderSummary from "../components/Order/OrderSummary.tsx";
import OrderConfirm from "../components/Order/OrderConfirm.tsx";

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
  {
    path: "/koszyk",
    element: <Cart />,
  },
  {
    path: "/kategoria/:categoryId",
    element: <Category />,
    children: [
      {
        path: ":productId",
        element: <h1>Product</h1>,
      },
    ],
  },
  {
    path: "/zamowienie",
    element: <OrderDetails />,
  },
  {
    path: "/zamowienie/podsumowanie",
    element: <OrderSummary />,
  },
  {
    path: "/zamowienie/potwierdzenie",
    element: <OrderConfirm />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default router;
