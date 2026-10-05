import { createBrowserRouter, Navigate, type RouteObject, useLocation } from "react-router-dom";
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
import ProductDetails from "@/components/Products/ProductDetails.tsx";
import AccountOptions from "../components/Accounts/AccountOptions.tsx";
import AddressBook from "../components/Accounts/Address/AddressBook.tsx";
import AddressForm from "../components/Accounts/Address/AddressForm.tsx";
import AccountOrdersView from "../components/Accounts/Order/AccountOrdersView.tsx";
import AccountOrderDetails from "../components/Accounts/Order/AccountOrderDetails.tsx";
import EmailChange from "../components/Accounts/EmailChange.tsx";
import PasswordChange from "../components/Accounts/PasswordChange.tsx";
import MfaSettings from "../components/Accounts/MfaSettings.tsx";
import WelcomeMessage from "../components/Admin/WelcomeMessage.tsx";
import ProductsView from "../components/Admin/Products/ProductsView.tsx";
import OrdersView from "../components/Admin/Order/OrdersView.tsx";
import OrderItemsView from "../components/Admin/Order/OrderItemsView.tsx";
import UsersView from "../components/Admin/User/UsersView.tsx";
import EditUserView from "../components/Admin/User/EditUserView.tsx";
import AddUserView from "../components/Admin/User/AddUserView.tsx";
import EditOrderAddresses from "@/components/Admin/Order/EditOrderAddresses.tsx";
import { activateLocale, getPreferredLocale } from "@/i18n/index.ts";
import { LOCALES, type Locale } from "@/i18n/locale.ts";
import { matchRoute, pathFor, routeSegment, switchLocalePath, type RouteId } from "@/i18n/routes.ts";

/** Page for a route id; the URL slug comes from the central route table, never from here. */
const page = (id: RouteId, locale: Locale, element: RouteObject["element"]): RouteObject => ({
  path: routeSegment(id, locale),
  element,
});

const localeChildren = (locale: Locale): RouteObject[] => [
  { index: true, element: <Homepage /> },
  page("products", locale, <Products />),
  page("productDetails", locale, <ProductDetails />),
  page("about", locale, <About />),
  page("cart", locale, <Cart />),
  page("order", locale, <OrderDetails />),
  page("orderSummary", locale, <OrderSummary />),
  page("orderConfirmation", locale, <OrderConfirm />),
  page("cartLogin", locale, <CartLogin />),
  page("login", locale, <Login />),
  {
    element: <MainView />,
    children: [
      page("admin", locale, <WelcomeMessage />),
      page("adminProducts", locale, <ProductsView />),
      page("adminOrders", locale, <OrdersView />),
      page("adminOrderItems", locale, <OrderItemsView />),
      page("adminOrderEdit", locale, <EditOrderAddresses />),
      page("adminUsers", locale, <UsersView />),
      page("adminUserEdit", locale, <EditUserView />),
      page("adminUserAdd", locale, <AddUserView />),
      { path: `${routeSegment("admin", locale)}/*`, element: <WelcomeMessage /> },
    ],
  },
  {
    element: <AccountView />,
    children: [
      page("account", locale, <AccountOptions />),
      page("accountOrders", locale, <AccountOrdersView />),
      page("accountOrderDetails", locale, <AccountOrderDetails />),
      page("accountAddresses", locale, <AddressBook />),
      page("accountAddressEdit", locale, <AddressForm />),
      page("accountAddressAdd", locale, <AddressForm />),
      page("accountEmailChange", locale, <EmailChange />),
      page("accountPasswordChange", locale, <PasswordChange />),
      page("accountMfa", locale, <MfaSettings />),
      { path: `${routeSegment("account", locale)}/*`, element: <AccountOptions /> },
    ],
  },
  { path: "*", element: <Homepage /> },
];

/**
 * Bare or unprefixed URLs (`/`, bookmarked `/produkty/15#details`) go to the preferred locale, keeping the logical
 * route, params, query and hash. `replace` swaps the history entry, so Back never lands on the unprefixed URL again.
 * (A component rather than a loader: a loader's Request has no hash fragment.)
 */
export function RedirectToPreferredLocale() {
  const location = useLocation();
  const locale = getPreferredLocale();
  return (
    <Navigate
      replace
      to={matchRoute(location.pathname) ? switchLocalePath(location, locale) : pathFor("home", locale)}
    />
  );
}

export const routes: RouteObject[] = [
  ...LOCALES.map(
    (locale): RouteObject => ({
      path: `/${locale}`,
      // Runs before anything renders, so the URL's locale is active on the very first paint.
      loader: async () => {
        await activateLocale(locale);
        return null;
      },
      element: <Page />,
      children: localeChildren(locale),
    }),
  ),
  { path: "*", element: <RedirectToPreferredLocale /> },
];

const router = createBrowserRouter(routes);

export default router;
