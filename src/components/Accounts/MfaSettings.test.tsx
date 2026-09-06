// @vitest-environment happy-dom

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { MfaMethod } from "@/enums/MfaMethod.ts";
import MfaSettings from "./MfaSettings.tsx";

const mocks = vi.hoisted(() => ({
  state: { auth: { user: { mfa_method: "EMAIL_OTP" } } },
  dispatch: vi.fn(),
  updateUserDetails: vi.fn((payload) => ({ type: "auth/updateUserDetails", payload })),
  updateMethod: vi.fn(),
  startTotpEnrollment: vi.fn(),
  verifyTotpEnrollment: vi.fn(),
  startWebAuthnRegistration: vi.fn(),
  verifyWebAuthnRegistration: vi.fn(),
  startRegistration: vi.fn(),
  toastSuccess: vi.fn(),
}));

vi.mock("@/hooks/hooks.ts", () => ({
  useAppDispatch: () => mocks.dispatch,
  useAppSelector: (selector: (state: typeof mocks.state) => unknown) => selector(mocks.state),
}));

vi.mock("./accountSlice.ts", () => ({
  updateUserDetails: mocks.updateUserDetails,
}));

vi.mock("./accountsApiSlice.ts", () => ({
  useUpdateMfaMethodMutation: () => [mocks.updateMethod, { isLoading: false }],
  useStartTotpEnrollmentMutation: () => [mocks.startTotpEnrollment, { isLoading: false }],
  useVerifyTotpEnrollmentMutation: () => [mocks.verifyTotpEnrollment],
  useStartWebAuthnRegistrationMutation: () => [mocks.startWebAuthnRegistration],
  useVerifyWebAuthnRegistrationMutation: () => [mocks.verifyWebAuthnRegistration],
}));

vi.mock("@simplewebauthn/browser", () => ({
  startRegistration: mocks.startRegistration,
  WebAuthnError: class extends Error {},
}));

vi.mock("react-hot-toast", () => ({
  default: { success: mocks.toastSuccess },
}));

const result = (value: unknown) => ({ unwrap: () => Promise.resolve(value) });
const failure = () => ({ unwrap: () => Promise.reject(new Error("request failed")) });

describe("MfaSettings", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(async () => {
    vi.clearAllMocks();
    mocks.updateMethod.mockReturnValue(result({ mfa_method: MfaMethod.NONE }));
    mocks.startTotpEnrollment.mockReturnValue(
      result({
        challenge_id: "challenge-id",
        otpauth_uri: "otpauth://totp/Zielony%20Koszyk:user@example.com",
        secret: "ABCDEFGHIJKLMNOP",
      }),
    );
    mocks.startWebAuthnRegistration.mockReturnValue(
      result({ challenge_id: "webauthn-challenge", options: { challenge: "registration-options" } }),
    );
    mocks.startRegistration.mockResolvedValue({ id: "credential-id" });
    mocks.verifyWebAuthnRegistration.mockReturnValue(result({ mfa_method: MfaMethod.WEBAUTHN }));
    container = document.createElement("div");
    document.body.replaceChildren(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
  });

  const render = async (method = MfaMethod.EMAIL_OTP) => {
    mocks.state.auth.user.mfa_method = method;
    await act(async () => root.render(<MfaSettings />));
  };

  const choose = async (method: MfaMethod) => {
    const radio = container.querySelector<HTMLInputElement>(`input[value="${method}"]`);
    if (!radio) throw new Error(`Missing ${method} radio`);
    await act(async () => radio.click());
  };

  const enterPassword = async (password: string) => {
    const input = container.querySelector<HTMLInputElement>('input[type="password"]');
    if (!input) throw new Error("Missing password input");
    await act(async () => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
      setter?.call(input, password);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
  };

  const submit = async () => {
    const form = container.querySelector("form");
    if (!form) throw new Error("Missing form");
    await act(async () => {
      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      await Promise.resolve();
    });
  };

  it("shows current method and all available choices", async () => {
    await render();

    expect(container.textContent).toContain("Aktywna: Kod e-mail");
    expect(container.textContent).toContain("Aplikacja uwierzytelniająca");
    expect(container.textContent).toContain("Klucz platformowy");
    expect(container.textContent).toContain("Wyłączone");
  });

  it("disables MFA only after password confirmation", async () => {
    await render();
    await choose(MfaMethod.NONE);
    await enterPassword("valid-password");
    await submit();

    expect(mocks.updateMethod).toHaveBeenCalledWith({
      method: MfaMethod.NONE,
      password: "valid-password",
    });
    expect(mocks.dispatch).toHaveBeenCalledWith({
      type: "auth/updateUserDetails",
      payload: { mfa_method: MfaMethod.NONE },
    });
  });

  it("activates email OTP from the same method selector", async () => {
    mocks.updateMethod.mockReturnValue(result({ mfa_method: MfaMethod.EMAIL_OTP }));
    await render(MfaMethod.NONE);
    await choose(MfaMethod.EMAIL_OTP);
    await enterPassword("valid-password");
    await submit();

    expect(mocks.updateMethod).toHaveBeenCalledWith({
      method: MfaMethod.EMAIL_OTP,
      password: "valid-password",
    });
    expect(mocks.dispatch).toHaveBeenCalledWith({
      type: "auth/updateUserDetails",
      payload: { mfa_method: MfaMethod.EMAIL_OTP },
    });
  });

  it("keeps current method during TOTP enrollment and supports cancellation", async () => {
    await render();
    await choose(MfaMethod.TOTP);
    await enterPassword("valid-password");
    await submit();

    expect(container.textContent).toContain("Dokończ konfigurację TOTP");
    expect(container.textContent).toContain("Dotychczasowa metoda pozostaje aktywna");
    expect(container.querySelector<HTMLInputElement>('input[value="ABCDEFGHIJKLMNOP"]')).not.toBeNull();
    expect(mocks.dispatch).not.toHaveBeenCalled();

    const cancel = [...container.querySelectorAll("button")].find((button) => button.textContent === "Wróć");
    if (!cancel) throw new Error("Missing cancel button");
    await act(async () => cancel.click());

    expect(container.textContent).not.toContain("Dokończ konfigurację TOTP");
    expect(container.textContent).toContain("Aktywna: Kod e-mail");
  });

  it("completes WebAuthn registration from the same method selector", async () => {
    await render(MfaMethod.NONE);
    await choose(MfaMethod.WEBAUTHN);
    await enterPassword("valid-password");
    await submit();

    expect(mocks.startWebAuthnRegistration).toHaveBeenCalledWith("valid-password");
    expect(mocks.startRegistration).toHaveBeenCalledWith({
      optionsJSON: { challenge: "registration-options" },
    });
    expect(mocks.verifyWebAuthnRegistration).toHaveBeenCalledWith({
      challengeId: "webauthn-challenge",
      response: { id: "credential-id" },
    });
    expect(mocks.dispatch).toHaveBeenCalledWith({
      type: "auth/updateUserDetails",
      payload: { mfa_method: MfaMethod.WEBAUTHN },
    });
  });

  it("shows recoverable request errors without changing current method", async () => {
    mocks.updateMethod.mockReturnValue(failure());
    await render();
    await choose(MfaMethod.NONE);
    await enterPassword("wrong-password");
    await submit();

    expect(container.querySelector('[role="alert"]')?.textContent).toContain("Sprawdź aktualne hasło");
    expect(container.textContent).toContain("Aktywna: Kod e-mail");
    expect(mocks.dispatch).not.toHaveBeenCalled();
  });
});
