import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../constants/api.ts";
import { RootState } from "../store/store.ts";
import { TAGS } from "../constants/tags.ts";

export const baseApi = createApi({
  reducerPath: "api",
  tagTypes: TAGS,
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: () => ({}),
});
