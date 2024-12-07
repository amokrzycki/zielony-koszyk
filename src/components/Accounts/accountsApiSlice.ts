import { baseApi } from "../../api/api.ts";
import { CreateUser } from "../../types/CreateUser.ts";
import { ILoginFormValues } from "./LoginForm.tsx";

export const accountsApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (body: CreateUser) => ({
        url: "users/register",
        method: "POST",
        body,
      }),
    }),
    login: builder.mutation({
      query: (body: ILoginFormValues) => ({
        url: "auth/login",
        method: "POST",
        body: {
          email: body.email,
          password: body.password,
        },
      }),
    }),
    getAccountInfo: builder.query({
      query: (body: string) => ({
        url: "users/" + body,
        method: "GET",
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useGetAccountInfoQuery } =
  accountsApiSlice;
