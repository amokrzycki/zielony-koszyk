import WelcomeMessage from "../components/Admin/WelcomeMessage.tsx";
import ProductsView from "../components/Admin/ProductsView.tsx";
import OrdersView from "../components/Admin/OrdersView.tsx";
import OrderItemsView from "../components/Admin/OrderItemsView.tsx";
import { Route } from "./Routes.tsx";
import UsersView from "../components/Admin/UsersView.tsx";
import EditUserView from "../components/Admin/EditUserView.tsx";

export const AdminRoutes: Route[] = [
  {
    path: "*",
    element: <WelcomeMessage />,
  },
  {
    path: "zarzadzanie-produktami",
    element: <ProductsView />,
  },
  {
    path: "zarzadzanie-zamowieniami/*",
    children: [
      {
        path: "*",
        element: <OrdersView />,
      },
      {
        path: ":orderId",
        element: <OrderItemsView />,
      },
    ],
  },
  {
    path: "zarzadzanie-klientami/*",
    children: [
      {
        path: "*",
        element: <UsersView />,
      },
      {
        path: "edycja-klienta",
        element: <EditUserView />,
      },
    ],
  },
  {
    path: "ustawienia",
    element: <h1>Settings</h1>,
  },
];
