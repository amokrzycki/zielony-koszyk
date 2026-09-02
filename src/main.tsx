import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { persistor, store } from "./store/store.ts";
import { PersistGate } from "redux-persist/integration/react";
import { accountsApiSlice } from "./components/Accounts/accountsApiSlice.ts";
import { loginUser } from "./components/Accounts/accountSlice.ts";

// biome-ignore lint/style/noNonNullAssertion: We are sure that the element with id "root" exists in the HTML, so we can safely use the non-null assertion operator here.
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={<div>Loading...</div>}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);

void store
  .dispatch(accountsApiSlice.endpoints.refreshSession.initiate())
  .unwrap()
  .then(({ access_token, user }) => {
    store.dispatch(loginUser({ accessToken: access_token, user }));
  })
  .catch(() => undefined);
