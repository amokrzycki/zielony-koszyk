import { baseApi } from "@/api/api.ts";
import type { CreateUser } from "@/types/CreateUser.ts";
import type { ILoginFormValues } from "./LoginForm.tsx";
import type { UpdatePasswordBody } from "@/types/UpdatePasswordBody.ts";
import type { UpdateDetailsBody } from "@/types/updateDetailsBody.ts";
import type User from "../../types/User.ts";
import type { CreateUserFromAdmin } from "@/types/CreateUserFromAdmin.ts";
import type { Address } from "@/types/Address.ts";
import type { MfaMethod } from "@/enums/MfaMethod.ts";
import type {
  AuthenticationResponseJSON,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON,
} from "@simplewebauthn/browser";

export type FullAuthResponse = {
  mfa_required: false;
  access_token: string;
  user: User;
};

export type PendingAuthResponse = {
  mfa_required: true;
  method: Exclude<MfaMethod, MfaMethod.NONE>;
  mfa_token: string;
  webauthn_options?: PublicKeyCredentialRequestOptionsJSON;
};

export type LoginResponse = FullAuthResponse | PendingAuthResponse;

type VerifyMfaCodeRequest = {
  code: string;
  mfaToken: string;
};

export type TotpEnrollmentResponse = {
  challenge_id: string;
  otpauth_uri: string;
  secret: string;
};

type VerifyTotpEnrollmentRequest = {
  challengeId: string;
  code: string;
};

export type WebAuthnRegistrationOptionsResponse = {
  challenge_id: string;
  options: PublicKeyCredentialCreationOptionsJSON;
};

type VerifyWebAuthnRegistrationRequest = {
  challengeId: string;
  response: RegistrationResponseJSON;
};

type VerifyWebAuthnLoginRequest = {
  response: AuthenticationResponseJSON;
  mfaToken: string;
};

type UpdateMfaMethodRequest = {
  method: MfaMethod.NONE | MfaMethod.EMAIL_OTP;
  password: string;
};

export const accountsApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (body: CreateUser) => ({
        url: "users/register",
        method: "POST",
        body,
      }),
    }),
    createUserFromAdmin: builder.mutation<void, CreateUserFromAdmin>({
      query: (body: CreateUserFromAdmin) => ({
        url: "users/admin-create",
        method: "POST",
        body,
      }),
    }),
    login: builder.mutation<LoginResponse, ILoginFormValues>({
      query: (body: ILoginFormValues) => ({
        url: "auth/login",
        method: "POST",
        body: {
          email: body.email,
          password: body.password,
          rememberMe: Boolean(body.rememberMe),
        },
      }),
    }),
    verifyEmailOtp: builder.mutation<FullAuthResponse, VerifyMfaCodeRequest>({
      query: ({ code, mfaToken }) => ({
        url: "auth/mfa/email-otp/verify",
        method: "POST",
        body: { code },
        headers: { Authorization: `Bearer ${mfaToken}` },
      }),
    }),
    verifyTotp: builder.mutation<FullAuthResponse, VerifyMfaCodeRequest>({
      query: ({ code, mfaToken }) => ({
        url: "auth/mfa/totp/verify",
        method: "POST",
        body: { code },
        headers: { Authorization: `Bearer ${mfaToken}` },
      }),
    }),
    startTotpEnrollment: builder.mutation<TotpEnrollmentResponse, string>({
      query: (password) => ({
        url: "users/me/mfa/totp/enrollment",
        method: "POST",
        body: { password },
      }),
    }),
    verifyTotpEnrollment: builder.mutation<{ mfa_method: MfaMethod.TOTP }, VerifyTotpEnrollmentRequest>({
      query: ({ challengeId, code }) => ({
        url: "users/me/mfa/totp/enrollment/verify",
        method: "POST",
        body: { challenge_id: challengeId, code },
      }),
    }),
    verifyWebAuthnLogin: builder.mutation<FullAuthResponse, VerifyWebAuthnLoginRequest>({
      query: ({ response, mfaToken }) => ({
        url: "auth/mfa/webauthn/verify",
        method: "POST",
        body: { response },
        headers: { Authorization: `Bearer ${mfaToken}` },
      }),
    }),
    startWebAuthnRegistration: builder.mutation<WebAuthnRegistrationOptionsResponse, string>({
      query: (password) => ({
        url: "users/me/mfa/webauthn/registration",
        method: "POST",
        body: { password },
      }),
    }),
    verifyWebAuthnRegistration: builder.mutation<{ mfa_method: MfaMethod.WEBAUTHN }, VerifyWebAuthnRegistrationRequest>(
      {
        query: ({ challengeId, response }) => ({
          url: "users/me/mfa/webauthn/registration/verify",
          method: "POST",
          body: { challenge_id: challengeId, response },
        }),
      },
    ),
    updateMfaMethod: builder.mutation<{ mfa_method: MfaMethod }, UpdateMfaMethodRequest>({
      query: (body) => ({
        url: "users/me/mfa",
        method: "PUT",
        body,
      }),
    }),
    refreshSession: builder.mutation<FullAuthResponse, void>({
      query: () => ({ url: "auth/refresh", method: "POST" }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({ url: "auth/logout", method: "POST" }),
    }),
    getUsers: builder.query<User[], void>({
      query: () => ({
        url: "users",
        method: "GET",
      }),
    }),
    deleteUsers: builder.mutation<void, string>({
      query: (body: string) => ({
        url: `users/${body}`,
        method: "DELETE",
      }),
    }),
    changePassword: builder.mutation({
      query: (body: UpdatePasswordBody) => ({
        url: `users/password-change/${body.user_id}`,
        method: "PUT",
        body,
      }),
    }),
    changeEmail: builder.mutation({
      query: (body: { user_id: string; email: string }) => ({
        url: `users/${body.user_id}`,
        method: "PUT",
        body,
      }),
    }),
    changeUserAddress: builder.mutation<Address, UpdateDetailsBody>({
      query: (body: UpdateDetailsBody) => ({
        url: `users/change-address/${body.user_id}/address/${body.address_id}`,
        method: "PUT",
        body,
      }),
    }),
    changeUserDetails: builder.mutation<void, Partial<User>>({
      query: (body: Partial<User>) => ({
        url: `users/change-details/${body.user_id}`,
        method: "PUT",
        body,
      }),
    }),
    createNewAddress: builder.mutation<void, { user_id: string; address: Partial<Address> }>({
      query: (body: { user_id: string; address: Partial<Address> }) => ({
        url: `users/${body.user_id}/address`,
        method: "POST",
        body: body.address,
      }),
    }),
    getAddresses: builder.query<Address[], string>({
      query: (body: string) => ({
        url: `users/${body}/addresses`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useCreateUserFromAdminMutation,
  useLoginMutation,
  useVerifyEmailOtpMutation,
  useVerifyTotpMutation,
  useStartTotpEnrollmentMutation,
  useVerifyTotpEnrollmentMutation,
  useVerifyWebAuthnLoginMutation,
  useStartWebAuthnRegistrationMutation,
  useVerifyWebAuthnRegistrationMutation,
  useUpdateMfaMethodMutation,
  useLogoutMutation,
  useGetUsersQuery,
  useDeleteUsersMutation,
  useChangePasswordMutation,
  useChangeEmailMutation,
  useChangeUserAddressMutation,
  useChangeUserDetailsMutation,
  useCreateNewAddressMutation,
  useGetAddressesQuery,
} = accountsApiSlice;
