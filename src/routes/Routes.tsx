import { createBrowserRouter } from "react-router-dom";
import Homepage from "../components/Homepage.tsx";
import Products from "../components/Products/Products.tsx";
import About from "../components/About.tsx";
import Cart from "../components/Cart/Cart.tsx";
import OrderDetails from "../components/Order/OrderDetails.tsx";
import CartLogin from "../components/Cart/CartLogin.tsx";
import OrderSummary from "../components/Order/OrderSummary.tsx";
import OrderConfirm from "../components/Order/OrderConfirm.tsx";
import Login from "../components/Accounts/Login.tsx";
import AccountView from "../components/Accounts/AccountView.tsx";
import Page from "../components/Page.tsx";
import MainView from "../components/Admin/MainView.tsx";
import { ReactNode } from "react";
import { AdminRoutes } from "./AdminRoutes.tsx";
import { AccountRoutes } from "./AccountRoutes.tsx";

export interface Route {
  path: string;
  element?: ReactNode;
  children?: Route[];
  exact?: boolean;
}

const routes: Route[] = [
  {
    path: "*",
    element: <Homepage />,
  },
  {
    path: "produkty",
    element: <Products />,
  },
  {
    path: "o-nas",
    element: <About />,
  },
  {
    path: "koszyk",
    element: <Cart />,
  },
  {
    path: "zamowienie",
    element: <OrderDetails />,
  },
  {
    path: "zamowienie/podsumowanie",
    element: <OrderSummary />,
  },
  {
    path: "zamowienie/potwierdzenie",
    element: <OrderConfirm />,
  },
  {
    path: "cart-login",
    element: <CartLogin />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "admin/*",
    element: <MainView />,
    children: AdminRoutes,
  },
  {
    path: "konto/*",
    element: <AccountView />,
    children: AccountRoutes,
  },
];

const router = createBrowserRouter([
  {
    path: "/*",
    element: <Page />,
    children: routes,
  },
]);

export default router;
