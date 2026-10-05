import { createApi, fetchBaseQuery, type BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../constants/api.ts";
import type { RootState } from "../store/store.ts";
import { TAGS } from "../constants/tags.ts";
import { logoutUser, refreshToken } from "../components/Accounts/accountSlice.ts";
import { getActiveLocale } from "@/i18n/index.ts";

/**
 * Content language for every request. Localized *queries* also carry their locale in the query args (so it is part of
 * the RTK Query cache key) and set this header themselves; the default below covers mutations such as placing an order.
 */
const withLocale = (headers: Headers) => {
  if (!headers.has("accept-language")) headers.set("accept-language", getActiveLocale());
  return headers;
};

let isRefreshing = false;
let refreshPromise: Promise<unknown> | null = null;

const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
  let result = await fetchBaseQuery({
    baseUrl: API_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return withLocale(headers);
    },
  })(args, api, extraOptions);

  const url = typeof args === "string" ? args : args.url;
  if (result.error && result.error.status === 401 && !url.startsWith("auth/")) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = Promise.resolve(
        fetchBaseQuery({
          baseUrl: API_URL,
          credentials: "include",
        })({ url: "auth/refresh", method: "POST" }, api, extraOptions),
      )
        .then((refreshResult) => {
          if (refreshResult.data && typeof refreshResult.data === "object" && "access_token" in refreshResult.data) {
            const { access_token } = refreshResult.data as { access_token: string };
            api.dispatch(refreshToken(access_token));
            isRefreshing = false;
            return refreshResult;
          } else {
            isRefreshing = false;
            api.dispatch(logoutUser());
            return refreshResult;
          }
        })
        .catch(() => {
          isRefreshing = false;
          api.dispatch(logoutUser());
        });
    }

    if (refreshPromise) {
      await refreshPromise;

      const token = (api.getState() as RootState).auth.token;
      if (token) {
        result = await fetchBaseQuery({
          baseUrl: API_URL,
          credentials: "include",
          prepareHeaders: (headers) => {
            headers.set("authorization", `Bearer ${token}`);
            return withLocale(headers);
          },
        })(args, api, extraOptions);
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  tagTypes: TAGS,
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});
