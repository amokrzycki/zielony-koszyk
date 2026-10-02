import { combineReducers, configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import { persistStore, persistReducer, createTransform, type PersistConfig } from "redux-persist";
import { baseApi } from "../api/api.ts";
import { cartSlice } from "../components/Cart/cartSlice.ts";
import { normalizeCart } from "../reducers/cartReducers.ts";
import { orderSlice } from "../components/Order/orderSlice.ts";
import { accountSlice, logoutUser } from "../components/Accounts/accountSlice.ts";
import { clearTokenStorage } from "../helpers/tokenHelpers.ts";
import { appSlice } from "./appSlice.ts";

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: logoutUser,
  effect: clearTokenStorage,
});

const persistStorage = {
  getItem: (key: string) => {
    try {
      const item = localStorage.getItem(key);
      return Promise.resolve(item);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },
};

const rootReducer = combineReducers({
  cart: cartSlice.reducer,
  order: orderSlice.reducer,
  auth: accountSlice.reducer,
  app: appSlice.reducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

// Carts persisted before prices were coerced still hold API strings; normalise them on rehydrate.
const cartPriceTransform = createTransform(null, normalizeCart, { whitelist: ["cart"] });

const persistConfig: PersistConfig<ReturnType<typeof rootReducer>> = {
  key: "root",
  storage: persistStorage,
  whitelist: ["cart"],
  transforms: [cartPriceTransform],
};

export const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(listenerMiddleware.middleware, baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
