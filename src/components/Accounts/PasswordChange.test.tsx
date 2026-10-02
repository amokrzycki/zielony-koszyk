// @vitest-environment happy-dom

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import PasswordChange from "./PasswordChange.tsx";

const mocks = vi.hoisted(() => ({
  state: { auth: { user: { user_id: "user-1" } } },
  changePassword: vi.fn(),
  navigate: vi.fn(),
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock("@/hooks/hooks.ts", () => ({
  useAppSelector: (selector: (state: typeof mocks.state) => unknown) => selector(mocks.state),
}));

vi.mock("./accountsApiSlice.ts", () => ({
  useChangePasswordMutation: () => [mocks.changePassword, { isLoading: false }],
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => mocks.navigate,
}));

vi.mock("react-hot-toast", () => ({
  default: { success: mocks.toastSuccess, error: mocks.toastError },
}));

const result = (value: unknown) => ({ unwrap: () => Promise.resolve(value) });
const failure = () => ({ unwrap: () => Promise.reject(new Error("request failed")) });

describe("PasswordChange", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    vi.clearAllMocks();
    container = document.createElement("div");
    document.body.replaceChildren(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
  });

  const render = async () => {
    await act(async () => root.render(<PasswordChange />));
  };

  const enterPasswords = async (oldPassword: string, password: string, confirmation = password) => {
    const inputs = container.querySelectorAll<HTMLInputElement>("input");
    const values = [oldPassword, password, confirmation];
    await act(async () => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
      inputs.forEach((input, index) => {
        setter?.call(input, values[index]);
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });
    });
  };

  const submit = async () => {
    const form = container.querySelector("form");
    if (!form) throw new Error("Missing form");
    await act(async () => {
      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      await Promise.resolve();
      await Promise.resolve();
    });
  };

  it("sends the new password and returns to the account page on success", async () => {
    mocks.changePassword.mockReturnValue(result(undefined));
    await render();
    await enterPasswords("starehaslo", "Nowehaslo1!");
    await submit();

    expect(mocks.changePassword).toHaveBeenCalledWith({
      user_id: "user-1",
      password: "starehaslo",
      new_password: "Nowehaslo1!",
    });
    expect(mocks.toastSuccess).toHaveBeenCalledWith("Hasło zostało zmienione");
    expect(mocks.navigate).toHaveBeenCalledWith("/konto");
  });

  it("shows the failure and keeps the user on the form when the change is rejected", async () => {
    mocks.changePassword.mockReturnValue(failure());
    await render();
    await enterPasswords("starehaslo", "Nowehaslo1!");
    await submit();

    expect(container.querySelector('[role="alert"]')?.textContent).toContain("Sprawdź aktualne hasło");
    expect(mocks.navigate).not.toHaveBeenCalled();
    expect(mocks.toastSuccess).not.toHaveBeenCalled();
  });
});
