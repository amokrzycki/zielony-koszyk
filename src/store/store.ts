import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import { baseApi } from "../api/api.ts";
import { cartSlice } from "../components/Cart/cartSlice.ts";
import { orderSlice } from "../components/Order/orderSlice.ts";
import { accountSlice } from "../components/Accounts/accountSlice.ts";
import { appSlice } from "./appSlice.ts";

const rootReducer = combineReducers({
  cart: cartSlice.reducer,
  order: orderSlice.reducer,
  auth: accountSlice.reducer,
  app: appSlice.reducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart"],
};

export const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
