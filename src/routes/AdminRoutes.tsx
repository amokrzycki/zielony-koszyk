import WelcomeMessage from "../components/Admin/WelcomeMessage.tsx";
import ProductsView from "../components/Admin/Products/ProductsView.tsx";
import OrdersView from "../components/Admin/Order/OrdersView.tsx";
import OrderItemsView from "../components/Admin/Order/OrderItemsView.tsx";
import { Route } from "./Routes.tsx";
import UsersView from "../components/Admin/User/UsersView.tsx";
import EditUserView from "../components/Admin/User/EditUserView.tsx";
import AddUserView from "../components/Admin/User/AddUserView.tsx";

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
    path: "zarzadzanie-uzytkownikami/*",
    children: [
      {
        path: "*",
        element: <UsersView />,
      },
      {
        path: "edycja-uzytkownika",
        element: <EditUserView />,
      },
      {
        path: "dodaj-uzytkownika",
        element: <AddUserView />,
      },
    ],
  },
  {
    path: "ustawienia",
    element: <h1>Settings</h1>,
  },
];
