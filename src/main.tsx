import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { persistor, store } from "./store/store.ts";
import { PersistGate } from "redux-persist/integration/react";
import { accountsApiSlice } from "./components/Accounts/accountsApiSlice.ts";
import { loginUser } from "./components/Accounts/accountSlice.ts";
import { clearTokenStorage, hasStoredSession } from "./helpers/tokenHelpers.ts";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={<div>Loading...</div>}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);

if (hasStoredSession()) {
  void store
    .dispatch(accountsApiSlice.endpoints.refreshSession.initiate())
    .unwrap()
    .then(({ access_token, user }) => {
      store.dispatch(loginUser({ accessToken: access_token, user }));
    })
    .catch(clearTokenStorage);
}
